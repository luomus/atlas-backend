const Querier = require('../../dao/querier')
const GridDao = require('../../dao/gridDao')
const axios = require('axios')
const Cache = require('../../dao/cache')
const ApiDao = require('../../dao/apiDao')
const { updateCachedStatistics } = require('../../helpers/statisticsHelpers')

class StatsUpdater {
  constructor () {
    this.querier = new Querier()
    this.gridDao = new GridDao(this.querier)
    this.cache = new Cache()
    this.apiDao = new ApiDao(axios, this.cache)
  }

  async update() {
    console.log(new Date().toISOString(), ' ', 'Starting stats update')
    try {
      await updateCachedStatistics(this.gridDao, this.apiDao, this.cache)
      console.log(new Date().toISOString(), ' ', 'Finished stats update')
    } catch (err) {
      console.error(new Date().toISOString(), ' ', 'Stats update error ', err)
      throw err
    }
  }
}

module.exports = StatsUpdater