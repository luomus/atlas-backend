const NodeCache = require('node-cache')
const cache = new NodeCache({
  stdTTL: 60 * 10,
  checkPeriod: 120
})
let isQuerying = {}

cache.on('expired', (key, data) => {
  cache.set(`expired_${key}`, data, 0)
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
  flushAll() {return cache.flushAll()}
  setCache(key, data, ttl) {return cache.set(key, data, ttl)}
  getCache(key) {return cache.get(key)}
  async wrapper(key, fn, ttl) {
    let data = this.getCache(key)

    if(data !== undefined) {
      return data
    }

    const expired_data = this.getCache(`expired_${key}`)

    if (expired_data === undefined) {
      try {
        data = await fn()
      } catch(err) {
        console.error(err)
        throw err
      }
  
      this.setCache(key, data, ttl)
      return data  
    }

    if (isQuerying[key]) {
      return expired_data
    }

    try {
      data = await fn(10000)
      
      this.setCache(key, data, ttl)
      return data
    } catch(err) {
      console.error(err)
    }

    if (!isQuerying[key]) {
      this.parallelAsyncUpdate(key, fn, ttl)
    }

    return expired_data
  }
}

module.exports = Cache