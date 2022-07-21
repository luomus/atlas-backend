const healthRouter = require('express').Router()

healthRouter.get('/', (req, res) => {
  res.status(200).json('ok')
})

module.exports = healthRouter