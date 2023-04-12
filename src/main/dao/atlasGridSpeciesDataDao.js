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
    return this.#querier.execute(sql)
  }

  /**
   * Returns the database search result for all bird atlas data.
   * @returns {Promise}
   */
  getAllData() {
    return this.#querier.execute(
    `SELECT id AS "id", ' +
    'species AS "species", ' +
    'grid AS "grid", ' +
    'atlas AS "atlas" ' +
    'atlasCode AS "atlasCode", ' +
    'atlasClass AS "atlasClass" ' +
    'FROM AtlasGridSpeciesData`)
  }


  /**
   * Returns the database search result for all bird data in given at.
   * @param {number} atlasId
   * @returns {Promise}
   */
  getAllDataForAtlas(atlasId) {
    return this.#querier.execute(
    `SELECT id AS "id", ' +
    'species AS "species", ' +
    'grid AS "grid", ' +
    'atlas AS "atlas" ' +
    'atlasCode AS "atlasCode", ' +
    'atlasClass AS "atlasClass" ' +
    'FROM AtlasGridSpeciesData WHERE atlas = ?`, [atlasId])
  }


  /**
   * Returns the database search result for all data with given species mx-code.
   * @param {string} speciesId
   * @returns {Promise}
   */
  getDataForSpecies(speciesId) {
    return this.#querier.execute(
      'SELECT id AS "id", ' +
      'species AS "species", ' +
      'grid AS "grid", ' +
      'atlas AS "atlas" ' +
      'atlasCode AS "atlasCode", ' +
      'atlasClass AS "atlasClass" ' +
      'FROM AtlasGridSpeciesData ' +
      'WHERE species = :speciesId', [speciesId])
  }

  /**
   * Returns the database search result for all data with given species mx-code and atlas id.
   * @param {string} speciesId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getDataForSpeciesAndAtlas(speciesId, atlasId) {
    return this.#querier.execute(
      'SELECT id AS "id", ' +
      'speciesId AS "speciesId", ' +
      'grid AS "grid", ' +
      'atlasCode AS "atlasCode", ' +
      'atlasClass AS "atlasClass" ' +
      'FROM AtlasGridSpeciesData ' +
      'WHERE speciesId = :speciesId ' +
      'AND atlas = :atlasId', [speciesId, atlasId])
  }

  /**
   * Returns the database search result for all data for given grid and atlas.
   * @param {number} gridId
   * @param {number} atlasId
   * @returns {Promise}
   */
  getDataForGridAndAtlas(gridId, atlasId) {
    return this.#querier.execute(
      'SELECT id AS "id", ' +
      'species AS "species", ' +
      'grid AS "grid", ' +
      'atlasClass AS "atlasClass", ' +
      'atlasCode AS "atlasCode" ' +
      'FROM AtlasGridSpeciesData ' +
      'WHERE AtlasGridSpeciesData.grid = :gridId ' +
      'AND AtlasGridSpeciesData.atlas = :atlasId', [gridId, atlasId])
  }
}

module.exports = AtlasGridSpeciesDataDao;
