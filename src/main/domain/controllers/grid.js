const Querier = require('../../dao/querier')
const GridDao = require('../../dao/grid_dao')
const AtlasDataDao = require('../../dao/atlas_data_dao')
const querier = Querier()
const atlasDataDao = new AtlasDataDao(querier)
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

  getGridBreedingCategoryStats() {
    return async (req, res) => {
      const breedingCategoryNum = await atlasDataDao.getNumOfBreedingCategoriesById(req.param('gridId'))
      const speciesList = await atlasDataDao.getListOfDistinctBirdsById(req.param('gridId'))
      const data = Object.assign(breedingCategoryNum, speciesList)
      return res.json(data), () => res.send(null)
    }
  }

  getGridData() {
    return (req, res) => atlasDataDao.getDataForGrid(req.param('gridId'))
        .then((data) => res.json(data), () => res.send(null))
  }
}

module.exports = Grid
