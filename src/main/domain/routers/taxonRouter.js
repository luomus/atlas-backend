const Taxon = require('../controllers/taxon')
const taxon = new Taxon()
const AtlasGridUpdater = require('../updater/atlasGridUpdater')
const atlasGridUpdater = new AtlasGridUpdater()

// eslint-disable-next-line new-cap
const taxonRouter = require('express').Router()
taxonRouter.get('/', taxon.getTaxonList())
taxonRouter.get('/:taxonId', taxon.getSpeciesFromList())

module.exports = taxonRouter