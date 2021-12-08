const Taxon = require('../controllers/taxon.js')
const taxon = new Taxon()

const taxonRouter = require('express').Router()

taxonRouter.get('/', taxon.getAll())
taxonRouter.get('/:taxonId', taxon.getAllDataBySpecies())
taxonRouter.get('/:taxonId/atlas')
taxonRouter.get('/:taxonId/atlas/:atlasId', taxon.getAllDataBySpeciesAndAtlas())
taxonRouter.get('/:taxonId/stats', taxon.countByGroup())
taxonRouter.get('/:taxonId/stats/:atlasId')
taxonRouter.get('/findBy')


module.exports = taxonRouter
