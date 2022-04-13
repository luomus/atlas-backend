const axios = require('axios')
/**
 * Provides methods for accessing grid and municipality databases.
 */
class GridDao {
  #querier

  /**
   * @constructor
   * @param {Querier} querier
   */
  constructor(querier) {
    this.#querier = querier
  }

  /**
   * Creates table Grid if that does not exist.
   * @returns {Promise}
   */
  createTableGrid() {
    const sql = 'CREATE TABLE IF NOT EXISTS Grid (' +
      'id VARCHAR(100) PRIMARY KEY, ' +
      'coordinates VARCHAR(7), ' +
      'birdAssociationArea VARCHAR(100), ' +
      'name VARCHAR(100), ' +
      'level1 FLOAT, ' +
      'level2 FLOAT, ' +
      'level3 FLOAT, ' +
      'level4 FLOAT, ' +
      'level5 FLOAT)'
    return this.#querier.execute(sql)
  }

  /**
   * Adds a grid to table
   * @param {Object} grid
   * @returns {Promise}
   */
  addGrid(grid) {
    const {id, coordinates, birdAssociationArea, name, level1, level2, level3, level4, level5} = grid
    const sql = 'INSERT INTO Grid(id, coordinates, birdAssociationArea, name, ' +
      'level1, level2, level3, level4, level5) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9)'
    return this.#querier.execute(sql,
      [id, coordinates, birdAssociationArea, name, level1, level2, level3, level4, level5])
  }

  /**
   * Updates in table Grid the entry with given data and id.
   * @param {Object} grid
   * @returns {Promise}
   */
  updateGrid(grid) {
    const {id, coordinates, birdAssociationArea, name, level1, level2, level3, level4, level5} = grid
    const sql = 'UPDATE Grid SET id = ?, coordinates = ?, birdAssociationArea = ?, name = ?, ' +
      'level1 = ?, level2 = ?, level3 = ?, level4 = ?, level5 = ? WHERE id = ?'
    return this.#querier.execute(sql,
      [id, coordinates, birdAssociationArea, name, level1, level2, level3, level4, level5, id])
  }

  /**
   * Deletes from table Grid the entry with given id.
   * @param {number} id
   * @returns {Promise}
   */
  deleteGrid(id) {
    return this.#querier.execute(`DELETE FROM Grid WHERE id = ?`, [id])
  }

  /**
   * Returns the database search result from table Grid with given id.
   * @param {number} id
   * @returns {Promise}
   */
  getById(id) {
    return this.#querier.execute('SELECT id AS "id", ' +
    'coordinates AS "coordinates", ' +
    'birdAssociationArea AS "birdAssociationArea", ' +
    'name AS "name", ' +
    'level1 AS "level1", ' +
    'level2 AS "level2", ' +
    'level3 AS "level3", ' +
    'level4 AS "level4", ' +
    'level5 AS "level5" FROM Grid WHERE id=:1', [id])
  }

  /**
   * Returns the database search result for all data from table Grid.
   * @returns {Promise}
   */
  getAll() {
    return this.#querier.execute(
      'SELECT id AS "id", ' +
      'coordinates AS "coordinates", ' +
      'birdAssociationArea AS "birdAssociationArea", ' +
      'name AS "name", ' +
      'level1 AS "level1", ' +
      'level2 AS "level2", ' +
      'level3 AS "level3", ' +
      'level4 AS "level4", ' +
      'level5 AS "level5" ' +
      'FROM Grid ' +
      'ORDER BY name')
  }


  /**
   * Returns the database search result for all grid info and atlasgrid info in given bird atlas.
   * @returns {Promise}
   */
   getAllAndAtlasGridForAtlas(atlasId) {
    return this.#querier.execute(
      'SELECT Grid.id AS "id", ' +
      'Grid.coordinates AS "coordinates", ' +
      'AtlasGrid.atlas AS "atlas", ' +
      'GRid.name AS "name", ' +  
      'Grid.level1 AS "level1", ' +
      'Grid.level2 AS "level2", ' +
      'Grid.level3 AS "level3", ' +
      'Grid.level4 AS "level4", ' +
      'Grid.level5 AS "level5", ' +
      'AtlasGrid.atlasClassSum AS "atlasClassSum", ' +
      'AtlasGrid.activityCategory AS "activityCategory", ' +
      'Grid.birdAssociationArea AS "birdAssociationArea" ' +
      'FROM Grid LEFT JOIN AtlasGrid ' +
      'ON Grid.id = AtlasGrid.grid ' +
      'AND AtlasGrid.atlas = :1', [atlasId])
  }

    /**
   * Returns the database search result for all grid info and atlasgrid info in given bird atlas and grid.
   * @returns {Promise}
   */
    getByIdAndAtlasGridForAtlas(gridId, atlasId) {
      return this.#querier.execute(
        'SELECT Grid.id AS "id", ' +
        'Grid.coordinates AS "coordinates", ' +
        'AtlasGrid.atlas AS "atlas", ' +
        'GRid.name AS "name", ' +  
        'Grid.level1 AS "level1", ' +
        'Grid.level2 AS "level2", ' +
        'Grid.level3 AS "level3", ' +
        'Grid.level4 AS "level4", ' +
        'Grid.level5 AS "level5", ' +
        'AtlasGrid.atlasClassSum AS "atlasClassSum", ' +
        'AtlasGrid.activityCategory AS "activityCategory", ' +
        'Grid.birdAssociationArea AS "birdAssociationArea" ' +
        'FROM Grid LEFT JOIN AtlasGrid ' +
        'ON Grid.id = AtlasGrid.grid ' +
        'AND AtlasGrid.atlas = :1 ' +
        'WHERE Grid.id = :2', [atlasId, gridId])
    }
}

module.exports = GridDao;
