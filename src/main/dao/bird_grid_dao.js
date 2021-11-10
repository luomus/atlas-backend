/**
 * 
 */
class BirdGridDao {
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


    /**
     * 
     * @param {number} grid_id
     * @returns {Promise}
     */
    getGridByIdAtlas3(grid_id) {
        return this.#querier('get', `SELECT * FROM grid_atlas3 WHERE grid_id = ?`, [grid_id])
    }


    /**
     * 
     * @returns {Promise}
     */
    getAllGridsAtlas3() {
        return this.#querier('all', `SELECT * FROM grid_atlas3`)
    }


    /**
     * 
     * @returns {Promise}
     */
    createTableBirdDataAtlas3() {
        const sql = `CREATE TABLE IF NOT EXISTS bird_data_atlas3 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            species_code INTEGER REFERENCES species,
            grid_id INTEGER REFERENCES grid,
            breedingIndex INTEGER,
            breedingCategory INTEGER)`
        return this.#querier('run', sql)
    }


    /**
     * 
     * @param {number} species_mxcode 
     * @returns {Promise}
     */
    getBySpeciesFromAtlas3(species_mxcode) {
        return this.#querier('all', `SELECT * FROM bird_data_atlas3 WHERE species_mxcode = ?`, [species_mxcode])
    }


    /**
     * 
     * @returns {Promise}
     */
    getAllDataFromBirdAtlas3() {
        return this.#querier('all', `SELECT * FROM bird_data_atlas3`)
    }


    /**
     * 
     * @param {number} species_mxcode 
     * @returns {Promise}
     */
    getGridAndBreedingdataForBird(species_mxcode) {
        return this.#querier('all', `SELECT species.speciesFI, grid.id, grid.coordinateN, grid.coordinateE, bird_data_atlas3.breedingCategory 
            FROM bird_data_atlas3 JOIN grid 
            ON grid.id = bird_data_atlas3.grid_id 
            JOIN species 
            ON species.mxCode = bird_data_atlas3.species_mxcode 
            WHERE species.mxcode=? 
            AND species.visibility=1`, [species_mxcode])
    }
    

    /**
     * 
     * @returns {Promise}
     */
    createTableGridAtlas12() {
        const sql = `CREATE TABLE IF NOT EXISTS CREATE TABLE grid_atlas12 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grid_id INTEGER REFERENCES grid,
            realiability_atlas1 INTEGER,
            realiability_atlas2 INTEGER,
            realiability_combined INTEGER)`
        return this.#querier('run', sql)
    }


    /**
     * 
     * @param {number} grid_id
     * @returns {Promise}
     */
    getGridByIdAtlas12(grid_id) {
        return this.#querier('get', `SELECT * FROM grid_atlas12 WHERE grid_id = ?`, [grid_id])
    }


    /**
     * 
     * @returns {Promise}
     */
    getAllGridsAtlas12() {
        return this.#querier('all', `SELECT * FROM grid_atlas12`)
    }


    /**
     * 
     * @returns {Promise}
     */
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


    /**
     * 
     * @param {number} species_mxcode 
     * @returns {Promise}
     */
    getBySpeciesFromAtlas12(species_mxcode) {
        return this.#querier('all', `SELECT * FROM bird_data_atlas12 WHERE species_mxcode = ?`, [species_mxcode])
    }


    /**
     * 
     * @returns {Promise}
     */
    getAllDataFromBirdAtlas12() {
        return this.#querier('all', `SELECT * FROM bird_data_atlas12`)
    }

}

module.exports = BirdGridDao;