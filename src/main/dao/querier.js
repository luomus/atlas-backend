const oracledb = require('oracledb')
const config = require('./dbConfig.js');

// const fs = require('fs');
// const pass = fs.readFileSync("pass.txt")
// const pw = pass.toString()

/**
 * Provides a method for querying a SQLite database
 * @param {Database} SQLite database
 * @returns {Promise}
 */
// eslint-disable-next-line max-lines-per-function
function Querier() {

    //   return (methodName, query, params = []) => {
    //     return new Promise((resolve, reject) => {
    //       db[methodName](query, params, function(err, data) {
    //         // console.log(data)
    //         // correctMxFormatting(data)
    //         if (err) {
    //           console.log('Error running sql: ' + query)
    //           console.log(err)
    //           reject(err)
    //         } else
    //           resolve(data || this.lastID)
    //       })
    //     })

    
    return async (methodName, query, params = []) => {
        try {
            connection = await oracledb.getConnection(config);
            console.log('Connected to Oracle database');

            // run query
            result = await connection.execute(query, params, { outFormat: oracledb.OBJECT });
            console.log('SQL query executed')

        } catch (err) {
            return reject(err.message);

        } finally {
            if (connection) {
                try {
                    await connection.close();
                    console.log('Oracle connection closed');
                } catch (err) {
                    console.error(err.message);
                }
            }
        }

        if (result.rows.length == 0) {
            //query return null
            return resolve('Query returned no rows');
        } else {
            //send query results
            correctMxFormating(result.rows)
            return result.rows;
        }

    }

    function correctMxFormating(data) {
        for (const val in data) {
            if (data[val].hasOwnProperty('species_mxcode')) {
                data[val].species_id = "MX." + data[val].species_mxcode
                delete data[val].species_mxcode
            }
            if (data[val].hasOwnProperty('mxCode')) {
                data[val].species_id = "MX." + data[val].mxCode
                delete data[val].mxCode
            }
        }
    }
}



module.exports = Querier