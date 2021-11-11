class Birds {
  #birdDao
  #birdGridDao

  /**
     * @constructor
     * @param {BirdDao} birdDao
     * @param {BirdGridDao} birdGridDao
     */
  constructor(birdDao, birdGridDao) {
    this.#birdDao = birdDao
    this.#birdGridDao = birdGridDao
  }


  /**
     * Returns all birds in the database.
     * @returns {Array}
     */
  getAll() {
    return (req, res) => this.#birdDao.getAll()
        .then((data) => res.json(data), () => res.send(null))
  }


  /**
     * A method that returns all Atlas3 observations of a certain bird specified by bird id (MX.code).
     * @returns {Array}
     */
  getAllAtlas3DataBySpecies() {
    return (req, res) => {
      console.log(req.param('id'))
      return this.#birdGridDao.getBySpeciesFromAtlas3(req.param('id'))
          .then((data) => res.json(data), () => res.send(null))
    }
  }
  /**
     * A method that returns Atlas3 grid data for a certain bird specified by bird id (MX.code).
     * @returns {Array}
     */
  getGridAndBreedingdataForBird() {
    return (req, res) => {
      console.log(req.param('id'))
      return this.#birdGridDao.getGridAndBreedingdataForBird(req.param('id'))
          .then((data) => res.send(JSON.stringify(data)), () => res.send(null))
    }
  }
}

module.exports = Birds
