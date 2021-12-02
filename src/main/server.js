global.__rootdir = __dirname
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const YAML = require('yamljs')
const app = express()
const gridRouter = require('./controllers/grid_router')
const mapRouter = require('./controllers/map_router')
const taxonRouter = require('./controllers/taxon_router')


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

// const db = new sqlite3.Database('./birds.db', (err) => {
//   if (err) console.log('Could not connect to database', err)
//   else console.log('Connected to database')
// })


app.use(express.static(__rootdir + '/static'))

// app.get('/api/birds', birds.getAll())
// app.get('/api/species', birds.getAllAtlas3DataBySpecies())
// app.get('/api/species/data', birds.getGridAndBreedingdataForBird())
app.use('/api/v1/taxon', taxonRouter)
// app.use('/api/v1/grid', gridRouter)
app.use('/api/v1/map', mapRouter)

module.exports = app