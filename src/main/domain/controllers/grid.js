const Querier = require('../../dao/querier')
const GridDao = require('../../dao/grid_dao')
const AtlasGridSpeciesDataDao = require('../../dao/atlas_grid_species_data_dao')
const querier = Querier()
const atlasGridSpeciesDataDao = new AtlasGridSpeciesDataDao(querier)
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
        let data = await atlasGridSPeciesDataDao.getDataForSpeciesAndAtlas(speciesId, atlasId).catch((e) => [])
        data = data.map((area) => ({
          id: area.grid.toString(),
          coordinateN: parseInt(area.grid.toString().substring(0, 3)),
          coordinateE: parseInt(area.grid.toString().substring(3, 6)),
          atlasClass: parseInt(area.atlasClass),
          atlasCode: parseInt(area.atlasCode),
        }))
        return res.json({
          species: {id: 'MX.' + speciesId.toString()},
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
        if (s.atlasClass === 0) return
        const cat = categories.find((c) => c.atlasClass === s.atlasClass)
        cat.sum += 1
        cat.speciesList.push({speciesId: s.species, speciesFi: s.speciesFi})
      })
      return res.json(categories)
    }
  }

  /**
   * 
   * @returns {JSON}
   */
  getGridStatsActive() {
    return async (req, res) => {
      const { areaId } = req.params
      const birdList = await gridDao.getGridForActiveAtlas(areaId)

      console.log(birdList)

      return res.json(birdList.data)
    }
  }
  /**
   * Returns all atlas data for one area point.
   * @returns {JSON}
   */
  getGridData() {
    return (req, res) => atlasGridSPeciesDataDao.getDataForGridAndAtlas(req.params.areaId, req.params.atlasId)
        .then((data) => res.json(data), () => res.send(null))
  }
}

module.exports = Grid
