const Querier = require('../../dao/querier')
const querier = new Querier()
const GridDao = require('../../dao/gridDao')
const gridDao = new GridDao(querier)
const AtlasGridDao = require('../../dao/atlasGridDao')
const atlasGridDao = new AtlasGridDao(querier)
const AtlasGridSpeciesDataDao = require('../../dao/atlasGridSpeciesDataDao')
const atlasGridSpeciesDataDao = new AtlasGridSpeciesDataDao(querier)
const urlRemover = require('../../helpers/urlRemover')
const axios = require('axios')
const Cache = require('../../dao/cache')
const ApiDao = require('../../dao/apiDao')
const apiDao = new ApiDao(axios, new Cache())

class Grid {
  /**
   * Returns all area points of the grid.
   * @returns {JSON}
   */
  getAll() {
    return async (req, res) => {
      try {
        const lang = req.query.language || 'fi'
        const data = await gridDao.getAllAndAtlasGridForAtlas(__latestAtlas)
        const birdAssociationAreas = await apiDao.getBirdAssociationAreasAsLookup()
        const activityCategory = await apiDao.getEnumRange('MY.atlasActivityCategoryEnum')
        const gridSpeciesCounts = await apiDao.getSpeciesCountForGrids()
        
        const toReturn = data.map(grid => {
          return {
            ...grid,
            atlas: grid.atlas !== null ? grid.atlas : __latestAtlas,
            atlasClassSum: grid.atlasClassSum !== null ? grid.atlasClassSum : 0,
            speciesCount: gridSpeciesCounts[grid.id] ? gridSpeciesCounts[grid.id] : 0,
            activityCategory: grid.activityCategory !== null ?
              {
                key: grid.activityCategory,
                value: activityCategory[grid.activityCategory][lang]
              } :
              {
                key: 'MY.atlasActivityCategoryEnum0',
                value: activityCategory['MY.atlasActivityCategoryEnum0'][lang]
              },
            birdAssociationArea: {
              key: grid.birdAssociationArea,
              value: birdAssociationAreas[grid.birdAssociationArea]
            },
          }
        })     
   
        return res.json(toReturn)
      } catch (e) {
        console.error(new Date().toString() + ' ' + e.message)
        return res.status(500).send(e.message)
      }
    }
  }

  getAllForBirdAssociation() {
    return async (req, res) => {
      try {
        const lang = req.query.language || 'fi'
        const data = await gridDao.getAllAndAtlasGridForAtlasAndAssociation(req.params.birdAssociationId, __latestAtlas)
        const birdAssociationAreas = await apiDao.getBirdAssociationAreasAsLookup()
        const activityCategory = await apiDao.getEnumRange('MY.atlasActivityCategoryEnum')
        const gridSpeciesCounts = await apiDao.getSpeciesCountForGrids()

        if (!data) {
          return res.status(404).send()
        }

        const birdAssociationArea = {
          key: req.params.birdAssociationId,
          value: birdAssociationAreas[req.params.birdAssociationId]
        }

        const activityCategories = {
          'MY.atlasActivityCategoryEnum0': {
            name: activityCategory['MY.atlasActivityCategoryEnum0'][lang],
            squareSum: 0,
            squarePercentage: 0.0 
          },
          'MY.atlasActivityCategoryEnum1': {
            name: activityCategory['MY.atlasActivityCategoryEnum1'][lang],
            squareSum: 0,
            squarePercentage: 0.0 
          },
          'MY.atlasActivityCategoryEnum2':{
            name: activityCategory['MY.atlasActivityCategoryEnum2'][lang],
            squareSum: 0,
            squarePercentage: 0.0 
          },
          'MY.atlasActivityCategoryEnum3':{
            name: activityCategory['MY.atlasActivityCategoryEnum3'][lang],
            squareSum: 0,
            squarePercentage: 0.0 
          },
          'MY.atlasActivityCategoryEnum4':{
            name: activityCategory['MY.atlasActivityCategoryEnum4'][lang],
            squareSum: 0,
            squarePercentage: 0.0 
          },
          'MY.atlasActivityCategoryEnum5':{
            name: activityCategory['MY.atlasActivityCategoryEnum5'][lang],
            squareSum: 0,
            squarePercentage: 0.0 
          },
        }

        const gridSqures = data.map(grid => {
          activityCategories[grid.activityCategory !== null ? grid.activityCategory : 'MY.atlasActivityCategoryEnum0'].squareSum += 1

          return {
            ...grid,
            atlas: grid.atlas !== null ? grid.atlas : __latestAtlas,
            atlasClassSum: grid.atlasClassSum !== null ? grid.atlasClassSum : 0,
            speciesCount: gridSpeciesCounts[grid.id] ? gridSpeciesCounts[grid.id] : 0,
            activityCategory: grid.activityCategory !== null ?
              {
                key: grid.activityCategory,
                value: activityCategory[grid.activityCategory][lang]
              } :
              {
                key: 'MY.atlasActivityCategoryEnum0',
                value: activityCategory['MY.atlasActivityCategoryEnum0'][lang]
              },
            birdAssociationArea
          }
        })

        const total = gridSqures.length

        Object.keys(activityCategories).forEach(category => {
          activityCategories[category].squarePercentage = total === 0 ? 0.0 : activityCategories[category].squareSum / total * 100
        })
   
        return res.json({
          birdAssociationArea,
          activityCategories,
          gridSqures
        })
      } catch (e) {
        console.error(new Date().toString() + ' ' + e.message)
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
        const lang = req.query.language || 'fi'
        const id = `http://tun.fi/YKJ.${req.params.gridId}`
        const data = await gridDao.getByIdAndAtlasGridForAtlas(id, __latestAtlas)
        const birdAssociationAreas = await apiDao.getBirdAssociationAreasAsLookup()
        const activityCategory = await apiDao.getEnumRange('MY.atlasActivityCategoryEnum')
        const gridSpeciesCounts = await apiDao.getSpeciesCountForGrids()

        if (!data) {
          return res.status(404).send()
        }

        const toReturn = data.map(grid => {
          return {
            ...grid,
            atlas: grid.atlas !== null ? grid.atlas : __latestAtlas,
            atlasClassSum: grid.atlasClassSum !== null ? grid.atlasClassSum : 0,
            speciesCount: gridSpeciesCounts[grid.id] ? gridSpeciesCounts[grid.id] : 0,
            activityCategory: grid.activityCategory !== null ?
              {
                key: grid.activityCategory,
                value: activityCategory[grid.activityCategory][lang]
              } :
              {
                key: 'MY.atlasActivityCategoryEnum0',
                value: activityCategory['MY.atlasActivityCategoryEnum0'][lang]
              },
            birdAssociationArea: {
              key: grid.birdAssociationArea,
              value: birdAssociationAreas[grid.birdAssociationArea]
            }
          }
        })
        return res.json(toReturn[0])
      } catch (e) {
        console.error(new Date().toString() + ' ' + e.message)
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
        const lang = req.query.language || 'fi'
        const { gridId } = req.params
        const grid = (await gridDao.getByIdAndAtlasGridForAtlas(`http://tun.fi/YKJ.${gridId}`, __latestAtlas))?.[0]
        const birdAssociationAreas = await apiDao.getBirdAssociationAreasAsLookup()

        if (!grid) {
          return res.status(404).send()
        }

        const birdList = await apiDao.getListOfDistinctBirdsForGridAndActiveAtlas(gridId)
        const results = []

        const atlasCode = await apiDao.getEnumRange('MY.atlasCodeEnum')
        const atlasClass = await apiDao.getEnumRange('MY.atlasClassEnum')
        const activityCategory = await apiDao.getEnumRange('MY.atlasActivityCategoryEnum')
        const gridSpeciesCounts = await apiDao.getSpeciesCountForGrids()

        for ( const result of birdList ) {
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
            }
          })
        }
        grid.atlas = grid.atlas !== null ? grid.atlas : __latestAtlas,
        grid.atlasClassSum = grid.atlasClassSum !== null ? grid.atlasClassSum : 0,
        grid.speciesCount = gridSpeciesCounts[grid.id] ? gridSpeciesCounts[grid.id] : 0,
        grid.activityCategory = grid.activityCategory !== null ?
        {
          key: grid.activityCategory,
          value: activityCategory[grid.activityCategory][lang]
        } :
        {
          key: 'MY.atlasActivityCategoryEnum0',
          value: activityCategory['MY.atlasActivityCategoryEnum0'][lang]
        },
        grid.birdAssociationArea = {
          key: grid.birdAssociationArea,
          value: birdAssociationAreas[grid.birdAssociationArea]
        }
        grid.data = results

        return res.json(grid)
      } catch (e) {
        console.error(new Date().toString() + ' ' + e.message)
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
