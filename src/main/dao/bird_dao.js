/**
 * 
 */
class BirdDao {
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
    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS species (
            id INTEGER AUTOINCREMENT,
            mxcode INTEGER PRIMARY KEY,
            speciesAbbr VARCHAR(6),
            speciesSCI VARCHAR(100),
            speciesFI VARCHAR(100),
            speciesSV VARCHAR(100),
            speciesEN VARCHAR(100),
            speciesGroup_id REFERENCES speciesGroup,
            visibility INTEGER)`
        return this.#querier('run', sql)
    }

    
    /**
     * 
     * @param {{mxcode: number, abbr: string, nameSCI: string, nameFI: string, nameSV: string, nameEN: string, group_id: number}} species
     * @returns {Promise}
     */
    create(species) {
        const { mxcode, abbr, nameSCI, nameFI, nameSV, nameEN, group_id } = species
        const sql = `INSERT INTO species 
            (mxcode, speciesFI, speciesSV, speciesEN, speciesSCI, speciesAbbr, speciesGroup_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`
        return this.#querier('run', sql, [mxcode, abbr, nameSCI, nameFI, nameSV, nameEN, group_id])
    }


    /**
     * 
     * @param {{mxcode: number, abbr: string, nameSCI: string, nameFI: string, nameSV: string, nameEN: string}} species
     * @returns {Promise}
     */
    update(species) {
        const { mxcode, abbr, nameSCI, nameFI, nameSV, nameEN } = species
        const sql = `UPDATE species
            SET speciesAbbr = ?,
            speciesSCI = ?,
            speciesFI = ?,
            speciesSV = ?,
            speciesEN = ?
            WHERE mxcode = ?`
        return this.#querier('run', sql, [abbr, nameSCI, nameFI, nameSV, nameEN, mxcode])
    }


    /**
     * 
     * @param {number} mxcode 
     * @returns {Promise}
     */
    delete(mxcode) {
        return this.#querier('run', `DELETE FROM species WHERE mxcode = ?`, [mxcode])
    }


    /**
     * 
     * @param {number} mxcode 
     * @returns {Promise}
     */
    getById(mxcode) {
        return this.#querier('get', `SELECT * FROM species WHERE mxcode = ?`, [mxcode])
    }


    /**
     * 
     * @param {number} speciesGroup_id
     * @returns {Promise}
     */
    getAllByGroup(speciesGroup_id) {
        return this.#querier('get', `SELECT * FROM species WHERE speciesGroup_id = ?`, [speciesGroup_id])
    }


    /**
     * 
     * @returns {Promise}
     */
    getAll() {
        return this.#querier('all', `SELECT * FROM species`)
    }

}
  
module.exports = BirdDao;