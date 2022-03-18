const axios = require('axios')

/**
 * Provides methods for accessing Atlas Data database.
 */
class AtlasGridSpeciesDataDao {
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
    const sql = 'CREATE TABLE IF NOT EXISTS AtlasGridSpeciesData (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'speciesId VARCHAR(100), ' +
      'grid VARCHAR(100) REFERENCES Grid, ' +
      'atlas INTEGER REFERENCES Atlas, ' +
      'atlasCode VARCHAR(100), ' +
      'atlasClass VARCHAR(100))'
    return this.#querier('run', sql)
  }


  /**
   * Returns the database search result for all bird atlas data.
   * @returns {Promise}
   */
  getAllData() {
    return this.#querier('all', `SELECT * AtlasGridSpeciesData`)
  }


  /**
   * Returns the database search result for all bird data in given at.
   * @param {number} atlasId
   * @returns {Promise}
   */
  getAllDataForAtlas(atlasId) {
    return this.#querier('all', `SELECT * AtlasGridSpeciesData WHERE atlas = ?`, [atlasId])
  }


  /**
   * Returns the database search result for all data with given species mx-code.
   * @param {string} speciesId
   * @returns {Promise}
   */
  getDataForSpecies(speciesId) {
    return this.#querier('all',
      'SELECT id AS "id", ' +
      'species AS "species", ' +
      'grid AS "grid", ' +
      'atlasCode AS "atlasCode", ' +
      'atlasClass AS "atlasClass" ' +
      'FROM AtlasGridSpeciesData ' +
      'WHERE species = :speciesId', [speciesId])
  }

  /**
   * Returns the database search result of atlases that have observations of given species.
   * @param {string} speciesId
   * @returns {Promise}
   */
  getAtlasesForSpecies(speciesId) {
    return this.#querier('all', `SELECT atlas AS "atlas" FROM AtlasGridSpeciesData WHERE species = :speciesId`, [speciesId])
  }

  /**
   * Returns the database search result for all data with given species mx-code and atlas id.
   * @param {string} speciesId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getDataForSpeciesAndAtlas(speciesId, atlasId) {
    return this.#querier('all',
      'SELECT id AS "id", ' +
      'AtlasGridSpeciesData.species AS "species", ' +
      'AtlasGridSpeciesData.grid AS "grid", ' +
      'grid.coordinates AS "coordinates", ' +
      'AtlasGridSpeciesData.atlasCode AS "atlasCode", ' +
      'AtlasGridSpeciesData.atlasClass AS "atlasClass" ' +
      'FROM AtlasGridSpeciesData JOIN grid ' +
      'ON grid.id = AtlasGridSpeciesData.grid ' +
      'WHERE species = :speciesId ' +
      'AND atlas = :atlasId', [speciesId, atlasId])
  }


  /**
   * Returns the database search result for all data with given species mx-code combined with grid id, grid coordinates, and breeding category.
   * @param {string} speciesId
   * @returns {Promise}
   */
  getGridAndBreedingdataForSpecies(speciesId) {
    return this.#querier('all',
      'SELECT AtlasGridSpeciesData.grid AS "grid", ' +
      'grid.coordinates AS "coordinates" , ' +
      'AtlasGridSpeciesData.atlasClass AS "atlasClass" ' +
      'FROM AtlasGridSpeciesData JOIN grid ' +
      'ON grid.id = AtlasGridSpeciesData.grid ' +
      'WHERE AtlasGridSpeciesData.species = :speciesId', [speciesId])
  }


  /**
   * Returns the database search result for all data with given atlas and species
   * combined with grid id, grid coordinates, and breeding category.
   * @param {number} speciesId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getGridAndBreedingdataForSpeciesAndAtlas(speciesId, atlasId) {
    return this.#querier('all',
      'SELECT grid.id AS "grid", ' +
      'grid.coordinates AS "coordinates", ' +
      'AtlasGridSpeciesData.atlasClass AS "atlasClass" ' +
      'FROM AtlasGridSpeciesData JOIN grid ' +
      'ON grid.id = AtlasGridSpeciesData.grid ' +
      'WHERE AtlasGridSpeciesData.species = :speciesId ' +
      'AND AtlasGridSpeciesData.atlas = :atlasId', [speciesId, atlasId])
  }


  /**
   * Returns the database search result for all data for given grid and atlas.
   * @param {number} gridId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getDataForGridAndAtlas(gridId, atlasId) {
    return this.#querier('all',
      'SELECT id AS "id", ' +
      'species AS "species", ' +
      'grid AS "grid", ' +
      'atlasClass AS "atlasClass", ' +
      'atlasCode AS "atlasCode" ' +
      'FROM AtlasGridSpeciesData ' +
      'WHERE AtlasGridSpeciesData.grid = :gridId ' +
      'AND AtlasGridSpeciesData.atlas = :atlasId', [gridId, atlasId])
  }


  /**
   * Returns the database search result for number of breeding categories for given grid.
   * @param {number} gridId
   * @returns {Promise}
   */
  getNumOfBreedingCategoriesForGrid(gridId) {
    return this.#querier('all', 'SELECT atlasClass AS "atlasClass", count(*) AS "num" FROM AtlasGridSpeciesData ' +
      'WHERE grid = :gridId GROUP BY atlasClass', [gridId])
  }


  /**
   * Returns the database search result for number of breeding categories for given grid and atlas.
   * @param {number} gridId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getNumOfBreedingCategoriesForGridAndAtlas(gridId, atlasId) {
    return this.#querier('all', 'SELECT atlasClass AS "atlasClass", count(*) AS "num" FROM AtlasGridSpeciesData ' +
      'WHERE grid = :gridId AND atlas = :atlasId GROUP BY atlasClass', [gridId, atlasId])
  }


  /**
   * Returns the database search result for list of species for given grid.
   * @param {number} gridId
   * @returns {Promise}
   */
  getListOfDistinctBirdsForGrid(gridId) {
    return this.#querier('all', 'SELECT distinct AtlasGridSpeciesData., species.speciesFi ' +
      'FROM AtlasGridSpeciesData, species WHERE species.mxCode=AtlasGridSpeciesData. ' +
      'AND AtlasGridSpeciesData.grid= :gridId AND visibility=1', [gridId])
  }


  /**
   * Returns the database search result for list of species for given grid and atlas.
   * @param {number} gridId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getListOfDistinctBirdsForGridAndAtlas(gridId, atlasId) {
    return this.#querier('all', 'SELECT distinct AtlasGridSpeciesData.species AS "species", ' +
      'AtlasGridSpeciesData.atlasClass AS "atlasClass" ' +
      'FROM AtlasGridSpeciesData WHERE AtlasGridSpeciesData.grid = :gridId ' +
      'AND AtlasGridSpeciesData.atlas = :atlasId', [gridId, atlasId])
  }

  /**
   * Returns the database search result for list of species for given grid and atlas.
   * @param {number} speciesId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getatlasClassSumForSpecies(speciesId, atlasId) {
    return this.#querier('all', 'SELECT atlasClass AS "atlasClass", count(*) "categorySum" ' +
      'FROM AtlasGridSpeciesData WHERE  = :speciesId AND atlas= :atlasId ' +
      'GROUP BY atlasClass', [speciesId, atlasId])
  }
}

module.exports = AtlasGridSpeciesDataDao;
