const Taxon = require('../controllers/taxon.js')
const taxon = new Taxon()

// eslint-disable-next-line new-cap
const taxonRouter = require('express').Router()

//taxonRouter.get('/:speciesId/atlas/current', taxon.getCurrentAtlasForTaxon())
taxonRouter.get('/:speciesId/atlas/:atlasId', taxon.getAtlasForTaxon())

module.exports = taxonRouter
