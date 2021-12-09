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
    const sql = `CREATE TABLE IF NOT EXISTS atlas (
            starting_year INTEGER,
            ending_year INTEGER,
            name varchar(100),
            species_group_id INTEGER REFERENCES species_group)`
    return this.#querier('run', sql)
  }


  /**
   * Returns the database search result for all atlas info for given species group.
   * @returns {Promise}
   */
  getAllAtlasInfoBySpeciesGroup(speciesGroupId) {
    return this.#querier('get', `SELECT * FROM atlas WHERE species_group_id = ?`, [speciesGroupId])
  }


  /**
   * Returns the database search result for all atlas info.
   * @returns {Promise}
   */
  getAllAtlasInfo() {
    return this.#querier('all', `SELECT * FROM atlas`)
  }
}

module.exports = AtlasDao;
