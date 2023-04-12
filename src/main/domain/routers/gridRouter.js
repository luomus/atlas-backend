// eslint-disable-next-line new-cap
const gridRouter = require('express').Router()
const Grid = require('../controllers/grid')
const grid = new Grid()

gridRouter.get('/', grid.getAll())
gridRouter.get('/birdAssociation/:birdAssociationId', grid.getAllForBirdAssociation())
gridRouter.get('/birdAssociation/:birdAssociationId/taxon/:taxonId', grid.getAllAtlasDataForBirdAtlasAndTaxon())
gridRouter.get('/:gridId', grid.getGridInfo())
gridRouter.get('/:gridId/atlas', grid.getGridStatsActive())
//gridRouter.get('/:areaId/atlas/:atlasId', grid.getGridStats())
//gridRouter.get('/:areaId/atlas/:atlasId/data', grid.getGridData())


module.exports = gridRouter
