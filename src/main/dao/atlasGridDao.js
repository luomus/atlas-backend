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
    return this.#querier.execute(sql)
  }

  /**
   * Returns the database search result for grid info for all grids with given id.
   * @param {number} gridId
   * @returns {Promise}
   */
  getAlasGridInfoForGrid(gridId) {
    return this.#querier.execute(`SELECT * FROM AtlasGrid WHERE grid = ?`, [gridId])
  }

  /**
   * Returns the database search result for all grid info in given bird atlas, and levels from grids.
   * @returns {Promise}
   */
  getAllGridInfoForAtlas(atlasId) {
    return this.#querier.execute(
      'SELECT AtlasGrid.id AS "id", ' +
      'AtlasGrid.grid AS "grid", ' +
      'AtlasGrid.atlas AS "atlas", ' +
      'Grid.level1 AS "level1", ' +
      'Grid.level2 AS "level2", ' +
      'Grid.level3 AS "level3", ' +
      'Grid.level4 AS "level4", ' +
      'Grid.level5 AS "level5", ' +
      'AtlasGrid.atlasClassSum AS "atlasClassSum", ' +
      'AtlasGrid.activityCategory AS "activityCategory", ' +
      'Grid.birdAssociationArea AS "birdAssociationArea" ' +
      'FROM AtlasGrid JOIN Grid ' +
      'ON Grid.id = AtlasGrid.grid ' +
      'WHERE AtlasGrid.atlas = :1', [atlasId])
  }

  getAtlasGridAndGridInfoForGridAndAtlas(gridId, atlasId) {
    return this.#querier.execute(
      'SELECT Grid.id AS "id", ' +
      'AtlasGrid.atlas AS "atlas", ' +
      'Grid.level1 AS "level1", ' +
      'Grid.level2 AS "level2", ' +
      'Grid.level3 AS "level3", ' +
      'Grid.level4 AS "level4", ' +
      'Grid.level5 AS "level5", ' +
      'AtlasGrid.atlasClassSum AS "atlasClassSum", ' +
      'AtlasGrid.activityCategory AS "activityCategory", ' +
      'Grid.birdAssociationArea AS "birdAssociationArea" ' +
      'FROM AtlasGrid JOIN Grid ' +
      'ON Grid.id = AtlasGrid.grid ' +
      'WHERE AtlasGrid.grid = :1 AND AtlasGrid.atlas = :2', [gridId, atlasId])
  }

  addAtlasGridData(atlasGrid) {
    const { atlas, grid, atlasClassSum, activityCategory } = atlasGrid

    const sql = 'INSERT INTO AtlasGrid (atlas, grid, atlasClassSum, activityCategory) ' +
      'VALUES (:1, :2, :3, :4)'

    return this.#querier.execute(sql, [atlas, grid, atlasClassSum, activityCategory])
  }

  addAtlasGridDataMany(atlasGrids) {
    const sql = 'INSERT INTO AtlasGrid (atlas, grid, atlasClassSum, activityCategory) ' +
    'VALUES (:atlas, :grid, :atlasClassSum, :activityCategory)'

    return this.#querier.executeMany(sql, atlasGrids)
  }

  updateAtlasGridData(atlasGrid) {
    const { id, atlasClassSum, activityCategory } = atlasGrid

    const sql = 'UPDATE AtlasGrid SET atlasClassSum = :1, activityCategory = :2 WHERE id = :3'

    return this.#querier.execute(sql, [atlasClassSum, activityCategory, id])
  }

  updateAtlasGridDataMany(atlasGrids) {
    const sql = 'UPDATE AtlasGrid SET atlasClassSum = :atlasClassSum, activityCategory = :activityCategory WHERE id = :id'

    return this.#querier.executeMany(sql, atlasGrids)
  }

  /**
   * Returns the database search result for all grid info in bird atlas.
   * @returns {Promise}
   */
  getAllGridInfo() {
    return this.#querier.execute(`SELECT * FROM AtlasGrid`)
  }
}

module.exports = AtlasGridDao;
