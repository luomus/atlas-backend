const taxonRouter = require('express').Router()
const Birds = require('./domain/routes/birds')
const birds = new Birds(birdDao, birdGridDao)


app.get('/', birds.getAll())
app.get('/:taxonId', birds.getAllAtlas3DataBySpecies())
app.get('/:taxonId/atlas')
app.get('/:taxonId/atlas/:atlasId')
app.get('/:taxonId/stats')
app.get('/:taxonId/stats/:atlasId')
app.get('/findBy')


module.exports = taxonRouter
