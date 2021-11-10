/**
 * 
 */
class GridDao {
    #querier

    
    /**
     * @constructor
     * @param {Querier} querier 
     */
    constructor(querier) {
        this.#querier = querier
    }


    /**
     * 
     * @returns {Promise}
     */
    createTableMunicipality() {
        const sql = `CREATE TABLE IF NOT EXISTS municipality (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name varchar(100),
            birdSocietyNameFI varchar(100),
            birdSocietyNameSV varchar(100),
            regionNumber INTEGER)`
        return this.#querier('run', sql)
    }


    /**
     * 
     * @returns {Promise}
     */
    createTableGrid() {
        const sql = `CREATE TABLE IF NOT EXISTS grid (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coordinateN INTEGER,
            coordinateE INTEGER,
            municipality_id INTEGER REFERENCES municipality,
            gridName varchar(100))`
        return this.#querier('run', sql)
    }

    /**
     * 
     * @param {{id: number, name: string, societyNameFI: string, societyNameSV: string, regionNumber: number}} municipality 
     * @returns {Promise}
     */
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


    /**
     * 
     * @param {{id: number, coordinateN: number, coordinateE: number, municipality_id: number, gridName: string}} grid 
     * @returns {Promise}
     */
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


    /**
     * 
     * @param {number} id 
     * @returns {Promise}
     */
    deleteMunicipality(id) {
        return this.#querier('run', `DELETE FROM municipality WHERE id = ?`, [id])
    }


    /**
     * 
     * @param {number} id 
     * @returns {Promise}
     */
    deleteGrid(id) {
        return this.#querier('run', `DELETE FROM grid WHERE id = ?`, [id])
    }


    /**
     * 
     * @param {number} id 
     * @returns {Promise}
     */
    getMunicipalityById(id) {
        return this.#querier('get', `SELECT * FROM municipality WHERE id = ?`, [id])
    }


    /**
     * 
     * @param {number} id 
     * @returns {Promise}
     */
    getGridById(id) {
        return this.#querier('get', `SELECT * FROM grid WHERE id = ?`, [id])
    }


    /**
     * 
     * @returns {Promise}
     */
    getAllMunicipalities() {
        return this.#querier('all', `SELECT * FROM municipality`)
    }


    /**
     * 
     * @returns {Promise}
     */
    getAllGrids() {
        return this.#querier('all', `SELECT * FROM grid`)
    }

}

module.exports = GridDao;