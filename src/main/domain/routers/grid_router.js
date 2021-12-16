// eslint-disable-next-line new-cap
const gridRouter = require('express').Router()
const Grid = require('../controllers/grid')
const grid = new Grid()

gridRouter.get('/', grid.getCollection() )
gridRouter.get('/:areaId', grid.getGridInfo())
gridRouter.get('/:areaId/atlas')
gridRouter.get('/:areaId/atlas/:atlasId', grid.getGridStats())
gridRouter.get('/:areaId/atlas/:atlasId/data', grid.getGridData())


module.exports = gridRouter
