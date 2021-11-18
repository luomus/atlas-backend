const oracledb = require('oracledb')
const fs = require('fs');

const pass = fs.readFileSync("pass.txt")
const pw = pass.toString()

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

    // return async (methodName, query, params = []) => {
    //     try {
    //         connection = await oracledb.getConnection({
    //             user: "atlas_staging",
    //             password: pw,
    //             connectString: "oracle.luomus.fi:1521/oracle.luomus.fi"
    //         });

    //         console.log('connected to oracle database');
    //         // run parametre query
    //         result = await connection.execute(query, params);

    //     } catch (err) {
    //         // error message
    //         return reject(err.message);
    //     } finally {
    //         if (connection) {
    //             try {
    //                 // Always close connections
    //                 await connection.close();
    //                 console.log('close connection oracle success');
    //             } catch (err) {
    //                 console.error(err.message);
    //             }
    //         }
    //         if (result.rows.length == 0) {
    //             //query return null
    //             return resolve('oracle query send no rows');
    //         } else {
    //             //send query results
    //             correctMxFormating(result.rows)
    //             return result.rows;
    //         }

    //     }

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


