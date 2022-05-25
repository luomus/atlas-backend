const getCache = jest.fn()
const setCache = jest.fn()
const isQuerying = {}

module.exports = {
  async parallelAsyncUpdate(key, fn, ttl) {
    isQuerying[key] = true

    try {
      const data = await fn()

      this.setCache(key, data, ttl)
    } catch (e) {
      console.error(new Date().toString() + ' ' + e.message)
    } finally {
      isQuerying[key] = false
    }
  },
  setCache,
  getCache,
  async wrapper(key, fn, ttl) {
    let data = this.getCache(key)

    if(data !== undefined) {
      return data
    }

    try {
      data = await fn(10000)
      
      this.setCache(key, data, ttl)
      return data
    } catch(e) {
      if (e.code !== 'ECONNABORTED') {
        console.error(new Date().toString() + ' ' + e.message)
        throw e
      }
    }

    data = this.getCache(`expired_${key}`)

    if(data !== undefined) {
      if (!isQuerying[key]) {
        this.parallelAsyncUpdate(key, fn, ttl)
      }

      return data
    }

    try {
      data = await fn()
    } catch(e) {
      console.error(new Date().toString() + ' ' + e.message)
      throw e
    }

    this.setCache(key, data, ttl)
    return data
  }
}