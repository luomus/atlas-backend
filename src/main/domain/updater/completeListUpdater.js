const Querier = require('../../dao/querier')
const GridDao = require('../../dao/gridDao')
const axios = require('axios')
const Cache = require('../../dao/cache')
const ApiDao = require('../../dao/apiDao')
const CompleteListDao = require('../../dao/completeListDao')

class CompleteListUpdater {
  constructor () {
    this.querier = new Querier()
    this.gridDao = new GridDao(this.querier)
    this.cache = new Cache()
    this.apiDao = new ApiDao(axios, this.cache)
    this.completeListDao = new CompleteListDao(this.gridDao, this.apiDao, this.cache)
  }

  async update () {
    await this.completeListDao.update()
  }
}

module.exports = CompleteListUpdater