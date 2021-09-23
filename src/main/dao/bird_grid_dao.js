class BirdGridDao {
    #querier

    constructor(querier) {
        this.#querier = querier
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS grid (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coordinateN INTEGER,
            coordinateE INTEGER,
            regionNumber INTEGER,
            municipality varchar(100),
            gridName varchar(50))`
        return this.#querier('run', sql)
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
        return this.#querier('run', sql, [coordinateN, coordinateE, regionNumber, municipality, gridName, id])
    }

    delete(id) {
        return this.#querier('run', `DELETE FROM grid WHERE id = ?`, [id])
    }

    getById(id) {
        return this.#querier('get', `SELECT * FROM grid WHERE id = ?`, [id])
    }

    getByIdAtlas3(id) {
        return this.#querier('get', `SELECT * FROM grid_atlas3 WHERE id = ?`, [id])
    }

    getByIdAtlas12(id) {
        return this.#querier('get', `SELECT * FROM grid_atlas12 WHERE id = ?`, [id])
    }

    getAll() {
        return this.#querier('all', `SELECT * FROM grid`)
    }

    getAllAtlas3() {
        return this.#querier('all', `SELECT * FROM grid_atlas3`)
    }

    getAllAtlas12() {
        return this.#querier('all', `SELECT * FROM grid_atlas12`)
    }

}

module.exports = BirdGridDao;