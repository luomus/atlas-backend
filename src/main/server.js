global.__rootdir = __dirname
global.__latestAtlas = 4
const express = require('express')
const cors = require('cors')
//const sqlite3 = require('sqlite3')
const fs = require('fs')
const YAML = require('yamljs')
const cron = require('node-cron')
const oracledb = require('oracledb')
const config = require('./dao/dbConfig')
const app = express()
// global.db = new sqlite3.Database('./birds.db', (err) => {
//   if (err) console.log('Could not connect to database', err)
//   else console.log('Connected to database')
// })

async function main() {
  const Querier = require('./dao/querier')
  const path = __dirname + '/openAPI.yaml'

  try {
    if (fs.existsSync(path)) {
      const swaggerDocument = YAML.load(path)
      app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
      app.get('/', (req, res) => res.redirect('/doc') )
    }
  } catch (ignore) {
  }

  await Querier.initialize()

  const AtlasGridUpdater = require('./domain/updater/atlasGridUpdater')
  const atlasGridUpdater = new AtlasGridUpdater()
  const StatsUpdater = require('./domain/updater/statsUpdater')
  const statsUpdater = new StatsUpdater()
  const CompleteListUpdater = require('./domain/updater/completeListUpdater')
  const completeListUpdater = new CompleteListUpdater()
  const PythonMapUpdater = require('./domain/updater/pythonMapUpdater')
  const pythonMapUpdater = new PythonMapUpdater()
  const gridRouter = require('./domain/routers/gridRouter')
  const mapRouter = require('./domain/routers/mapRouter')
  const taxonRouter = require('./domain/routers/taxonRouter')
  const birdAssociationRouter = require('./domain/routers/birdAssociationRouter')
  const healthRouter = require('./domain/routers/healthRouter')
  const observerRouter = require('./domain/routers/observerRouter')

  app.use(cors())

  app.get('/', (req, res) => res.redirect('/doc'))

  app.use(express.static(__rootdir + '/static'))

  app.use('/api/v1/grid', gridRouter)
  app.use('/api/v1/map', mapRouter)
  app.use('/api/v1/taxon/', taxonRouter)
  app.use('/api/v1/birdAssociation', birdAssociationRouter)
  app.use('/api/v1/observer', observerRouter)
  app.use('/api/v1/health', healthRouter)

  async function update() {
    await atlasGridUpdater.update()
    await statsUpdater.update()
    await completeListUpdater.update()
    await pythonMapUpdater.update()
  }

  cron.schedule('0 0 */3 * * *', async () => {
    await update()
  })

  update()
}

main()

module.exports = app
