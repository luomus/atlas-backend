const Taxon = require('../controllers/taxon.js')
const taxon = new Taxon()

const taxonRouter = require('express').Router()

taxonRouter.get('/', taxon.getAll())
taxonRouter.get('/:speciesId', taxon.getSpeciesById())
// taxonRouter.get('/:speciesId/atlas', taxon.getAtlases())
taxonRouter.get('/:speciesId/atlas/:atlasId', taxon.getAtlasForTaxon())
taxonRouter.get('/find/', taxon.findTaxon())


module.exports = taxonRouter
