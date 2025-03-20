const spawnSync = require('child_process').spawnSync
const Cache = require('../main/dao/cache')
const AtlasGridDao = require('../main/dao/atlasGridDao')
const Querier = require('../main/dao/querier')
const ApiDao = require('../main/dao/apiDao')
const axios = require('axios')
const fs = require('fs')
const cacheKey = 'interactiveMap'

class InteractiveMapGenerator {
  constructor() {
    this.cache = new Cache()
    this.querier = new Querier()
    this.atlasGridDao = new AtlasGridDao(this.querier)
    this.apiDao = new ApiDao(axios, this.cache)
  }

  async getInteractiveMap() {
    let data = this.cache.getCache(cacheKey)

    if(data !== undefined) {
      return data
    }

    try {
      const activityCategoryEnum = await this.apiDao.getEnumRange('MY.atlasActivityCategoryEnum')
      const gridData = (await this.atlasGridDao.getAllForAtlasId(4)).map(data => ({
        coordinates: data.grid.slice(data.grid.lastIndexOf('.') + 1),
        atlasClassSum: data.atlasClassSum,
        activityCategory: data.activityCategory !== null ? activityCategoryEnum[data.activityCategory]['fi'] : activityCategoryEnum['MY.atlasActivityCategoryEnum0']['fi']
      }))
      const cwd = process.cwd()
      fs.writeFileSync(cwd + '/src/python/data/data.json', JSON.stringify(gridData))

      const python = spawnSync('python3', ['interactiveMapGenerator.py'], { timeout: 600000, encoding: 'utf8', cwd: cwd + '/src/python' })
      data = python.stdout

      if (data !== '') {
        this.cache.setCache(cacheKey, data, 24 * 3600)
        return data
      } else return
    } catch (e) {
      throw e
    }

  }
}

module.exports = InteractiveMapGenerator