const oracledb = require('oracledb')
const config = require('./dbConfig.js');

let connection

/**
 * Provides a method for querying a SQLite database
 * @param {Database} SQLite database
 * @returns {Promise}
 */
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
      return undefined
    else {
      return result.rows
    }
  }
}


module.exports = Querier
