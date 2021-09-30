class BirdGridDao {
    #querier

    constructor(querier) {
        this.#querier = querier
    }

    createTableGridAtlas3() {
        const sql = `CREATE TABLE IF NOT EXISTS grid_atlas3 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grid_id INTEGER REFERENCES grid,
            level1 FLOAT,
            level2 FLOAT,
            level3 FLOAT,
            level4 FLOAT,
            level5 FLOAT,
            activitySum INTEGER,
            activityCategory INTEGER)`
        return this.#querier('run', sql)
    }

    getGridByIdAtlas3(grid_id) {
        return this.#querier('get', `SELECT * FROM grid_atlas3 WHERE grid_id = ?`, [grid_id])
    }

    getAllGridsAtlas3() {
        return this.#querier('all', `SELECT * FROM grid_atlas3`)
    }


    createTableBirdDataAtlas3() {
        const sql = `CREATE TABLE IF NOT EXISTS bird_data_atlas3 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            species_code INTEGER REFERENCES species,
            grid_id INTEGER REFERENCES grid,
            breedingIndex INTEGER,
            breedingCategory INTEGER)`
        return this.#querier('run', sql)
    }

    getBySpeciesFromAtlas3(species_mxcode) {
        return this.#querier('all', `SELECT * FROM bird_data_atlas3 WHERE species_mxcode = ?`, [species_mxcode])
    }

    getAllDataFromBirdAtlas3() {
        return this.#querier('all', `SELECT * FROM bird_data_atlas3`)
    }

    getGridAndBreedingdataForBird(species_mxcode) {
        return this.#querier('all', `SELECT species.speciesFI, grid.id, grid.coordinateN, grid.coordinateE, bird_data_atlas3.breedingIndex 
            FROM bird_data_atlas3 JOIN grid 
            ON grid.id = bird_data_atlas3.grid_id 
            JOIN species 
            ON species.mxCode = bird_data_atlas3.species_mxcode 
            WHERE species.mxcode=?`, [species_mxcode])
    }
    

    createTableGridAtlas12() {
        const sql = `CREATE TABLE IF NOT EXISTS CREATE TABLE grid_atlas12 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grid_id INTEGER REFERENCES grid,
            realiability_atlas1 INTEGER,
            realiability_atlas2 INTEGER,
            realiability_combined INTEGER)`
        return this.#querier('run', sql)
    }

    getGridByIdAtlas12(grid_id) {
        return this.#querier('get', `SELECT * FROM grid_atlas12 WHERE grid_id = ?`, [grid_id])
    }

    getAllGridsAtlas12() {
        return this.#querier('all', `SELECT * FROM grid_atlas12`)
    }


    createTableBirdDataAtlas12() {
        const sql = `CREATE TABLE IF NOT EXISTS bird_data_atlas12 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            species_code INTEGER REFERENCES species,
            grid_id INTEGER REFERENCES grid,
            breedingIndex_atlas1 INTEGER,
            breedingIndex_atlas2 INTEGER,
            breedingIndex_combined INTEGER)`
        return this.#querier('run', sql)
    }

    getBySpeciesFromAtlas12(species_mxcode) {
        return this.#querier('all', `SELECT * FROM bird_data_atlas12 WHERE species_mxcode = ?`, [species_mxcode])
    }

    getAllDataFromBirdAtlas12() {
        return this.#querier('all', `SELECT * FROM bird_data_atlas12`)
    }

}

module.exports = BirdGridDao;