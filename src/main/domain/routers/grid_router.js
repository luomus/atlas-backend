const gridRouter = require('express').Router()
const Grid = require('../controllers/grid')
const grid = new Grid()

gridRouter.get('/', grid.getCollection() )
gridRouter.get('/:gridId', grid.getGridInfo())
gridRouter.get('/:gridId/atlas')
gridRouter.get('/:gridId/atlas/:atlasId', grid.getGridStats())
gridRouter.get('/:gridId/atlas/:atlasId/data', grid.getGridData())


module.exports = gridRouter
