class BirdDao {
    #querier

    constructor(querier) {
        this.#querier = querier
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS species (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            speciesFI VARCHAR(100),
            speciesEN VARCHAR(100),
            speciesSCI VARCHAR(100),
            speciesAbbr VARCHAR(6),
            speciesGroup_id REFERENCES speciesGroup,
            visibility INTEGER)`
        return this.#querier('run', sql)
    }

    create(nameFI, nameEN, nameSCI) {
        const sql = 'INSERT INTO species (speciesFI, speciesEN, speciesSCI) VALUES (?, ?, ?)'
        return this.#querier('run', sql, [nameFI, nameEN, nameSCI])
    }

    update(species) {
        const { id, nameFI, nameEN, nameSCI, abbr } = species
        const sql = `UPDATE species
            SET speciesFI = ?,
            speciesEN = ?,
            speciesSCI = ?,
            speciesAbbr = ?
            WHERE id = ?`
        return this.#querier('run', sql, [nameFI, nameEN, nameSCI, abbr, id])
    }

    delete(id) {
        return this.#querier('run', `DELETE FROM species WHERE id = ?`, [id])
    }

    getById(id) {
        return this.#querier('get', `SELECT * FROM species WHERE id = ?`, [id])
    }

    getAll() {
        return this.#querier('all', `SELECT * FROM species`)
    }

}
  
module.exports = BirdDao;