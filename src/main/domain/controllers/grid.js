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

  getCollection() {
     return async (req, res) => {
       const {speciesId, atlasId} = req.params 
       if (typeof speciesId !== 'undefined') {
        // Return collection of area resources with species data
        const data = await atlasDataDao.getDataForSpeciesAndAtlas(speciesId, atlasId)
          .then((data) => res.json(data), () => res.send(null))
        data = data.map(area => ({
          id: area.grid_id,
          coordinateN: grid_id.substring(0, 3),
          coordinateE: grid_id.substring(3, 6),
          breedingCategory: area.breedingCategory,
          breedingIndex: area.breedingIndex,
        }))

       } else {
        // Return collection of all areas
        return gridDao.getAll().then((data) => res.json(data), () => res.send(null)) 
       }
     }
    } 

  /**
   * Returns info for one area point.
   * @returns {JSON}
   */
  getGridInfo() {
    return (req, res) => gridDao.getGridById(req.params.gridId)
        .then((data) => res.json(data), () => res.send(null))
  }


  /**
   * Returns list of species for each breaading category for one area point.
   * @returns {JSON}
   */
  getGridStats() {
    return async (req, res) => {
      const {gridId, atlasId} = req.params
      const birdList = await atlasDataDao.getListOfDistinctBirdsForGridAndAtlas(gridId, atlasId).catch((e) => [])
      const categories = [1, 2, 3, 4].map((int) => ({categoryNumber: int, sum: 0, speciesList: []}))
      birdList.forEach((s) => {
        if (s.breedingCategory === 0) return
        const cat = categories.find((c) => c.categoryNumber === s.breedingCategory)
        cat.sum += 1
        cat.speciesList.push({speciesId: s.species_id, speciesFi: s.speciesFi})
      })
      return res.json(categories)
    }
  }

  /**
   * Returns all atlas data for one area point.
   * @returns {JSON}
   */
  getGridData() {
    return (req, res) => atlasDataDao.getDataForGridAndAtlas(req.params.gridId, req.params.atlasId)
        .then((data) => res.json(data), () => res.send(null))
  }
}

module.exports = Grid
