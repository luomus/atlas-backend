const gridRouter = require('express').Router()
const Grid = require('./domain/routes/grid')


app.get('/', grid.getAll())
app.get('/:gridId')
app.get('/:gridId/atlas')
app.get('/:gridId/atlas/:atlasId')
app.get('/:gridId/stats')
app.get('/:gridId/stats/:atlasId')


module.exports = gridRouter
