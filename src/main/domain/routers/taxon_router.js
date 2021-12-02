const express = require('express')
const app = express()
const taxonRouter = require('express').Router()
const Birds = require('../controllers/birds.js')
const birds = new Birds()


taxonRouter.get('/', birds.getAll())
taxonRouter.get('/:taxonId', birds.getAllAtlas3DataBySpecies())
taxonRouter.get('/:taxonId/atlas')
taxonRouter.get('/:taxonId/atlas/:atlasId')
taxonRouter.get('/:taxonId/stats')
taxonRouter.get('/:taxonId/stats/:atlasId')
taxonRouter.get('/findBy')


module.exports = taxonRouter
