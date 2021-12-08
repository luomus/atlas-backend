const express = require('express')
const app = express()
const gridRouter = require('express').Router()
const Grid = require('../controllers/grid')
const grid = new Grid()

gridRouter.get('/', )
gridRouter.get('/:gridId', grid.getGridInfo())
gridRouter.get('/:gridId/atlas')
gridRouter.get('/:gridId/atlas/:atlasId', grid.getGridData())
gridRouter.get('/:gridId/stats', grid.getGridStats())
gridRouter.get('/:gridId/stats/:atlasId', grid.getGridStats())

module.exports = gridRouter
