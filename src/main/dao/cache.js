const NodeCache = require('node-cache')
const cache = new NodeCache({
  stdTTL: 60 * 15,
  checkPeriod: 120
})
let isQuerying = {}

cache.on('expired', (key, data) => {
  cache.set(`${key}_expired`, data, 0)
})

class Cache {
  async parallelAsyncUpdate(key, fn, ttl) {
    isQuerying[key] = true

    try {
      const data = await fn()

      this.setCache(key, data, ttl)
    } catch (err) {
      console.error(err)
    } finally {
      isQuerying[key] = false
    }
  }
  setCache(key, data, ttl) { return cache.set(key, data, ttl)}
  getCache(key) {return cache.get(key)}
  async wrapper(key, fn, ttl) {
    let data = this.getCache(key)

    if(data !== undefined) {
      return data
    }

    data = this.getCache(`${key}_expired`)

    if(data !== undefined) {
      if (!isQuerying[key]) {
        this.parallelAsyncUpdate(key, fn, ttl)
      }

      return data
    }

    try {
      data = await fn()
    } catch(err) {
      console.error(err)
      throw err
    }

    this.setCache(key, data, ttl)
    return data
  }
}

module.exports = Cache