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
   * Creates table Municipality if that does not exist.
   * @returns {Promise}
   */
  createTableMunicipality() {
    const sql = `CREATE TABLE IF NOT EXISTS municipality (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name varchar(100),
            birdSocietyNameFI varchar(100),
            birdSocietyNameSV varchar(100),
            regionNumber INTEGER)`
    return this.#querier('run', sql)
  }

  /**
   * Creates table Grid if that does not exist.
   * @returns {Promise}
   */
  createTableGrid() {
    const sql = `CREATE TABLE IF NOT EXISTS grid (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coordinateN INTEGER,
            coordinateE INTEGER,
            municipality_id INTEGER REFERENCES municipality,
            gridName varchar(100))`
    return this.#querier('run', sql)
  }

  /**
   * Updates in table Municipality the entry with given data and id.
   * @param {Object} municipality
   * @returns {Promise}
   */
  updateMunicipality(municipality) {
    const {id, name, societyNameFI, societyNameSV, regionNumber} = municipality
    const sql = `UPDATE municipality
            SET name = ?,
            societyNameFI = ?,
            societyNameSV = ?,
            regionNumber = ?
            WHERE id = ?`
    return this.#querier('run', sql, [name, societyNameFI, societyNameSV, regionNumber, id])
  }

  /**
   * Updates in table Grid the entry with given data and id.
   * @param {Object} grid
   * @returns {Promise}
   */
  updateGrid(grid) {
    const {id, coordinateN, coordinateE, municipalityId, gridName} = grid
    const sql = `UPDATE grid
            SET coordinateN = ?,
            coordinateE = ?,
            municipality_id = ?,
            gridName = ?
            WHERE id = ?`
    return this.#querier('run', sql, [coordinateN, coordinateE, municipalityId, gridName, id])
  }

  /**
   * Deletes from table Municipality the entry with given id.
   * @param {number} id
   * @returns {Promise}
   */
  deleteMunicipality(id) {
    return this.#querier('run', `DELETE FROM municipality WHERE id = ?`, [id])
  }

  /**
   * Deletes from table Grid the entry with given id.
   * @param {number} id
   * @returns {Promise}
   */
  deleteGrid(id) {
    return this.#querier('run', `DELETE FROM grid WHERE id = ?`, [id])
  }

  /**
   * Returns the database search result from table Municipality with given id.
   * @param {number} id
   * @returns {Promise}
   */
  getMunicipalityById(id) {
    return this.#querier('get', `SELECT * FROM municipality WHERE id = ?`, [id])
  }

  /**
   * Returns the database search result from table Grid with given id.
   * @param {number} id
   * @returns {Promise}
   */
  getById(id) {
    return this.#querier('get', `SELECT * FROM grid WHERE id = :id`, [id])
  }

  /**
   * Returns the database search result for all data from table Municipality.
   * @returns {Promise}
   */
  getAllMunicipalities() {
    return this.#querier('all', `SELECT * FROM municipality`)
  }

  /**
   * Returns the database search result for all data from table Grid.
   * @returns {Promise}
   */
  getAll() {
    return this.#querier('all', `SELECT ID AS "id", COORDINATEN AS 
      "coordinateN", COORDINATEE AS "coordinateE", MUNICIPALITY_ID 
      AS "municipality_id", GRIDNAME AS "gridName" FROM grid`)
  }
}

module.exports = GridDao;
