// eslint-disable-next-line new-cap
const birdAssociationRouter = require('express').Router()
const BirdAssociation = require('../controllers/birdAssociation')
const birdAssociation = new BirdAssociation()

birdAssociationRouter.get('/', birdAssociation.getAll() )

module.exports = birdAssociationRouter