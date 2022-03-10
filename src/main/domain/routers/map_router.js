// const Taxon = require('../controllers/taxon.js')
const Map = require('../controllers/map')
// const taxon = new Taxon()
const map = new Map()

// eslint-disable-next-line new-cap
const mapRouter = require('express').Router()

//mapRouter.get('/')
mapRouter.get('/:speciesId/atlas', map.createGridForCurrentBirdData())
//mapRouter.get('/:speciesId/atlas/:atlasId', map.createGridForBirdData())
//mapRouter.get('/:speciesId/change')
//mapRouter.get('/:speciesId/change/:atlasId')


module.exports = mapRouter
