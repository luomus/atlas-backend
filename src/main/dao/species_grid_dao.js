/**
 * Provides methods for accessing Bird Atlas database.
 */
class SpeciesGridDao {
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
   * @param {number} gridId
   * @returns {Promise}
   */
  getGridByIdAtlas3(gridId) {
    return this.#querier('get', `SELECT * FROM grid_atlas3 WHERE grid_id = ?`, [gridId])
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
            species_mxcode INTEGER REFERENCES species,
            grid_id INTEGER REFERENCES grid,
            breedingIndex INTEGER,
            breedingCategory INTEGER)`
    return this.#querier('run', sql)
  }

  /**
   * Returns the database search result for all Atlas3 data with given species mx-code.
   * @param {number} speciesMxcode
   * @returns {Promise}
   */
  getBySpeciesFromAtlas3(speciesMxcode) {
    return this.#querier('all', `SELECT id AS "id", species_mxcode AS "species_mxcode",
            grid_id AS "grid_id", breedingIndex AS "breedingIndex", breedingCategory AS "breedingCategory" FROM bird_data_atlas3 WHERE species_mxcode = :mxcode`, [speciesMxcode])
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
   * @param {number} speciesMxcode
   * @returns {Promise}
   */
  getGridAndBreedingdataForSpecies(speciesMxcode) {
    return this.#querier('all', `SELECT species.speciesFI AS "speciesFI", grid.id AS "id",
            grid.coordinateN AS "coordinateN", grid.coordinateE AS "coordinateE",
            bird_data_atlas3.breedingCategory AS "breedingCategory"
            FROM bird_data_atlas3 JOIN grid 
            ON grid.id = bird_data_atlas3.grid_id 
            JOIN species 
            ON species.mxCode = bird_data_atlas3.species_mxcode 
            WHERE species.mxcode = :mxcode 
            AND species.visibility=1`, [speciesMxcode])
  }

  getDataByGridId(gridId) {
    return this.#querier('all', `SELECT bird_data_atlas3.id AS "id", bird_data_atlas3.species_mxcode AS "species_mxcode",
            bird_data_atlas3.grid_id AS "grid_id",
            bird_data_atlas3.breedingCategory AS "breedingCategory",
            bird_data_atlas3.breedingIndex AS "breedingIndex"
            FROM bird_data_atlas3 
            JOIN species 
            ON species.mxCode = bird_data_atlas3.species_mxcode 
            WHERE grid_id = :grid 
            AND species.visibility=1`, [gridId])
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
   * @param {number} gridId
   * @returns {Promise}
   */
  getGridByIdAtlas12(gridId) {
    return this.#querier('get', `SELECT * FROM grid_atlas12 WHERE grid_id = ?`, [gridId])
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
            species_mxcode INTEGER REFERENCES species,
            grid_id INTEGER REFERENCES grid,
            breedingIndex_atlas1 INTEGER,
            breedingIndex_atlas2 INTEGER,
            breedingIndex_combined INTEGER)`
    return this.#querier('run', sql)
  }

  /**
   * Returns the database search result for all Atlas1-2 data with given species mx-code.
   * @param {number} speciesMxcode
   * @returns {Promise}
   */
  getBySpeciesFromAtlas12(speciesMxcode) {
    return this.#querier('all', `SELECT * FROM bird_data_atlas12 WHERE species_mxcode = ?`, [speciesMxcode])
  }

  /**
   * Returns the database search result for all Atlas1-2 data.
   * @returns {Promise}
   */
  getAllDataFromBirdAtlas12() {
    return this.#querier('all', `SELECT * FROM bird_data_atlas12`)
  }


  getAllDataBySpecies(speciesMxcode) {
    return this.#querier('all', `SELECT * FROM bird_data_atlas WHERE species_mxcode = ?`, [speciesMxcode])
  }
}

module.exports = SpeciesGridDao;
