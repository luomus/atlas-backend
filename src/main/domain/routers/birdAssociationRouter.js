// eslint-disable-next-line new-cap
const birdAssociationRouter = require('express').Router()
const BirdAssociation = require('../controllers/birdAssociation')
const birdAssociation = new BirdAssociation()

birdAssociationRouter.get('/', birdAssociation.getAll())
birdAssociationRouter.get('/:birdAssociationId/stats', birdAssociation.getStatsForId())
birdAssociationRouter.get('/stats', birdAssociation.getStatsAll())
birdAssociationRouter.get('/stats/lappi', birdAssociation.getStatsLappi())
module.exports = birdAssociationRouter