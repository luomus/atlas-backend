const Querier = require('../../dao/querier')
const querier = Querier()
const GridDao = require('../../dao/gridDao')
const AtlasGridSpeciesDataDao = require('../../dao/atlasGridSpeciesDataDao')
const atlasGridSpeciesDataDao = new AtlasGridSpeciesDataDao(querier)
const gridDao = new GridDao(querier)
const urlRemover = require('../../helpers/urlRemover')
const ApiDao = require('../../dao/apiDao')
const apiDao = new ApiDao()

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

  /**
   * Returns the atlas species data for specific species and atlas
   * @returns {JSON}
   */
  getCollection() {
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

        if (Array.isArray(data)) {
          return res.json(data[0])
        }

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
   * Returns atlas data and grid data for specified grid square for currently active atlas, species data fetched from laji api 
   * @returns {JSON}
   */
  getGridStatsActive() {
    return async (req, res) => {
      try {
      const { gridId } = req.params
      const birdList = await apiDao.getListOfDistinctBirdsForGridAndActiveAtlas(gridId)
      const grid = (await gridDao.getById(`http://tun.fi/YKJ.${gridId}`))[0]
      const results = []

      const atlasCode = (await apiDao.getEnumRange('MY.atlasCodeEnum')).data
      const atlasClass = (await apiDao.getEnumRange('MY.atlasClassEnum')).data
      
      for ( const result of birdList.data.results) {
        let speciesName

        switch (req.query.language) {
          case 'en':
            speciesName = result.aggregateBy['unit.linkings.taxon.speciesNameEnglish']
            break
          case 'sv':
            speciesName = result.aggregateBy['unit.linkings.taxon.speciesNameSwedish']
            break
          default:
            speciesName = result.aggregateBy['unit.linkings.taxon.speciesNameFinnish']
        }

        const lang = req.query.language || 'fi'
        const atlasCodeKey = urlRemover(result.atlasCodeMax)
        const atlasClassKey = urlRemover(result.atlasClassMax)
        results.push({
          speciesId: urlRemover(result.aggregateBy['unit.linkings.taxon.speciesId']),
          speciesName: speciesName,
          atlasCode: {
            key: atlasCodeKey,
            value: atlasCode[atlasCodeKey][lang]
          },
          atlasClass: {
            key: atlasClassKey, 
            value: atlasClass[atlasClassKey][lang]
          },
        })
      }

      grid.data = results

      return res.json(grid)
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
