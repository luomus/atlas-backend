/**
 * Provides methods for accessing bird species database.
 */
class SpeciesDao {
  #querier

  /**
   * @constructor
   * @param {Querier} querier
   */
  constructor(querier) {
    this.#querier = querier
  }

  /**
   * Creates table Species if that does not exist.
   * @returns {Promise}
   */
  createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS species (
            id INTEGER AUTOINCREMENT,
            mxcode INTEGER PRIMARY KEY,
            speciesAbbr VARCHAR(6),
            speciesSCI VARCHAR(100),
            speciesFI VARCHAR(100),
            speciesSV VARCHAR(100),
            speciesEN VARCHAR(100),
            speciesGroup_id REFERENCES speciesGroup,
            visibility INTEGER)`
    return this.#querier('run', sql)
  }

  /**
   * Creates new entry with given info in table Species.
   * @param {{mxcode: number, abbr: string, nameSCI: string, nameFI: string, nameSV: string, nameEN: string,
   *          groupId: number}} species
   * @returns {Promise}
   */
  create(species) {
    const {mxcode, abbr, nameSCI, nameFI, nameSV, nameEN, groupId} = species
    const sql = `INSERT INTO species 
            (mxcode, speciesFI, speciesSV, speciesEN, speciesSCI, speciesAbbr, speciesGroup_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`
    return this.#querier('run', sql, [mxcode, abbr, nameSCI, nameFI, nameSV, nameEN, groupId])
  }

  /**
   * Updates the entry with given mx-code in table Species.
   * @param {{mxcode: number, abbr: string, nameSCI: string, nameFI: string, nameSV: string, nameEN: string}} species
   * @returns {Promise}
   */
  update(species) {
    const {mxcode, abbr, nameSCI, nameFI, nameSV, nameEN} = species
    const sql = `UPDATE species
            SET speciesAbbr = ?,
            speciesSCI = ?,
            speciesFI = ?,
            speciesSV = ?,
            speciesEN = ?
            WHERE mxcode = ?`
    return this.#querier('run', sql, [abbr, nameSCI, nameFI, nameSV, nameEN, mxcode])
  }

  /**
   * Deletes the entry with given mx-code from table Species.
   * @param {number} mxcode
   * @returns {Promise}
   */
  delete(mxcode) {
    return this.#querier('run', `DELETE FROM species WHERE mxcode = ?`, [mxcode])
  }

  /**
   * Returns the database search result from table Species with given mx-code.
   * @param {number} mxcode
   * @returns {Promise}
   */
  getSpeciesById(mxcode) {
    return this.#querier('get', `SELECT mxCode AS "mxCode", speciesFI AS "speciesFI",
    speciesSV AS "speciesSV", speciesEN AS "speciesEN", speciesSCI AS "speciesSCI",
    speciesAbbr AS "speciesAbbr", speciesGroup_id AS "speciesGroup_id", visibility 
    AS "visibility" FROM species WHERE mxcode = :mxcode`, [mxcode])
  }

  /**
   * Returns the database search result from table Species with given species group id.
   * @param {number} speciesGroupId
   * @returns {Promise}
   */
  getAllByGroup(speciesGroupId) {
    return this.#querier('get', `SELECT * FROM species WHERE speciesGroup_id = ?`, [speciesGroupId])
  }

  /**
   * Returns the database search result for all data from table Species.
   * @returns {Promise}
   */
  getAll() {
    return this.#querier('all', `SELECT MXCODE AS "mxCode", SPECIESFI AS "speciesFI",
      SPECIESSV AS "speciesSV", SPECIESEN AS "speciesEN", SPECIESSCI AS "speciesSCI",
      SPECIESABBR AS "speciesAbbr", SPECIESGROUP_ID AS "speciesGroup_id", VISIBILITY 
      AS "visibility" FROM species`)
  }

  countAll() {
    return this.#querier('get', `SELECT COUNT(mxcode) * FROM species`)
  }

  countByGroup(speciesGroupId) {
    return this.#querier('get', `SELECT COUNT(mxcode) * FROM species WHERE speciesGroup_id = ?`, [speciesGroupId])
  }

  searchForSpecies(name) {
    return this.#querier('all', `SELECT * FROM species WHERE speciesFI LIKE '%name%'
      OR speciesSV LIKE '%name%'
      OR speciesEN LIKE '%name%'
      OR speciesSCI LIKE '%name%'
      OR speciesAbbr LIKE '%name%'`, [name])
  }
}

module.exports = SpeciesDao;
