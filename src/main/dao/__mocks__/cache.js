const getCache = jest.fn()
const setCache = jest.fn()
const isQuerying = {}

module.exports = {
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
    } catch(err) {
      if (err.code !== 'ECONNABORTED') {
        console.error(err)
        throw err
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
    } catch(err) {
      console.error(err)
      throw err
    }

    this.setCache(key, data, ttl)
    return data
  }
}