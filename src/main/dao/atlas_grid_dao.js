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
    const sql = 'CREATE TABLE IF NOT EXISTS AtlasGrid (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'atlas INTEGER REFERENCES Atlas, ' +
      'grid VARCHAR(100) REFERENCES Grid, ' +
      'atlasClassSum INTEGER, ' +
      'activityCategory VARCHAR(100))'
    return this.#querier('run', sql)
  }

  /**
   * Returns the database search result for grid info for all grids with given id.
   * @param {number} gridId
   * @returns {Promise}
   */
  getAlasGridInfoForGrid(gridId) {
    return this.#querier('get', `SELECT * FROM AtlasGrid WHERE grid = ?`, [gridId])
  }


  /**
   * Returns the database search result for all grid info in given bird atlas, and levels from grids.
   * @returns {Promise}
   */
  getAllGridInfoForAtlas(atlasId) {
    return this.#querier('all',
      'SELECT AtlasGrid.id AS "id", ' +
      'AtlasGrid.grid AS "gridId", ' +
      'AtlasGrid.atlas AS "atlasId", ' +
      'Grid.level1 AS "level1", ' +
      'Grid.level2 AS "level2", ' +
      'Grid.level3 AS "level3", ' +
      'Grid.level4 AS "level4", ' +
      'Grid.level5 AS "level5", ' +
      'AtlasGrid.atlasClassSum AS "atlasClassSum", ' +
      'AtlasGrid.activityCategory AS "activityCategory" ' +
      'FROM AtlasGrid JOIN Grid' +
      'ON Grid.id = AtlasGrid.grid' +
      'WHERE atlas = :atlasId', [atlasId])
  }


  /**
   * Returns the database search result for all grid info in bird atlas.
   * @returns {Promise}
   */
  getAllGridInfo() {
    return this.#querier('all', `SELECT * FROM AtlasGrid`)
  }
}

module.exports = AtlasGridDao;
