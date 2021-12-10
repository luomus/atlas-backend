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

  /**
   * Creates a basemap of Finland for atlas datapoints from the basemap files and an empty grid.
   */
  createBaseMap() {
    gridDao.getAllGrids().then((gridArray) => {
      gridArray = gridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
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
  createGridForBirdData() {
    return (req, res) => {
      atlasDataDao.getGridAndBreedingdataForSpeciesAndAtlas(req.param('speciesId'), req.param('atlasId')).then((data) => {
        speciesDao.getById(req.param('speciesId')).then((species) => {
          atlasGridDao.getAllBirdAtlasGridInfoByAtlas(req.param('atlasId')).then((grid) => {
            if (req.param('type') === 'png') {
              const callback = (png) => res.send(png)
              res.setHeader('Content-Type', 'image/png')
              mapService.getSpeciesMap(data, grid, species[0], callback, 'png', req.param('scaling'), req.param('language'), req.param('atlasId'))
            } else {
              res.setHeader('Content-Type', 'image/svg+xml')
              res.send(mapService.getSpeciesMap(data, grid, species[0], undefined, 'svg', req.param('scaling'), req.param('language'), req.param('atlasId')))
            }
          })
        })
      })
    }
  }
}

module.exports = Map
