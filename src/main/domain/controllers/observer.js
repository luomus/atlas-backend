const axios = require('axios')
const Cache = require('../../dao/cache')
const ApiDao = require('../../dao/apiDao')
const apiDao = new ApiDao(axios, new Cache())

class Observer {
  /**
   * Returns atlas species list.
   * @returns {JSON}
   */
  getObserverStats() {
    return async (req, res) => {
      try {
        const limit = req.query.limit || 100
        const birdAssociationId = req.query.birdAssociationId

        const observerStats = await apiDao.getObserverAggregate(birdAssociationId)

        return res.json(observerStats.slice(0, limit))
      } catch (e) {
        return res.status(500).send(e.message)
      }
    }
  }
}

module.exports = Observer