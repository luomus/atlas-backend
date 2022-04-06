const NodeCache = require('node-cache')
const cache = new NodeCache({
  stdTTL: 60 * 30,
  checkPeriod: 120
})

class Cache {
  setCache(key, data, ttl) {cache.set(key, data, ttl)}
  getCache(key) {cache.get(key)}
  async wrapper(key, fn, ttl) {
    let data = this.getCache(key)

    if(data === undefined) {
      data = await fn()

      this.setCache(key, data, ttl)
      return data
    }

    return data
  }
}

module.exports = Cache