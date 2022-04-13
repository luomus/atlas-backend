const Taxon = require('../controllers/taxon')
const taxon = new Taxon()

// eslint-disable-next-line new-cap
const taxonRouter = require('express').Router()
taxonRouter.get('/', taxon.getTaxonList())
taxonRouter.get('/:taxonId', taxon.getSpeciesFromList())

module.exports = taxonRouter