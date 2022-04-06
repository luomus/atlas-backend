const getCache = jest.fn()
const setCache = jest.fn()

module.exports = {
  setCache,
  getCache,
  wrapper: async (key, fn, ttl) => {
    let data = getCache(key)

    if(data === undefined) {
      data = await fn()

      setCache(key, data, ttl)
      return data
    }

    return data
  }
}