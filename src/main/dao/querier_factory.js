function querierFactory(db) {

    return (methodName, query, params = []) => {
        return new Promise((resolve, reject) => {
            db[methodName](query, params, function(err, data) {
                if (err) {
                    console.log('Error running sql: ' + query)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(data || this.lastID)
                }
            })
        })
    }

}

module.exports = querierFactory


