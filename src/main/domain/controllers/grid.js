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

  // eslint-disable-next-line max-lines-per-function
  getCollection() {
    // eslint-disable-next-line max-lines-per-function
    return async (req, res) => {
      let {speciesId, atlasId = __latestAtlas} = req.query
      if (typeof speciesId !== 'undefined') {
        // Return collection of area resources with species data
        speciesId = speciesId.split('.')[1]
        let data = await atlasDataDao.getDataForSpeciesAndAtlas(speciesId, atlasId).catch((e) => [])
        data = data.map((area) => ({
          id: area.grid_id.toString(),
          coordinateN: parseInt(area.grid_id.toString().substring(0, 3)),
          coordinateE: parseInt(area.grid_id.toString().substring(3, 6)),
          breedingCategory: parseInt(area.breedingCategory),
          breedingIndex: parseInt(area.breedingIndex),
        }))
        return res.json({
          species: {id: speciesId.toString()},
          atlas: {id: atlasId.toString()},
          collection: data,
        })
      } else
        // Return collection of all areas
        return gridDao.getAll().then((data) => res.json(data), () => res.send(null))
    }
  }

  /**
   * Returns info for one area point.
   * @returns {JSON}
   */
  getGridInfo() {
    return (req, res) => gridDao.getById(req.params.areaId)
        .then((data) => res.json(data), () => res.send(null))
  }


  /**
   * Returns list of species for each breaading category for one area point.
   * @returns {JSON}
   */
  getGridStats() {
    return async (req, res) => {
      const {areaId, atlasId} = req.params
      const birdList = await atlasDataDao.getListOfDistinctBirdsForGridAndAtlas(areaId, atlasId).catch((e) => [])
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
    return (req, res) => atlasDataDao.getDataForGridAndAtlas(req.params.areaId, req.params.atlasId)
        .then((data) => res.json(data), () => res.send(null))
  }
}

module.exports = Grid
