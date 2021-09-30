class BirdDao {
    #querier

    constructor(querier) {
        this.#querier = querier
    }

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

    create(mxcode, abbr, nameSCI, nameFI, nameSV, nameEN, group_id) {
        const sql = `INSERT INTO species 
            (mxcode, speciesFI, speciesSV, speciesEN, speciesSCI, speciesAbbr, speciesGroup_id) 
            VALUES (?, ?, ?, ?, ?)`
        return this.#querier('run', sql, [mxcode, abbr, nameSCI, nameFI, nameSV, nameEN, group_id])
    }

    update(species) {
        const { mxcode, abbr, nameSCI, nameFI, nameSV, nameEN } = species
        const sql = `UPDATE species
            SET speciesAbbr = ?
            speciesSCI = ?,
            speciesFI = ?,
            speciesSV = ?,
            speciesEN = ?
            WHERE mxcode = ?`
        return this.#querier('run', sql, [abbr, nameSCI, nameFI, nameSV, nameEN, mxcode])
    }

    delete(mxcode) {
        return this.#querier('run', `DELETE FROM species WHERE mxcode = ?`, [mxcode])
    }

    getById(mxcode) {
        return this.#querier('get', `SELECT * FROM species WHERE mxcode = ?`, [mxcode])
    }

    getAllByGroup(speciesGroup_id) {
        return this.#querier('get', `SELECT * FROM species WHERE speciesGroup_id = ?`, [speciesGroup_id])
    }

    getAll() {
        return this.#querier('all', `SELECT * FROM species`)
    }

}
  
module.exports = BirdDao;