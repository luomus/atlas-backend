const sqlite3 = require('sqlite3')

class Dao {
    static #db

    static setDatabase(dbFilePath) {
        this.#db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) console.log('Could not connect to database', err)
            else console.log('Connected to database')
        })
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            Dao.#db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running sql ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve({ id: this.lastID })
                }
            })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            Dao.#db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
    
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            Dao.#db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(JSON.stringify(rows))
                }
            })
        })
    }

}

Dao.setDatabase(dbFilePath)
module.exports = Dao


