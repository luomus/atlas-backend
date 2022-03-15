const Cache = require('axios-cache-adapter')

const api = Cache.setup({
  cache: {
    maxAge: 30 * 60 * 1000,
    exclude: { query: false }
  }
})

function CachedAxios() {
  return async (url, params = {}) => {
    const result = await api({
      url: url,
      method: 'get',
      params: params
    })
    return result
  }
}

module.exports = CachedAxios