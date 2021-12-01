global.__rootdir = __dirname
const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3')
const Querier = require('./dao/querier')
const BirdDao = require('./dao/bird_dao')
const BirdGridDao = require('./dao/bird_grid_dao')
const GridDao = require('./dao/grid_dao')
const Birds = require('./domain/routes/birds.js')
const Grid = require('./domain/routes/grid')
const MapService = require('./domain/maps/map_service')
const fs = require('fs')
const YAML = require('yamljs')
const app = express()
const createAtlasMap = require('./domain/maps/create_atlas_map')
const gridRouter = require('./controllers/grid_router')
const mapRouter = require('./controllers/map_router')
const taxonRouter = require('./controllers/taxon_router')

const configFile = fs.readFileSync('atlas-config.json')
const configObject = JSON.parse(configFile)


const path = __dirname + '/openAPI.yaml'
try {
  if (fs.existsSync(path)) {
    const swaggerDocument = YAML.load(path)
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    app.get('/', (req, res) => res.redirect('/doc') )
  }
} catch (ignore) {}

app.use(cors())

app.get('/', (req, res) => res.redirect('/doc'))

const db = new sqlite3.Database('./birds.db', (err) => {
  if (err) console.log('Could not connect to database', err)
  else console.log('Connected to database')
})

const querier = Querier(db)
const birdDao = new BirdDao(querier)
const gridDao = new GridDao(querier)
const birdGridDao = new BirdGridDao(querier)
const birds = new Birds(birdDao, birdGridDao)

app.readBaseMapFiles = function() {
  const geoJsonArray = []
  try {
    const baseMapGrid = fs.readFileSync(__dirname + '/geojson/YKJ100km.geojson')
    const finnishBorders = fs.readFileSync(__dirname + '/geojson/finnish_borders.geojson')
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

gridDao.getAllGrids().then((gridArray) => {
  gridArray = gridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
  const geoJsonArray = app.readBaseMapFiles()
  const mapService = MapService(createAtlasMap(gridArray, geoJsonArray, configObject), configObject)
  const grid = new Grid(gridDao, mapService, birdGridDao, birdDao)

  app.get('/api/grid/map/data', grid.createGridForBirdData())
})

app.use(express.static(__rootdir + '/static'))

// app.get('/api/birds', birds.getAll())
// app.get('/api/species', birds.getAllAtlas3DataBySpecies())
app.get('/api/species/data', birds.getGridAndBreedingdataForBird())
app.use('/api/v1/taxon', taxonRouter)
app.use('/api/v1/grid', gridRouter)

module.exports = app