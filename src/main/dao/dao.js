function querierFactory(db) {

    return (methodName, query, params = []) => {
        return new Promise((resolve, reject) => {
            db[methodName](query, params, (err, data) => {
                if (err) {
                    console.log('Error running sql: ' + query)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(data || {id: db.lastID})
                }
            })
        })
    }

}

module.exports = querierFactory


