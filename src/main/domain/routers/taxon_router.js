const Taxon = require('../controllers/taxon.js')
const taxon = new Taxon()

const taxonRouter = require('express').Router()

taxonRouter.get('/', taxon.getAll())
taxonRouter.get('/:speciesId', taxon.getSpeciesById())
taxonRouter.get('/:speciesId/atlas')
taxonRouter.get('/:speciesId/atlas/:atlasId', taxon.getAllDataForSpeciesAndAtlas())
taxonRouter.get('/:speciesId/stats')
taxonRouter.get('/:speciesId/stats/:atlasId', taxon.getStatsForTaxon())
taxonRouter.get('/findBy', taxon.findTaxon())


module.exports = taxonRouter
