const express = require('express')
const app = express()
const Birds = require('../controllers/birds')
const Map = require('../controllers/map')
const birds = new Birds()
const map = new Map()

const mapRouter = require('express').Router()
  
mapRouter.get('/', birds.getAll())
mapRouter.get('/:speciesId')
mapRouter.get('/:speciesId/atlas')

mapRouter.get('/:speciesId/atlas/:atlasId', map.createGridForBirdData())

mapRouter.get('/:speciesId/change')
mapRouter.get('/:speciesId/change/:atlasId')


module.exports = mapRouter
