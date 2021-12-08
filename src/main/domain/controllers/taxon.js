const Querier = require('../../dao/querier')
const SpeciesDao = require('../../dao/species_dao')
const AtlasDataDao = require('../../dao/atlas_data_dao')
const querier = Querier()
const atlasDataDao = new AtlasDataDao(querier)
const speciesDao = new SpeciesDao(querier)

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
  getAllDataBySpeciesAndAtlas() {
    return (req, res) => {
      return atlasDataDao.getDataBySpeciesAndAtlas(req.param('taxonId', 'atlasId'))
          .then((data) => res.json(data), () => res.send(null))
    }
  }

  getAllDataBySpecies() {
    return (req, res) => {
      return atlasDataDao.getAllDataBySpecies(req.param('taxonId'))
          .then((data) => res.json(data), () => res.send(null))
    }
  }

  /**
     * A method that returns atlas grid data for a certain species specified by id (MX.code).
     * @returns {Array}
     */
  getGridAndBreedingdataForBird() {
    return (req, res) => {
      return atlasDataDao.getGridAndBreedingdataForSpecies(req.param('taxonId'))
          .then((data) => res.send(JSON.stringify(data)), () => res.send(null))
    }
  }

  countByGroup() {
    return (req, res) => speciesDao.countByGroup(req.param('taxonId'))
        .then((data) => res.json(data), () => res.send(null))
  }
}

module.exports = Taxon
