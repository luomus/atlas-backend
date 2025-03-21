const fs = require('fs')
const createAtlasMap = require('../maps/createAtlasMap')
const MapService = require('../maps/mapService')
const configFile = fs.readFileSync('atlas-config.json')
const config = JSON.parse(configFile)
const Querier = require('../../dao/querier')
const GridDao = require('../../dao/gridDao')
const AtlasGridSPeciesDataDao = require('../../dao/atlasGridSpeciesDataDao')
const AtlasGridDao = require('../../dao/atlasGridDao')
const axios = require('axios')
const Cache = require('../../dao/cache')
const ApiDao = require('../../dao/apiDao')
const apiDao = new ApiDao(axios, new Cache())
const querier = new Querier()
const atlasGridSpeciesDataDao = new AtlasGridSPeciesDataDao(querier)
const atlasGridDao = new AtlasGridDao(querier)
const gridDao = new GridDao(querier)
const InteractiveMapGenerator =  require('../../../python/interactiveMapGenerator')
const interactiveMapGenerator = new InteractiveMapGenerator()

let mapService

class Map {
  /**
   * @constructor
   */
  constructor() {
    this.createBaseMap()
  }

  /**
   * Creates a basemap of Finland for atlas datapoints from the basemap files and an empty grid.
   */
  createBaseMap() {
    gridDao.getAll().then((gridArray) => {
      gridArray = gridArray.map((rect) => (
        {...rect, n: rect.coordinates.split(':')[0], e: rect.coordinates.split(':')[1]}
      ))
      const geoJsonArray = this.readBaseMapFiles()
      mapService = MapService(createAtlasMap(gridArray, geoJsonArray, config), config)
    })
  }

  /**
   * Reads the basemap files from geojson to an array.
   * @returns {Array}
   */
  readBaseMapFiles() {
    const geoJsonArray = []
    try {
      const baseMapGrid = fs.readFileSync('src/main/geojson/YKJ100km.geojson')
      const finnishBorders = fs.readFileSync('src/main/geojson/finnish_borders.geojson')
      geoJsonArray.push({
        geoJson: JSON.parse(baseMapGrid),
        id: 'YKJ100km',
      })
      geoJsonArray.push({
        geoJson: JSON.parse(finnishBorders),
        id: 'borders',
      })
    } catch (e) {
      console.error(new Date().toString() + ' ' + e.message)
    }
    return geoJsonArray
  }


  /**
   * Creates an image of the grid with a bird's breeding data.
   * @returns {SVGElement}
   */
  createGridForBirdData() {
    return async (req, res) => {
      try {
        const {speciesId, atlasId} = req.params
        const breedingData = await atlasGridSpeciesDataDao.getGridAndBreedingdataForSpeciesAndAtlas(speciesId, atlasId).catch((e) => {return res.json(e.message)})
        const atlasGrid = await atlasGridDao.getAllGridInfoForAtlas(atlasId).catch((e) => {return res.json(e.message)})
        if (breedingData === 'Empty result' || atlasGrid === 'Empty result')
          return res.json('Error: Empty result')
        else
        if (req.query.type === 'png') {
          const callback = (png) => res.send(png)
          res.setHeader('Content-Type', 'image/png')
          mapService.getSpeciesMap(breedingData, atlasGrid, callback, 'png', req.query.scaling, req.query.language, atlasId)
        } else {
          res.setHeader('Content-Type', 'image/svg+xml')
          res.send(mapService.getSpeciesMap(breedingData, atlasGrid, undefined, 'svg', req.query.scaling, req.query.language, atlasId))
        }
      } catch (e) {
        res.status(500).send(e.message)
      }
    }
  }


  /**
   * Creates an image of the grid with a bird's breeding data for current active atlas, breedig data fetched from laji api
   * @returns {SVGElement}
   */
  createGridForCurrentBirdData() {
    return async (req, res) => {
      try {
        const { speciesId } = req.params
        let breedingData = await apiDao.getGridAndBreedingdataForSpeciesAndActiveAtlas(speciesId)
        const atlasGrid = await atlasGridDao.getAllForAtlasId(__latestAtlas)
        const species = await apiDao.getSpecies(speciesId)

        breedingData = breedingData.map((data) => {
          return {
            grid: `http://tun.fi/YKJ.${data['aggregateBy']['gathering.conversions.ykj10kmCenter.lat'].slice(0,3)}:${data['aggregateBy']['gathering.conversions.ykj10kmCenter.lon'].slice(0,3)}`,
            atlasClass: data.atlasClassMax,
          }
        })

        if (req.query.type === 'png') {
          const callback = (png) => res.send(png)
          res.setHeader('Content-Type', 'image/png')
          mapService.getSpeciesMap(breedingData, atlasGrid, species, callback, 'png', req.query.scaling, req.query.language, __latestAtlas, req.query.showActivity === "true")
        } else {
          res.setHeader('Content-Type', 'image/svg+xml')
          res.send(mapService.getSpeciesMap(breedingData, atlasGrid, species, undefined, 'svg', req.query.scaling, req.query.language, __latestAtlas, req.query.showActivity === "true"))
        }
      } catch (e) {
        console.error(new Date().toString() + ' ' + e.message)
        res.status(500).send(e.message)
      }
    }
  }

  /**
   * Gets an HTLM text for the interactive map of Lappi squares
   * @returns {HTMLString}
   */
  getInteractiveMap() {
    return async (req, res) => {
      try {
        const mapHTML = await interactiveMapGenerator.getInteractiveMap()

        if (!mapHTML) {
          return res.status(500).send('Could not generate interactive map')
        }
        res.setHeader('Content-Type', 'text/html')
        res.send(mapHTML)
      } catch (e) {
        res.status(500).send(e.message)
      }
    }
  }
  /* eslint-enable max-len */
}

module.exports = Map
