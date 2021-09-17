class species_table {

    constructor(dao) {
        this.dao = dao
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
        return this.dao.run(sql)
    }

    createWithName(name) {
        const sql = 'INSERT INTO species (speciesFI) VALUES (?)'
        return this.dao.run(sql, [name])
    }

    create(nameFI, nameEN, nameSCI) {
        const sql = 'INSERT INTO species (speciesFI, speciesEN, speciesSCI) VALUES (?, ?, ?)'
        return this.dao.run(sql, [nameFI, nameEN, nameSCI])
    }

    update(species) {
        const { id, nameFI, nameEN, nameSCI, abbr } = species
        const sql = `UPDATE tasks
            SET speciesFI = ?,
            speciesEN = ?,
            speciesSCI = ?,
            speciesAbbr = ?
            WHERE id = ?`
        return this.dao.run(sql, [nameFI, nameEN, nameSCI, abbr, id])
    }

    delete(id) {
        return this.dao.run(`DELETE FROM species WHERE id = ?`, [id])
    }

    getById(id) {
        return this.dao.get(`SELECT * FROM species WHERE id = ?`, [id])
    }

    getAll() {
        return this.dao.all(`SELECT * FROM species`)
    }


}

  
module.exports = species_table;