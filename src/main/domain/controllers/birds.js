const Querier = require('../../dao/querier')
const BirdDao = require('../../dao/bird_dao')
const GridDao = require('../../dao/grid_dao')
const BirdGridDao = require('../../dao/bird_grid_dao')
const querier = Querier()
const birdGridDao = new BirdGridDao(querier)
const birdDao = new BirdDao(querier)
const gridDao = new GridDao(querier)

class Birds {

  /**
     * Returns all birds in the database.
     * @returns {Array}
     */
  getAll() {
    console.log("getAll()")
    return (req, res) => birdDao.getAll()
        .then((data) => res.json(data), () => res.send(null))
  }


  /**
     * A method that returns all Atlas3 observations of a certain bird specified by bird id (MX.code).
     * @returns {Array}
     */
  getAllAtlas3DataBySpecies() {
    return (req, res) => {
      console.log('api/species', req.param('id'))
      return birdGridDao.getBySpeciesFromAtlas3(req.param('id'))
          .then((data) => res.json(data), () => res.send(null))
    }
  }
  /**
     * A method that returns Atlas3 grid data for a certain bird specified by bird id (MX.code).
     * @returns {Array}
     */
  getGridAndBreedingdataForBird() {
    return (req, res) => {
      console.log('api/species/data', req.param('id'))
      return birdGridDao.getGridAndBreedingdataForBird(req.param('id'))
          .then((data) => res.send(JSON.stringify(data)), () => res.send(null))
    }
  }
}

module.exports = Birds
