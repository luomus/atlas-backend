const Querier = require('../../dao/querier')
const SpeciesDao = require('../../dao/species_dao')
const GridDao = require('../../dao/grid_dao')
const SpeciesGridDao = require('../../dao/species_grid_dao')
const querier = Querier()
const speciesGridDao = new SpeciesGridDao(querier)
const speciesDao = new SpeciesDao(querier)
const gridDao = new GridDao(querier)

class Taxon {
  /**
     * Returns all species in the database.
     * @returns {Array}
     */
  getAll() {
    return (req, res) => speciesDao.getAll()
        .then((data) => res.json(data), () => res.send(null))
  }


  /**
     * A method that returns all Atlas3 observations of a certain bird specified by bird id (MX.code).
     * @returns {Array}
     */
  getAllAtlas3DataBySpecies() {
    return (req, res) => {
      return speciesGridDao.getBySpeciesFromAtlas3(req.param('taxonId'))
          .then((data) => res.json(data), () => res.send(null))
    }
  }

  getAllDataBySpecies() {
    return (req, res) => {
      return speciesGridDao.getAllDataBySpecies(req.param('taxonId'))
          .then((data) => res.json(data), () => res.send(null))
    }
  }

  /**
     * A method that returns Atlas3 grid data for a certain bird specified by bird id (MX.code).
     * @returns {Array}
     */
  getGridAndBreedingdataForBird() {
    return (req, res) => {
      return speciesGridDao.getGridAndBreedingdataForBird(req.param('taxonId'))
          .then((data) => res.send(JSON.stringify(data)), () => res.send(null))
    }
  }

  countByGroup() {
    return (req, res) => speciesDao.countByGroup(req.param('taxonId'))
        .then((data) => res.json(data), () => res.send(null))
  }
}

module.exports = Taxon
