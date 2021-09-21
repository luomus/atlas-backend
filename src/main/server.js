global.__rootdir = __dirname
const express = require('express')
const sqlite3 = require('sqlite3')
const root = require('./domain/routes/root.js')
const BirdDao = require("./dao/bird_dao")
const BirdGridDao = require("./dao/bird_grid_dao")
const Birds = require('./domain/routes/birds.js')
const Grids = require('./domain/routes/grids.js')
const app = express()
const port = 3000

db = new sqlite3.Database('./birds.db', (err) => {
  if (err) console.log('Could not connect to database', err)
  else console.log('Connected to database')
})

birdDao = new BirdDao(db)
birds = new Birds(birdDao)
birdGridDao = new BirdGridDao(db)
grids = new Grids(birdGridDao)

app.use(express.static(__rootdir + '/ui'))

app.get('/', root)

app.get('/api/birds', birds.getAll())

app.get('/api/grids', grids.getAll())

app.get('/api/map', function (req, res) {
  res.sendFile(__rootdir + '/ui/bird_atlas/map_of_finland.svg')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})