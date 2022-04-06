/**
 * Provides methods for accessing Bird Atlas database.
 */
class AtlasDao {
  #querier

  /**
   * @constructor
   * @param {Querier} querier
   */
  constructor(querier) {
    this.#querier = querier
  }

  /**
   * Creates table for atlas if that does not exist.
   * @returns {Promise}
   */
  createTableAtlas() {
    const sql = 'CREATE TABLE IF NOT EXISTS Atlas (' +
      'id INTEGER PRIMARY KEY, ' +
      'startingYear INTEGER, ' +
      'endingYear INTEGER, ' +
      'name VARCHAR(100))'
    return this.#querier.execute(sql)
  }

  /**
   * Returns the database search result for all atlas info for given species group.
   * @returns {Promise}
   */
  getById(atlasId) {
    return this.#querier.execute(`SELECT * FROM Atlas WHERE id = :atlasId`, [atlasId])
  }

  /**
   * Returns the database search result for all atlas info.
   * @returns {Promise}
   */
  getAll() {
    return this.#querier.execute('SELECT' +
    'id as "id", ' +
    'startingYear as "startingYear"' +
    'endingYear as "endingYear"' +
    'name as "name"' +
    'FROM Atlas')
  }
}

module.exports = AtlasDao;
