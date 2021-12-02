const fs = require('fs')
const createAtlasMap = require('../maps/create_atlas_map')
const MapService = require('../maps/map_service')
const configFile = fs.readFileSync('atlas-config.json')
const configObject = JSON.parse(configFile)
const Querier = require('../../dao/querier')
const BirdDao = require('../../dao/bird_dao')
const GridDao = require('../../dao/grid_dao')
const BirdGridDao = require('../../dao/bird_grid_dao')
const querier = Querier()
const birdGridDao = new BirdGridDao(querier)
const birdDao = new BirdDao(querier)
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
    console.log('täällä! createBaseMap()')
    gridDao.getAllGrids().then((gridArray) => {
      gridArray = gridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
      const geoJsonArray = this.readBaseMapFiles()
      mapService = MapService(createAtlasMap(gridArray, geoJsonArray, configObject), configObject)
    })
  }
  
  readBaseMapFiles() {
    console.log('täällä! createBaseMap()')
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
    return (req, res) => {
      console.log('kysytään lintua: ', req.param('speciesId'))
      birdGridDao.getGridAndBreedingdataForBird(req.param('speciesId')).then((data) => {
        birdDao.getById(req.param('speciesId')).then((species) => {
          console.log('lintu grid.js:ssä: ', species)
          if (req.param('type') === 'png') {
            const callback = (png) => res.send(png)
            res.setHeader('Content-Type', 'image/png')
            mapService.getSpeciesMap(data, species, callback, 'png', req.param('scaling'), req.param('language'))
          } else {
            res.setHeader('Content-Type', 'image/svg+xml')
            res.send(mapService.getSpeciesMap(
                data, species, undefined, 'svg', req.param('scaling'), req.param('language'),
            ))
          }
        })
      })
    }
  }

}

module.exports = Map
