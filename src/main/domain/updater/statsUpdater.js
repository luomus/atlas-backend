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
    await updateCachedStatistics(this.gridDao, this.apiDao, this.cache)
  }
}

module.exports = StatsUpdater