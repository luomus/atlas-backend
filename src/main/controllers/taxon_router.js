const express = require('express')
const app = express()
const taxonRouter = require('express').Router()
const Querier = require('../dao/querier')
const BirdDao = require('../dao/bird_dao')
const BirdGridDao = require('../dao/bird_grid_dao')
const Birds = require('../domain/routes/birds.js')
const querier = Querier()
const birdGridDao = new BirdGridDao(querier)
const birdDao = new BirdDao(querier)
const birds = new Birds(birdDao, birdGridDao)


taxonRouter.get('/', birds.getAll())
taxonRouter.get('/:taxonId', birds.getAllAtlas3DataBySpecies())
taxonRouter.get('/:taxonId/atlas')
taxonRouter.get('/:taxonId/atlas/:atlasId')
taxonRouter.get('/:taxonId/stats')
taxonRouter.get('/:taxonId/stats/:atlasId')
taxonRouter.get('/findBy')


module.exports = taxonRouter
