/**
 * Provides methods for accessing Bird Atlas database.
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
     * Creates table for Atlas3 grids if that does not exist.
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
     * Returns the database search result for all Atlas3 grids with given grid id.
     * @param {number} grid_id
     * @returns {Promise}
     */
    getGridByIdAtlas3(grid_id) {
        return this.#querier('get', `SELECT * FROM grid_atlas3 WHERE grid_id = ?`, [grid_id])
    }


    /**
     * Returns the database search result for all Atlas3 grids.
     * @returns {Promise}
     */
    getAllGridsAtlas3() {
        return this.#querier('all', `SELECT * FROM grid_atlas3`)
    }


    /**
     * Creates table for Atlas3 bird data if that does not exist.
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
     * Returns the database search result for all Atlas3 data with given species mx-code.
     * @param {number} species_mxcode 
     * @returns {Promise}
     */
    getBySpeciesFromAtlas3(species_mxcode) {
        return this.#querier('all', `SELECT * FROM bird_data_atlas3 WHERE species_mxcode = ?`, [species_mxcode])
    }


    /**
     * Returns the database search result for all Atlas3 data.
     * @returns {Promise}
     */
    getAllDataFromBirdAtlas3() {
        return this.#querier('all', `SELECT * FROM bird_data_atlas3`)
    }


    /**
     * Returns the database search result for all Atlas3 data with given species mx-code with visibility of 1
     * combined with Finnish name of the species, grid id, grid coordinates, and breeding category.
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
     * Creates table for Atlas1-2 grids if that does not exist.
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
     * Returns the database search result for all Atlas1-2 grids with given grid id.
     * @param {number} grid_id
     * @returns {Promise}
     */
    getGridByIdAtlas12(grid_id) {
        return this.#querier('get', `SELECT * FROM grid_atlas12 WHERE grid_id = ?`, [grid_id])
    }


    /**
     * Returns the database search result for all Atlas1-2 grids.
     * @returns {Promise}
     */
    getAllGridsAtlas12() {
        return this.#querier('all', `SELECT * FROM grid_atlas12`)
    }


    /**
     * Creates table for Atlas1-2 bird data if that does not exist.
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
     * Returns the database search result for all Atlas1-2 data with given species mx-code.
     * @param {number} species_mxcode 
     * @returns {Promise}
     */
    getBySpeciesFromAtlas12(species_mxcode) {
        return this.#querier('all', `SELECT * FROM bird_data_atlas12 WHERE species_mxcode = ?`, [species_mxcode])
    }


    /**
     * Returns the database search result for all Atlas1-2 data.
     * @returns {Promise}
     */
    getAllDataFromBirdAtlas12() {
        return this.#querier('all', `SELECT * FROM bird_data_atlas12`)
    }

}

module.exports = BirdGridDao;