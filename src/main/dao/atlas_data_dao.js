/**
 * Provides methods for accessing Bird Atlas database.
 */
class AtlasDataDao {
  #querier

  /**
   * @constructor
   * @param {Querier} querier
   */
  constructor(querier) {
    this.#querier = querier
  }


  /**
   * Creates table for bird data if that does not exist.
   * @returns {Promise}
   */
  createTableBirdData() {
    const sql = `CREATE TABLE IF NOT EXISTS bird_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            species_mxcode INTEGER REFERENCES species,
            grid_id INTEGER REFERENCES grid,
            atlas_id INTEGER REFERENCES atlas,
            breedingIndex INTEGER,
            breedingCategory INTEGER)`
    return this.#querier('run', sql)
  }

  /**
   * Returns the database search result for all bird atlas data.
   * @returns {Promise}
   */
  getAllAtlasData() {
    return this.#querier('all', `SELECT * FROM bird_data`)
  }

  /**
   * Returns the database search result for all Atlas3 data with given species mx-code with visibility of 1
   * combined with Finnish name of the species, grid id, grid coordinates, and breeding category.
   * @param {number} mxcode
   * @returns {Promise}
   */
  getGridAndBreedingdataForSpecies(mxcode) {
    return this.#querier('all', `SELECT species.speciesFI AS "speciesFI", grid.id AS "id",
            grid.coordinateN AS "coordinateN", grid.coordinateE AS "coordinateE",
            bird_data.breedingCategory AS "breedingCategory"
            FROM bird_data JOIN grid 
            ON grid.id = bird_data.grid_id 
            JOIN species 
            ON species.mxCode = bird_data.species_mxcode 
            WHERE species.mxcode = :mxcode 
            AND species.visibility=1`, [mxcode])
  }

  getDataForGrid(gridId) {
    return this.#querier('all', `SELECT bird_data.id AS "id", bird_data_atlas3.species_mxcode AS "species_mxcode",
            bird_data.grid_id AS "grid_id",
            bird_data.breedingCategory AS "breedingCategory",
            bird_data.breedingIndex AS "breedingIndex"
            FROM bird_data 
            JOIN species 
            ON species.mxCode = bird_data.species_mxcode 
            WHERE grid_id = :gridId
            AND species.visibility=1`, [gridId])
  }


  getDataForGridAndAtlas(gridId, atlasId) {
    return this.#querier('all', `SELECT bird_data.id AS "id", bird_data.species_mxcode AS "species_mxcode",
            bird_data.grid_id AS "grid_id",
            bird_data.breedingCategory AS "breedingCategory",
            bird_data.breedingIndex AS "breedingIndex"
            FROM bird_data 
            JOIN species 
            ON species.mxCode = bird_data.species_mxcode 
            WHERE grid_id = :gridId
            AND atlas_id = :atlasId
            AND species.visibility=1`, [gridId, atlasId])
  }

  getNumOfBreedingCategoriesForGrid(gridId) {
    return this.#querier('all', `SELECT breedingCategory AS "breedingCategory", count(*) AS "num" FROM bird_data
            WHERE grid_id = :gridId GROUP BY breedingCategory`, [gridId])
  }


  getNumOfBreedingCategoriesForGridAndAtlas(gridId, atlasId) {
    return this.#querier('all', `SELECT breedingCategory AS "breedingCategory", count(*) AS "num" FROM bird_data
            WHERE grid_id = :gridId AND atlas_id = :atlasId GROUP BY breedingCategory`, [gridId, atlasId])
  }

  getListOfDistinctBirdsForGrid(gridId) {
    return this.#querier('all', `SELECT distinct bird_data.species_mxcode, species.speciesFi 
            FROM bird_data, species WHERE species.mxCode=bird_data.species_mxcode AND grid_id= :gridId AND visibility=1`, [gridId])
  }


  getListOfDistinctBirdsForGridAndAtlas(gridId) {
    return this.#querier('all', `SELECT distinct bird_data.species_mxcode, species.speciesFi 
            FROM bird_data, species WHERE species.mxCode=bird_data.species_mxcode AND grid_id= :gridId AND atlas_id = :atlasId AND visibility=1`, [gridId])
  }

  getAllDataForSpecies(speciesMxcode) {
    return this.#querier('all', `SELECT * FROM bird_data_atlas WHERE species_mxcode = ?`, [speciesMxcode])
  }

  
  /**
   * Returns the database search result for all data with given species mx-code.
   * @param {number} mxcode
   * @returns {Promise}
   */
   getDataForSpecies(mxcode) {
    return this.#querier('all', `SELECT id AS "id", species_mxcode AS "species_mxcode",
            grid_id AS "grid_id", breedingIndex AS "breedingIndex", breedingCategory AS "breedingCategory" FROM bird_data WHERE species_mxcode = :mxcode`, [speciesMxcode])
  }


  /**
   * Returns the database search result for all data with given species mx-code.
   * @param {number} mxcode
   * * @param {number} atlasId
   * @returns {Promise}
   */
   getDataForSpeciesAndAtlas(mxcode, atlasId) {
    return this.#querier('all', `SELECT id AS "id", species_mxcode AS "species_mxcode",
            grid_id AS "grid_id", breedingIndex AS "breedingIndex", breedingCategory AS "breedingCategory" FROM bird_data WHERE species_mxcode = :mxcode AND atlas_id = :atlasId`, [speciesMxcode])
  }

}


module.exports = AtlasDataDao;
