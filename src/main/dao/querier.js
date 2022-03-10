const oracledb = require('oracledb')
const config = require('./dbConfig.js');

let connection

/**
 * Provides a method for querying a SQLite database
 * @param {Database} SQLite database
 * @returns {Promise}
 */
// eslint-disable-next-line max-lines-per-function
function Querier() {
  //return (methodName, query, params = []) => {
    // return new Promise((resolve, reject) => {
    //   db[methodName](query, params, function(err, data) {
    //     // console.log(data)
    //     // correctMxFormatting(data)
    //     if (err) {
    //       console.log('Error running sql: ' + query)
    //       console.log(err)
    //       reject(err)
    //     } else
    //       resolve(data || this.lastID)
    //   })
    // })

  // eslint-disable-next-line max-lines-per-function
  return async (methodName, query, params = []) => {
    try {
      connection = await oracledb.getConnection(config)
      result = await connection.execute(query, params, { outFormat: oracledb.OBJECT, autoCommit: true })
    } catch (err) {
      console.log(err)
      throw new Error(err.message)
    } finally {
      if (connection)
        try {
          await connection.close()
        } catch (err) {
          console.error(err.message)
        }
    }

    if (result.rows?.length === 0)
      return 'Empty result'
    else {
      return result.rows
    }
  }

  function correctMxFormating(data) {
    // eslint-disable-next-line guard-for-in
    for (const val in data) {
      if (data[val].hasOwnProperty('species_mxcode')) {
        data[val].species = 'MX.' + data[val].species_mxcode
        delete data[val].species_mxcode
      }
      if (data[val].hasOwnProperty('mxCode')) {
        data[val].species = 'MX.' + data[val].mxCode
        delete data[val].mxCode
      }
    }
  }
}


module.exports = Querier
