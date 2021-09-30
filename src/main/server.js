global.__rootdir = __dirname
const express = require('express')
const sqlite3 = require('sqlite3')
const root = require('./domain/routes/root.js')
const querierFactory = require('./dao/querier_factory')
const BirdDao = require("./dao/bird_dao")
const GridDao = require("./dao/grid_dao")
const BirdGridDao = require("./dao/bird_grid_dao")
const GridDao = require("./dao/grid_dao")
const Birds = require('./domain/routes/birds.js')
const Grids = require('./domain/routes/grids.js')
const Grid = require('./domain/routes/grid')
const MapService = require('./domain/maps/map_service')
const app = express()


db = new sqlite3.Database('./birds.db', (err) => {
  if (err) console.log('Could not connect to database', err)
  else console.log('Connected to database')
})

const querier = querierFactory(db)
const birdDao = new BirdDao(querier)
const gridDao = new GridDao(querier)
const birdGridDao = new BirdGridDao(querier)
const birds = new Birds(birdDao, birdGridDao)
const grids = new Grids(gridDao)


mapService = MapService()
grid = new Grid(gridDao, mapService)

app.use(express.static(__rootdir + '/ui'))

app.get('/', root)

app.get('/api/birds', birds.getAll())

app.get('/api/grid', grids.getAll())

app.get('/api/species', birds.getAllAtlas3DataBySpecies())


app.get('/api/map', function (req, res) {
  res.sendFile(__rootdir + '/ui/bird_atlas/map_of_finland.svg')
})

module.exports = app
