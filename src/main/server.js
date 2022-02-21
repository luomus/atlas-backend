global.__rootdir = __dirname
global.__latestAtlas = 4
const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3')
const fs = require('fs')
const YAML = require('yamljs')
const app = express()
// global.db = new sqlite3.Database('./birds.db', (err) => {
//   if (err) console.log('Could not connect to database', err)
//   else console.log('Connected to database')
// })
const gridRouter = require('./domain/routers/grid_router')
const mapRouter = require('./domain/routers/map_router')
const taxonRouter = require('./domain/routers/taxon_router')


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

app.use(express.static(__rootdir + '/static'))

app.use('/api/v1/taxon', taxonRouter)
app.use('/api/v1/area', gridRouter)
app.use('/api/v1/map', mapRouter)


module.exports = app
