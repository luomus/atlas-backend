const fs = require('fs')
const createAtlasMap = require('../maps/create_atlas_map')
const MapService = require('../maps/map_service')
const configFile = fs.readFileSync('atlas-config.json')
const config = JSON.parse(configFile)
const Querier = require('../../dao/querier')
const SpeciesDao = require('../../dao/species_dao')
const GridDao = require('../../dao/grid_dao')
const AtlasDataDao = require('../../dao/atlas_data_dao')
const AtlasGridDao = require('../../dao/atlas_grid_dao')
const querier = Querier()
const atlasDataDao = new AtlasDataDao(querier)
const atlasGridDao = new AtlasGridDao(querier)
const speciesDao = new SpeciesDao(querier)
const gridDao = new GridDao(querier)

let mapService

class Map {
  /**
     * @constructor
     */
  constructor() {
    this.createBaseMap()
  }

  createBaseMap() {
    gridDao.getAllGrids().then((gridArray) => {
      gridArray = gridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
      const geoJsonArray = this.readBaseMapFiles()
      mapService = MapService(createAtlasMap(gridArray, geoJsonArray, config), config)
    })
  }

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
     * A method that creates an image of the grid with a bird's breeding data.
     * @returns {SVGElement}
     */
  createGridForBirdData() {
    return async (req, res) => {
      const breedingData = await atlasDataDao.getGridAndBreedingdataForSpeciesAndAtlas(req.param('speciesId'), req.param('atlasId')).catch(e => [])
      const species = await speciesDao.getById(req.param('speciesId')).catch(e => [])
      const atlasGrid = await atlasGridDao.getAllBirdAtlasGridInfoByAtlas(req.param('atlasId')).catch(e => [])
      if (req.param('type') === 'png') {
        const callback = (png) => res.send(png)
        res.setHeader('Content-Type', 'image/png')
        mapService.getSpeciesMap(breedingData, atlasGrid, species[0], callback, 'png', req.param('scaling'), req.param('language'), req.param('atlasId'))
      } else {
        res.setHeader('Content-Type', 'image/svg+xml')
        res.send(mapService.getSpeciesMap(breedingData, atlasGrid, species[0], undefined, 'svg', req.param('scaling'), req.param('language'), req.param('atlasId')))
      }
    }
  }
}

module.exports = Map
