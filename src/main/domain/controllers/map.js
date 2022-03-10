const fs = require('fs')
const createAtlasMap = require('../maps/create_atlas_map')
const MapService = require('../maps/map_service')
const configFile = fs.readFileSync('atlas-config.json')
const config = JSON.parse(configFile)
const Querier = require('../../dao/querier')
const GridDao = require('../../dao/grid_dao')
const AtlasGridSPeciesDataDao = require('../../dao/atlas_grid_species_data_dao')
const AtlasGridDao = require('../../dao/atlas_grid_dao')
const querier = Querier()
const atlasGridSpeciesDataDao = new AtlasGridSPeciesDataDao(querier)
const atlasGridDao = new AtlasGridDao(querier)
const gridDao = new GridDao(querier)

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
    } catch (err) {
      console.error(err)
    }
    return geoJsonArray
  }


  /**
   * Creates an image of the grid with a bird's breeding data.
   * @returns {SVGElement}
   */
  /* eslint-disable max-len */
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

  createGridForCurrentBirdData() {
    return async (req, res) => {
      try {
        const { speciesId } = req.params
        let breedingData = await atlasGridSpeciesDataDao.getGridAndBreedingdataForSpeciesAndActiveAtlas(speciesId)
        let species = (await atlasGridSpeciesDataDao.getSpecies(speciesId)).data

        breedingData = breedingData.data.results.map((data) => {
          return {
            grid: `http://tun.fi/YKJ.${data['aggregateBy']['gathering.conversions.ykj10kmCenter.lat'].slice(0,3)}:${data['aggregateBy']['gathering.conversions.ykj10kmCenter.lon'].slice(0,3)}`,
            atlasClass: data.atlasClassMax,
          }
        })

        if (req.query.type === 'png') {
          const callback = (png) => res.send(png)
          res.setHeader('Content-Type', 'image/png')
          mapService.getSpeciesMap(breedingData, [], species, callback, 'png', req.query.scaling, req.query.language, __latestAtlas, req.query.showActivity === "true")
        } else {
          res.setHeader('Content-Type', 'image/svg+xml')
          res.send(mapService.getSpeciesMap(breedingData, [], species, undefined, 'svg', req.query.scaling, req.query.language, __latestAtlas, req.query.showActivity === "true"))
        }
      } catch (e) {
        res.status(500).send(e.message)
      }
    }
  }
  /* eslint-enable max-len */
}

module.exports = Map
