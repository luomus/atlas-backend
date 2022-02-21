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

    this.createTableGrid()
  }

  /**
   * Creates table Grid if that does not exist.
   * @returns {Promise}
   */
  createTableGrid() {
    const sql = `CREATE TABLE IF NOT EXISTS Grid (\
            id VARCHAR(100) PRIMARY KEY, \
            coordinates VARCHAR(7), \
            birdAssociationArea VARCHAR(100), \
            name VARCHAR(100), \
            level1 INTEGER, \
            level2 FLOAT, \
            level3 FLOAT, \
            level4 FLOAT, \
            level5 FLOAT)`
    return this.#querier('run', sql)
  }

  /**
   * Adds a grid to table
   * @param {Object} grid
   * @returns {Promise}
   */
  addGrid(grid) {
    const {id, coordinates, birdAssociationArea, name, level1, level2, level3, level4, level5} = grid
    const sql = `INSERT INTO Grid (id, \
      coordinates, \
      birdAssociationArea, \
      name, \
      level1, \
      level2, \
      level3, \
      level4, \
      level5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    return this.#querier('run', sql,
      [id, coordinates, birdAssociationArea, name, level1, level2, level3, level4, level5])
  }

  /**
   * Updates in table Grid the entry with given data and id.
   * @param {Object} grid
   * @returns {Promise}
   */
  updateGrid(grid) {
    const {id, coordinates, birdAssociationArea, name, level1, level2, level3, level4, level5} = grid
    const sql = `UPDATE Grid \
      SET \
      id = ?, \
      coordinates = ?, \
      birdAssociationArea = ?, \
      name = ?, \
      level1 = ?, \
      level2 = ?, \
      level3 = ?, \
      level4 = ?, \
      level5 = ? \
      WHERE id = ?`
    return this.#querier('run', sql,
      [id, coordinates, birdAssociationArea, name, level1, level2, level3, level4, level5, id])
  }

  /**
   * Deletes from table Grid the entry with given id.
   * @param {number} id
   * @returns {Promise}
   */
  deleteGrid(id) {
    return this.#querier('run', `DELETE FROM Grid WHERE id = ?`, [id])
  }

  /**
   * Returns the database search result from table Grid with given id.
   * @param {number} id
   * @returns {Promise}
   */
  getById(id) {
    return this.#querier('get', `SELECT * FROM Grid WHERE id = :id`, [id])
  }

  /**
   * Returns the database search result for all data from table Grid.
   * @returns {Promise}
   */
  getAll() {
    return this.#querier('all',
      `SELECT * FROM Grid`)
  }

  /**
   * 
   * @param {*} grid
   * @returns 
   */
  getGridForActiveAtlas(grid) {
    const params = {
      aggregateBy: 'unit.linkings.taxon.speciesId,unit.linkings.taxon.speciesNameEnglish,unit.linkings.taxon.speciesNameFinnish,unit.linkings.taxon.speciesNameSwedish,unit.linkings.taxon.speciesScientificName,unit.linkings.taxon.speciesTaxonomicOrder',
      orderBy: 'unit.linkings.taxon.speciesTaxonomicOrder',
      atlasCounts: true,
      taxonId: 'MX.37580',
      time: '2022/2025',
      coordinateAccuracyMax: 10000,
      ykj10kmCenter: grid,
      recordQuality: 'EXPERT_VERIFIED,COMMUNITY_VERIFIED,NEUTRAL',
      hasValue: 'unit.atlasClass',
      pageSize: 100,
      page: 1,
      cache: true,
    }
    return axios.get('https://laji.fi/api/warehouse/query/unit/aggregate', { params })
  }
}

module.exports = GridDao;
