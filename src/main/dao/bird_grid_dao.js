const Dao = require(__rootdir + '/dao/dao.js')

class BirdGridDao extends Dao {
    #db

    constructor(database) {
        super();
        this.#db = database
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS grid (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coordinateN INTEGER,
            coordinateE INTEGER,
            regionNumber INTEGER,
            municipality varchar(100),
            gridName varchar(50))`
        return super.makeQuery(this.#db, 'run', sql)
    }

    update(grid) {
        const { id, coordinateN, coordinateE, regionNumber, municipality, gridName } = grid
        const sql = `UPDATE grid
            SET coordinateN = ?,
            coordinateE = ?,
            regionNumber = ?,
            municipality = ?,
            gridName = ?
            WHERE id = ?`
        return super.makeQuery(this.#db, 'run', sql, [coordinateN, coordinateE, regionNumber, municipality, gridName, id])
    }

    delete(id) {
        return super.makeQuery(this.#db, 'run', `DELETE FROM grid WHERE id = ?`, [id])
    }

    getById(id) {
        return super.makeQuery(this.#db, 'get', `SELECT * FROM grid WHERE id = ?`, [id])
    }

    getByIdAtlas3(id) {
        return super.makeQuery(this.#db, 'get', `SELECT * FROM grid_atlas3 WHERE id = ?`, [id])
    }

    getByIdAtlas12(id) {
        return super.makeQuery(this.#db, 'get', `SELECT * FROM grid_atlas12 WHERE id = ?`, [id])
    }

    getAll() {
        return super.makeQuery(this.#db, 'all', `SELECT * FROM grid`)
    }

    getAllAtlas3() {
        return super.makeQuery(this.#db, 'all', `SELECT * FROM grid_atlas3`)
    }

    getAllAtlas12() {
        return super.makeQuery(this.#db, 'all', `SELECT * FROM grid_atlas12`)
    }

}
  
module.exports = BirdGridDao;