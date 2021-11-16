global.__rootdir = __dirname
const express = require('express')
const sqlite3 = require('sqlite3')
const Querier = require('./dao/querier')
const BirdDao = require('./dao/bird_dao')
const BirdGridDao = require('./dao/bird_grid_dao')
const GridDao = require('./dao/grid_dao')
const Birds = require('./domain/routes/birds.js')
const Grid = require('./domain/routes/grid')
const MapService = require('./domain/maps/map_service')
const fs = require('fs')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const app = express()
const createAtlasMap = require('./domain/maps/create_atlas_map')

const path = __dirname + '/openAPI.yaml'
try {
  if (fs.existsSync(path)) {
    const swaggerDocument = YAML.load(path)
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    app.get('/', (req, res) => res.redirect('/doc') )
  }
} catch (ignore) {}


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
  const mapService = MapService(createAtlasMap(gridArray, geoJsonArray))
  const grid = new Grid(gridDao, mapService, birdGridDao, birdDao)

  app.get('/api/grid/map/data', grid.createGridForBirdData())
})

app.use(express.static(__rootdir + '/ui'))

app.get('/api/birds', birds.getAll())
app.get('/api/species', birds.getAllAtlas3DataBySpecies())
app.get('/api/species/data', birds.getGridAndBreedingdataForBird())

app.compileMapServiceForDelivery = function() {
  const requireRegEx = /^\s*const\s[{\s\w\d,_$}]+\s*=\s*require\(.*?\).*\n/gm
  const moduleExportsRegEx = /module\.exports\s*=\s*[{\s\w\d,_$}]+.+(\n|$)/gm
  try {
    let mapServiceFile = fs.readFileSync(__dirname + '/domain/maps/map_service.js', 'utf8')
    let svgImageFile = fs.readFileSync(__dirname + '/domain/maps/svg_image.js', 'utf8')
    mapServiceFile = mapServiceFile.replace(requireRegEx, '')
    mapServiceFile = mapServiceFile.replace(moduleExportsRegEx, '')
    svgImageFile = svgImageFile.replace(requireRegEx, '')
    svgImageFile = svgImageFile.replace(moduleExportsRegEx, '')
    return mapServiceFile + svgImageFile
  } catch (err) {
    console.error(err)
  }
}

const compiledMapService = app.compileMapServiceForDelivery()

fs.writeFile(__dirname + '/static/map_service.js', compiledMapService, (err) => {
  if (err) console.error(err)
  else console.log('Map service successfully compiled for delivery')
})

module.exports = app
