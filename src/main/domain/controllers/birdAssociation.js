const axios = require('axios')
const Cache = require('../../dao/cache')
const cache = new Cache()
const ApiDao = require('../../dao/apiDao')
const apiDao = new ApiDao(axios, cache)
const Querier = require('../../dao/querier')
const querier = new Querier()
const GridDao = require('../../dao/gridDao')
const gridDao = new GridDao(querier)
const { getCachedAssociationStatistics } = require('../../helpers/statisticsHelpers') 

class BirdAssociation {
  /**
   * Returns all area points of the grid.
   * @returns {JSON}
   */
  getAll() {
    return async (req, res) => {
      try {
      const birdAssociationAreas = await apiDao.getBirdAssociationAreas()

      return res.json(birdAssociationAreas)
      } catch (e) {
        console.error(new Date().toString() + ' ' + e.message)
        return res.status(500).send(e.message)
      }
    }
  }

  getStatsAll() {
    return async (req, res) => {
      const language = req.query.language || 'fi'
      try {
        const stats =  await getCachedAssociationStatistics(language, gridDao, apiDao, cache)
        
        return res.json(stats)
      } catch (e) {
        console.error(new Date().toString() + ' ' + e.message)

        if (e.code === 404) {
          return res.status(404).send(e.message)
        }
        return res.status(500).send(e.message)
      }
    }
  }
}
  module.exports = BirdAssociation
