const Taxon = require('../controllers/taxon.js')
const Map = require('../controllers/map')
const taxon = new Taxon()
const map = new Map()

const mapRouter = require('express').Router()

mapRouter.get('/', taxon.getAll())
mapRouter.get('/:speciesId')
mapRouter.get('/:speciesId/atlas')

mapRouter.get('/:speciesId/atlas/:atlasId', map.createGridForBirdData())

mapRouter.get('/:speciesId/change')
mapRouter.get('/:speciesId/change/:atlasId')


module.exports = mapRouter
