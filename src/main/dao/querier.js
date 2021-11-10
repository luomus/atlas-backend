/**
 * Provides a method for querying a SQLite database
 * @param SQLite database
 * @returns {Promise}
 */
function Querier(db) {

    return (methodName, query, params = []) => {
        return new Promise((resolve, reject) => {
            db[methodName](query, params, function (err, data) {
                correctMxFormating(data)
                if (err) {
                    console.log('Error running sql: ' + query)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(data || this.lastID)
                }
            })
        })

        /**
        * Displays the MXcodes in the JSON file 
        * @param {Object} 
        */
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

}

module.exports = Querier


