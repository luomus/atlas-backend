const NodeCache = require('node-cache')
const cache = new NodeCache({
  stdTTL: 60 * 30,
  checkPeriod: 120
})

function Cache() {
  return {
    setCache: (key, data) => cache.set(key, data),
    getCache: (key) => cache.get(key)
  }
}

module.exports = Cache