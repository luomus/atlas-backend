const Dao = require(__rootdir + '/dao/dao.js')

class BirdDao extends Dao {
    #db

    constructor(database) {
        super();
        this.#db = database
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
        return super.run(sql)
    }

    create(nameFI, nameEN, nameSCI) {
        const sql = 'INSERT INTO species (speciesFI, speciesEN, speciesSCI) VALUES (?, ?, ?)'
        return super.makeQuery(this.#db, 'run', sql, [nameFI, nameEN, nameSCI])
    }

    update(species) {
        const { id, nameFI, nameEN, nameSCI, abbr } = species
        const sql = `UPDATE species
            SET speciesFI = ?,
            speciesEN = ?,
            speciesSCI = ?,
            speciesAbbr = ?
            WHERE id = ?`
        return super.makeQuery(this.#db, 'run', sql, [nameFI, nameEN, nameSCI, abbr, id])
    }

    delete(id) {
        return super.makeQuery(this.#db, 'run', `DELETE FROM species WHERE id = ?`, [id])
    }

    getById(id) {
        return super.makeQuery(this.#db, 'get', `SELECT * FROM species WHERE id = ?`, [id])
    }

    getAll() {
        return super.makeQuery(this.#db, 'all', `SELECT * FROM species`)
    }

}
  
module.exports = BirdDao;