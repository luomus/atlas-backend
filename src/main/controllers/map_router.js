const mapRouter = require('express').Router()
const Birds = require('./domain/routes/birds')
const Grid = require('./domain/routes/grid')
const MapService = require('./domain/maps/map_service')
const grid = new Grid(gridDao, mapService, birdGridDao, birdDao)


app.get('/', birds.getAll())
app.get('/:speciesId')
app.get('/:speciesId/atlas')
app.get('/:speciesId/atlas/:atlasId')
app.get('/:speciesId/change')
app.get('/:speciesId/change/:atlasId')



module.exports = mapRouter
