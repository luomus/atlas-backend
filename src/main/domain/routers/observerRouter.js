// eslint-disable-next-line new-cap
const observerRouter = require('express').Router()
const Observer = require('../controllers/observer')
const observer = new Observer()

observerRouter.get('/stats', observer.getObserverStats())

module.exports = observerRouter