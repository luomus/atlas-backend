const Querier = require('../../dao/querier')
const GridDao = require('../../dao/grid_dao')
const AtlasGridSpeciesDataDao = require('../../dao/atlas_grid_species_data_dao')
const querier = Querier()
const atlasGridSpeciesDataDao = new AtlasGridSpeciesDataDao(querier)
const gridDao = new GridDao(querier)
const urlRemover = require('../../helpers/urlRemover')

class Grid {
  /**
   * Returns all area points of the grid.
   * @returns {JSON}
   */
  getAll() {
    return async (req, res) => {
      try {
        const data = await gridDao.getAll()
        return res.json(data)
      } catch (e) {
        return res.status(500).send(e.message)
      }
    }
  }

  // eslint-disable-next-line max-lines-per-function
  getCollection() {
    // eslint-disable-next-line max-lines-per-function
    return async (req, res) => {
      let {speciesId, atlasId = __latestAtlas} = req.query
      if (typeof speciesId !== 'undefined') {
        // Return collection of area resources with species data
        speciesId = speciesId.split('.')[1]
        let data = await atlasGridSpeciesDataDao.getDataForSpeciesAndAtlas(speciesId, atlasId).catch((e) => [])
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
    return async (req, res) => {
      try {
        const id = `http://tun.fi/YKJ.${req.params.gridId}`
        const data = await gridDao.getById(id)
        return res.json(data)
      } catch (e) {
        return res.status(500).send(e.message)
      }
    }
  }


  /**
   * Returns list of species for each breeding category for one area point.
   * @returns {JSON}
   */
  getGridStats() {
    return async (req, res) => {
      const {areaId, atlasId} = req.params
      const birdList = await atlasGridSpeciesDataDao.getListOfDistinctBirdsForGridAndAtlas(areaId, atlasId).catch((e) => [])
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
      try {
      const { areaId } = req.params
      const birdList = await atlasGridSpeciesDataDao.getListOfDistinctBirdsForGridAndActiveAtlas(areaId)

      const results = birdList.data.results.map(result => {
        return {
          speciesId: urlRemover(result.aggregateBy['unit.linkings.taxon.speciesId']),
          atlasCode: urlRemover(result.atlasCodeMax),
          atlasClass: urlRemover(result.atlasClassMax),
        }
      })

      return res.json(results)
      } catch (e) {
        return res.status(500).send(e.message)
      }
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
