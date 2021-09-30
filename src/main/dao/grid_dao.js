class GridDao {
    #querier

    constructor(querier) {
        this.#querier = querier
    }

    createTableMunicipality() {
        const sql = `CREATE TABLE IF NOT EXISTS municipality (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name varchar(100),
            birdSocietyNameFI varchar(100),
            birdSocietyNameSV varchar(100),
            regionNumber INTEGER)`
        return this.#querier('run', sql)
    }

    createTableGrid() {
        const sql = `CREATE TABLE IF NOT EXISTS grid (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coordinateN INTEGER,
            coordinateE INTEGER,
            municipality_id INTEGER REFERENCES municipality,
            gridName varchar(100))`
        return this.#querier('run', sql)
    }

    updateMunicipality(municipality) {
        const { id, name, societyNameFI, societyNameSV, regionNumber } = municipality
        const sql = `UPDATE municipality
            SET name = ?,
            societyNameFI = ?,
            societyNameSV = ?,
            regionNumber = ?
            WHERE id = ?`
        return this.#querier('run', sql, [name, societyNameFI, societyNameSV, regionNumber, id])
    }

    updateGrid(grid) {
        const { id, coordinateN, coordinateE, municipality_id, gridName } = grid
        const sql = `UPDATE grid
            SET coordinateN = ?,
            coordinateE = ?,
            municipality_id = ?,
            gridName = ?
            WHERE id = ?`
        return this.#querier('run', sql, [coordinateN, coordinateE, municipality_id, gridName, id])
    }

    deleteMunicipality(id) {
        return this.#querier('run', `DELETE FROM municipality WHERE id = ?`, [id])
    }

    deleteGrid(id) {
        return this.#querier('run', `DELETE FROM grid WHERE id = ?`, [id])
    }

    getMunicipalityById(id) {
        return this.#querier('get', `SELECT * FROM municipality WHERE id = ?`, [id])
    }

    getGridById(id) {
        return this.#querier('get', `SELECT * FROM grid WHERE id = ?`, [id])
    }

    getAllMunicipalities() {
        return this.#querier('all', `SELECT * FROM municipality`)
    }

    getAllGrids() {
        return this.#querier('all', `SELECT * FROM grid`)
    }

}

module.exports = GridDao;