const Dao = require(__rootdir + '/dao/dao.js')

class BirdDao extends Dao {

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

    createWithName(name) {
        const sql = 'INSERT INTO species (speciesFI) VALUES (?)'
        return super.run(sql, [name])
    }

    create(nameFI, nameEN, nameSCI) {
        const sql = 'INSERT INTO species (speciesFI, speciesEN, speciesSCI) VALUES (?, ?, ?)'
        return super.run(sql, [nameFI, nameEN, nameSCI])
    }

    update(species) {
        const { id, nameFI, nameEN, nameSCI, abbr } = species
        const sql = `UPDATE species
            SET speciesFI = ?,
            speciesEN = ?,
            speciesSCI = ?,
            speciesAbbr = ?
            WHERE id = ?`
        return super.run(sql, [nameFI, nameEN, nameSCI, abbr, id])
    }

    delete(id) {
        return super.run(`DELETE FROM species WHERE id = ?`, [id])
    }

    getById(id) {
        return super.get(`SELECT * FROM species WHERE id = ?`, [id])
    }

    getAll() {
        return super.all(`SELECT * FROM species`)
    }


}

  
module.exports = new BirdDao();