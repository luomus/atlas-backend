global.__rootdir = __dirname
const express = require('express')
const sqlite3 = require('sqlite3')
const root = require('./domain/routes/root.js')
const Querier = require('./dao/querier')
const BirdDao = require("./dao/bird_dao")
const BirdGridDao = require("./dao/bird_grid_dao")
const GridDao = require("./dao/grid_dao")
const Birds = require('./domain/routes/birds.js')
const Grid = require('./domain/routes/grid')
const MapService = require('./domain/maps/map_service')
const fs = require('fs')
const app = express()


const db = new sqlite3.Database('./birds.db', (err) => {
  if (err) console.log('Could not connect to database', err)
  else console.log('Connected to database')
})

const querier = Querier(db)
const birdDao = new BirdDao(querier)
const gridDao = new GridDao(querier)
const birdGridDao = new BirdGridDao(querier)
const birds = new Birds(birdDao, birdGridDao)

gridDao.getAllGrids().then(gridArray => {
  gridArray = gridArray.map(rect => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
  const mapService = MapService(undefined, gridArray)
  const grid = new Grid(gridDao, mapService, birdGridDao)

  try {
    let baseMapGrid = fs.readFileSync(__dirname + '/geojson/YKJ100km.geojson')
    let finnishBorders = fs.readFileSync(__dirname + '/geojson/finnish_borders.geojson')
    mapService.addToBaseMap(JSON.parse(baseMapGrid))
    mapService.addToBaseMap(JSON.parse(finnishBorders))
  } catch (err) {
    console.error(err)
  }

  app.get('/api/grid', grid.getAll())
  app.get('/api/grid/map', grid.getGrid())
  app.get('/api/grid/map/data', grid.createGridForBirdData())
})

app.use(express.static(__rootdir + '/ui'))

app.get('/', root)
app.get('/api/birds', birds.getAll())
app.get('/api/species', birds.getAllAtlas3DataBySpecies())
app.get('/api/species/data', birds.getGridAndBreedingdataForBird())
app.get('/api/map', function (req, res) {
  res.sendFile(__rootdir + '/ui/bird_atlas/map_of_finland.svg')
})

app.compileMapServiceForDelivery = function () {
  const requireRegEx = /^\s*const\s[{\s\w\d,_$}]+\s*=\s*require\(.*?\).*\n/gm
  const moduleExportsRegEx = /module\.exports\s*=\s*[{\s\w\d,_$}]+.+(\n|$)/gm
  try {
    let map_service = fs.readFileSync(__dirname + '/domain/maps/map_service.js', 'utf8')
    let svg_service = fs.readFileSync(__dirname + '/domain/maps/svg_image.js', 'utf8')
    map_service = map_service.replace(requireRegEx, "")
    map_service = map_service.replace(moduleExportsRegEx, "")
    svg_service = svg_service.replace(requireRegEx, "")
    svg_service = svg_service.replace(moduleExportsRegEx, "")
    return map_service + svg_service
  } catch (err) {
    console.error(err)
  }
}

const compiledMapService = app.compileMapServiceForDelivery()

fs.writeFile(__dirname + '/ui/bird_atlas/map_service.js', compiledMapService, err => {
  if (err) console.error(err)
  else console.log("Map service successfully compiled for delivery")
})

module.exports = app
