const spawnSync = require('child_process').spawnSync
const Cache = require('../main/dao/cache')
const cacheKey = 'interActiveMap'

class InteractiveMapGenerator {
  constructor() {
    this.cache = new Cache()
  }

  getInteractiveMap() {
    let data = this.cache.getCache(cacheKey)

    if(data !== undefined) {
      return data
    }

    try {
      const python = spawnSync('python3', ['interactiveMapGenerator.py'], { timeout: 120000, encoding: 'utf8', cwd: '/opt/app/src/python' })
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