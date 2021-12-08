const Querier = require('../../dao/querier')
const SpeciesDao = require('../../dao/species_dao')
const GridDao = require('../../dao/grid_dao')
const SpeciesGridDao = require('../../dao/species_grid_dao')
const querier = Querier()
const speciesGridDao = new SpeciesGridDao(querier)
const speciesDao = new SpeciesDao(querier)
const gridDao = new GridDao(querier)

class Grid {
  getAll() {
    return (req, res) => gridDao.getAll()
        .then((data) => res.json(data), () => res.send(null))
  }

  /**
     * A method that gets info for one data point.
     * @returns {JSON}
     */
  getGridInfo() {
    return (req, res) => gridDao.getGridById(req.param('gridId'))
        .then((data) => res.json(data), () => res.send(null))
  }

  getGridStats() {
    return (req, res) => gridDao.countSpecies(req.param('gridId'))
        .then((data) => res.json(data), () => res.send(null))
  }

  getGridStats() {
    return async (req, res) => {
      const breedingCategoryNum = await speciesGridDao.getNumOfBreedingCategoriesById(req.param('gridId')).catch(e => [])
      const speciesList = await speciesGridDao.getListOfDistinctBirdsById(req.param('gridId')).catch(e => [])
      const data = [...breedingCategoryNum, ...speciesList]
      return res.json(data)
    }
  }

  getGridData() {
    return (req, res) => speciesGridDao.getDataByGridId(req.param('gridId'))
        .then((data) => res.json(data), () => res.send(null))
  }
}

module.exports = Grid
