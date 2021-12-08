const Querier = require('../../dao/querier')
const GridDao = require('../../dao/grid_dao')
const AtlasDataDao = require('../../dao/atlas_data_dao')
const querier = Querier()
const atlasDataDao = new AtlasDataDao(querier)
const gridDao = new GridDao(querier)

class Grid {
  /**
   * Returns all area points of the grid.
   * @returns {JSON}
   */
  getAll() {
    return (req, res) => gridDao.getAll()
        .then((data) => res.json(data), () => res.send(null))
  }

  /**
   * Returns info for one area point.
   * @returns {JSON}
   */
  getGridInfo() {
    return (req, res) => gridDao.getGridById(req.param('gridId'))
        .then((data) => res.json(data), () => res.send(null))
  }


  /**
   * Returns list of species for each breaading category for one area point.
   * @returns {JSON}
   */
  getGridStats() {
    return async (req, res) => {
      const breedingCategoryNum = await atlasDataDao.getNumOfBreedingCategoriesForGridAndAtlas(req.param('gridId'), req.param('atlasId')).catch(e => [])
      const speciesList = await atlasDataDao.getListOfDistinctBirdsForGridAndAtlas(req.param('gridId'), req.param('atlasId')).catch(e => [])
      const data = [...breedingCategoryNum, ...speciesList]
      return res.json(data)
    }
  }

  /**
   * Returns all atlas data for one area point.
   * @returns {JSON}
   */
  getGridData() {
    return (req, res) => atlasDataDao.getDataForGridAndAtlas(req.param('gridId'), req.param('atlasId'))
        .then((data) => res.json(data), () => res.send(null))
  }
}

module.exports = Grid
