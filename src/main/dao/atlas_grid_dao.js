/**
 * Provides methods for accessing Atlas Grid Info database.
 */
class AtlasGridDao {
  #querier

  /**
   * @constructor
   * @param {Querier} querier
   */
  constructor(querier) {
    this.#querier = querier
  }

  /**
   * Creates table for grid info for bird atlas if that does not exist.
   * @returns {Promise}
   */
  createTableGridBirdAtlas() {
    const sql = `CREATE TABLE IF NOT EXISTS grid_bird_atlas (
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
   * Returns the database search result for grid info for all grids with given id.
   * @param {number} gridId
   * @returns {Promise}
   */
  getBirdAtlasGridInfoByGridId(gridId) {
    return this.#querier('get', `SELECT * FROM grid_bird_atlas WHERE grid_id = ?`, [gridId])
  }


  /**
   * Returns the database search result for all grid info in given bird atlas.
   * @returns {Promise}
   */
  getAllBirdAtlasGridInfoByAtlas(atlasId) {
    return this.#querier('get', `SELECT * FROM grid_bird_atlas WHERE atlas_id = ?`, [atlasId])
  }


  /**
   * Returns the database search result for all grid info in bird atlas.
   * @returns {Promise}
   */
   getAllBirdAtlasGridInfo() {
    return this.#querier('all', `SELECT * FROM grid_bird_atlas`)
  }


  
}

module.exports = AtlasGridDao;
