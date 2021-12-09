/**
 * Provides methods for accessing Atlas Data database.
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
  getAllData() {
    return this.#querier('all', `SELECT * bird_data`)
  }


  /**
   * Returns the database search result for all bird data in given at.
   * @param {number} atlasId 
   * @returns {Promise}
   */
   getAllDataForAtlas(atlasId) {
    return this.#querier('all', `SELECT * bird_data WHERE atlas_id = ?`, [atlasId])
  }

  
  /**
   * Returns the database search result for all data with given species mx-code.
   * @param {number} mxcode
   * @returns {Promise}
   */
   getDataForSpecies(mxcode) {
    return this.#querier('all', `SELECT id AS "id", species_mxcode AS "species_mxcode",
            grid_id AS "grid_id", breedingIndex AS "breedingIndex", breedingCategory AS "breedingCategory" FROM bird_data WHERE species_mxcode = :mxcode`, [mxcode])
  }


  /**
   * Returns the database search result for all data with given species mx-code and atlas id.
   * @param {number} mxcode
   * @param {number} atlasId
   * @returns {Promise}
   */
   getDataForSpeciesAndAtlas(mxcode, atlasId) {
    return this.#querier('all', `SELECT id AS "id", species_mxcode AS "species_mxcode",
            grid_id AS "grid_id", breedingIndex AS "breedingIndex", breedingCategory AS "breedingCategory" FROM bird_data WHERE species_mxcode = :mxcode AND atlas_id = :atlasId`, [mxcode, atlasId])
  }


  /**
   * Returns the database search result for all data with given species mx-code with visibility of 1
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


  /**
   * Returns the database search result for all data with given atlas and species with visibility of 1
   * combined with Finnish name of the species, grid id, grid coordinates, and breeding category.
   * @param {number} mxcode
   * @param {number} atlasId
   * @returns {Promise}
   */
   getGridAndBreedingdataForSpeciesAndAtlas(mxcode, atlasId) {
    console.log('atlas_data_dao', mxcode)
    return this.#querier('all', `SELECT species.speciesFI AS "speciesFI", grid.id AS "id",
            grid.coordinateN AS "coordinateN", grid.coordinateE AS "coordinateE",
            bird_data.breedingCategory AS "breedingCategory"
            FROM bird_data JOIN grid 
            ON grid.id = bird_data.grid_id 
            JOIN species 
            ON species.mxCode = bird_data.species_mxcode 
            WHERE species.mxcode = :mxcode
            AND bird_data.atlas_id = :atlasId
            AND species.visibility=1`, [mxcode, atlasId])
  }


  /**
   * Returns the database search result for all data for given grid.
   * @param {number} gridId
   * @returns {Promise}
   */
  getDataForGrid(gridId) {
    return this.#querier('all', `SELECT bird_data.id AS "id", bird_data_atlas3.species_mxcode AS "species_mxcode",
            bird_data.grid_id AS "grid_id",
            bird_data.breedingCategory AS "breedingCategory",
            bird_data.breedingIndex AS "breedingIndex"
            FROM bird_data 
            JOIN species 
            ON species.mxCode = bird_data.species_mxcode 
            WHERE bird_data.grid_id = :gridId
            AND species.visibility=1`, [gridId])
  }


  /**
   * Returns the database search result for all data for given grid and atlas.
   * @param {number} gridId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getDataForGridAndAtlas(gridId, atlasId) {
    return this.#querier('all', `SELECT bird_data.id AS "id", bird_data.species_mxcode AS "species_mxcode",
            bird_data.grid_id AS "grid_id",
            bird_data.breedingCategory AS "breedingCategory",
            bird_data.breedingIndex AS "breedingIndex"
            FROM bird_data 
            JOIN species 
            ON species.mxCode = bird_data.species_mxcode 
            WHERE bird_data.grid_id = :gridId
            AND bird_data.atlas_id = :atlasId
            AND species.visibility=1`, [gridId, atlasId])
  }


  /**
   * Returns the database search result for number of breeding categories for given grid.
   * @param {number} gridId
   * @returns {Promise}
   */
  getNumOfBreedingCategoriesForGrid(gridId) {
    return this.#querier('all', `SELECT breedingCategory AS "breedingCategory", count(*) AS "num" FROM bird_data
            WHERE grid_id = :gridId GROUP BY breedingCategory`, [gridId])
  }


  /**
   * Returns the database search result for number of breeding categories for given grid and atlas.
   * @param {number} gridId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getNumOfBreedingCategoriesForGridAndAtlas(gridId, atlasId) {
    return this.#querier('all', `SELECT breedingCategory AS "breedingCategory", count(*) AS "num" FROM bird_data
            WHERE grid_id = :gridId AND atlas_id = :atlasId GROUP BY breedingCategory`, [gridId, atlasId])
  }


  /**
   * Returns the database search result for list of species for given grid.
   * @param {number} gridId
   * @returns {Promise}
   */
  getListOfDistinctBirdsForGrid(gridId) {
    return this.#querier('all', `SELECT distinct bird_data.species_mxcode, species.speciesFi 
            FROM bird_data, species WHERE species.mxCode=bird_data.species_mxcode AND bird_data.grid_id= :gridId AND visibility=1`, [gridId])
  }


  /**
   * Returns the database search result for list of species for given grid and atlas.
   * @param {number} gridId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getListOfDistinctBirdsForGridAndAtlas(gridId, atlasId) {
    return this.#querier('all', `SELECT distinct bird_data.species_mxcode AS "species_mxcode", bird_data.breedingCategory AS "breedingCategory", species.speciesFi AS "speciesFi" 
            FROM bird_data, species WHERE species.mxCode=bird_data.species_mxcode AND bird_data.grid_id = :gridId AND bird_data.atlas_id = :atlasId AND visibility=1`, [gridId, atlasId])
  }

    /**
   * Returns the database search result for list of species for given grid and atlas.
   * @param {number} speciesId
   * @param {number} atlasId
   * @returns {Promise}
   */
     getBreedingCategorySumForSpecies(speciesId, atlasId) {
      return this.#querier('all', `SELECT breedingCategory AS "breedingCategory", count(*) "categorySum" 
      FROM bird_data WHERE species_mxcode= :speciesId AND atlas_id= :atlasId GROUP BY breedingCategory`, [speciesId, atlasId])
    }
}


module.exports = AtlasDataDao;
