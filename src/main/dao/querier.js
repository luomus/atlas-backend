const oracledb = require('oracledb')
const config = require('./dbConfig.js');

/**
 * Provides methods for accessing oracle database
 */
class Querier {
  static async initialize() {
    await oracledb.createPool(config)
  }

  async executeMany(query, params = []) {
    return await this.executeQuery('executeMany', query, params)
  }
  async execute(query, params = []) {
    return await this.executeQuery('execute', query, params)
  }
  async executeQuery(method, query, params) {
    let result
    let connection
    
    try {
      connection = await oracledb.getConnection()
      result = await connection[method](query, params, { outFormat: oracledb.OBJECT, autoCommit: true })
    } catch (err) {
      console.error(new Date().toString() + ' ' + err)
      throw new Error(err.message)
    } finally {
      if (connection)
        try {
          await connection.close()
        } catch (e) {
          console.error(new Date().toString() + ' ' + e.message)
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
