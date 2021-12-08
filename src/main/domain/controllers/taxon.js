const Querier = require('../../dao/querier')
const SpeciesDao = require('../../dao/species_dao')
const AtlasDataDao = require('../../dao/atlas_data_dao')
const querier = Querier()
const atlasDataDao = new AtlasDataDao(querier)
const speciesDao = new SpeciesDao(querier)

class Taxon {
  /**
     * A method that returns all species in the database.
     * @returns {Array}
     */
  getAll() {
    return (req, res) => speciesDao.getAll()
        .then((data) => res.json(data), () => res.send(null))
  }


  /**
     * A method that returns all observations of a given specified in given atlas.
     * @returns {Array}
     */
  getAllDataBySpeciesAndAtlas() {
    return (req, res) => {
      return atlasDataDao.getDataForSpeciesAndAtlas(req.param('speciesId'), req.param('atlasId'))
          .then((data) => res.json(data), () => res.send(null))
    }
  }

  getAllDataBySpecies() {
    return (req, res) => {
      return atlasDataDao.getDataForSpecies(req.param('speciesId'))
          .then((data) => res.json(data), () => res.send(null))
    }
  }

  /**
     * A method that returns atlas grid data for a certain species specified by id (MX.code).
     * @returns {Array}
     */
  getGridAndBreedingdataForBird() {
    return (req, res) => {
      return atlasDataDao.getGridAndBreedingdataForSpecies(req.param('speciesId'))
          .then((data) => res.send(JSON.stringify(data)), () => res.send(null))
    }
  }

  countByGroup() {
    return (req, res) => speciesDao.countByGroup(req.param('speciesId'))
        .then((data) => res.json(data), () => res.send(null))
  }
}

module.exports = Taxon
