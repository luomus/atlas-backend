const express = require('express')
const app = express()
const mapRouter = require('express').Router()
const fs = require('fs')
const createAtlasMap = require('../domain/maps/create_atlas_map')
const MapService = require('../domain/maps/map_service')
const Querier = require('../dao/querier')
const BirdDao = require('../dao/bird_dao')
const GridDao = require('../dao/grid_dao')
const BirdGridDao = require('../dao/bird_grid_dao')
const Birds = require('../domain/routes/birds')
const Map = require('../domain/routes/map')
const querier = Querier()
const birdGridDao = new BirdGridDao(querier)
const birdDao = new BirdDao(querier)
const gridDao = new GridDao(querier)
const birds = new Birds(birdDao, birdGridDao)
const configFile = fs.readFileSync('atlas-config.json')
const configObject = JSON.parse(configFile)
let map


app.createBaseMap = function() {
  gridDao.getAllGrids().then((gridArray) => {
    gridArray = gridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
    const geoJsonArray = app.readBaseMapFiles()
    const mapService = MapService(createAtlasMap(gridArray, geoJsonArray, configObject), configObject)
    map = new Map(gridDao, mapService, birdGridDao, birdDao)
  })
}

app.readBaseMapFiles = function() {
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

mapRouter.get('/', birds.getAll())
mapRouter.get('/:speciesId')
mapRouter.get('/:speciesId/atlas')

mapRouter.get('/:speciesId/atlas/:atlasId', () => {
  app.createBaseMap()
  map.createGridForBirdData()
})

mapRouter.get('/:speciesId/change')
mapRouter.get('/:speciesId/change/:atlasId')





module.exports = mapRouter
