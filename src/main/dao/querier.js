/**
 * Provides a method for querying a SQLite database
 * @param {Database} SQLite database
 * @returns {Promise}
 */
// eslint-disable-next-line max-lines-per-function
function Querier(db) {
  return (methodName, query, params = []) => {
    return new Promise((resolve, reject) => {
      db[methodName](query, params, function(err, data) {
        correctMxFormatting(data)
        if (err) {
          console.log('Error running sql: ' + query)
          console.log(err)
          reject(err)
        } else
          resolve(data || this.lastID)
      })
    })

    /**
     * Changes the displays of the MXcodes in the JSON file
     * @param {Object}
     */
    function correctMxFormatting(data) {
      // eslint-disable-next-line guard-for-in
      for (const val in data) {
        if (data[val].hasOwnProperty('species_mxcode')) {
          data[val].species_id = 'MX.' + data[val].species_mxcode
          delete data[val].species_mxcode
        }
        if (data[val].hasOwnProperty('mxCode')) {
          data[val].species_id = 'MX.' + data[val].mxCode
          delete data[val].mxCode
        }
      }
    }
  }
}

module.exports = Querier


