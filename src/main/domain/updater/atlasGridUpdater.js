const Querier = require('../../dao/querier')
const GridDao = require('../../dao/gridDao')
const AtlasGridDao = require('../../dao/atlasGridDao')
const axios = require('axios')
const Cache = require('../../dao/cache')
const ApiDao = require('../../dao/apiDao')
const { getAtlasClassSum, getActivityCategory, clearLesserTaxa } = require('../../helpers/activityCategryHelpers')
const urlRemover = require('../../helpers/urlRemover')

class AtlasGridUpdater {
  constructor () {
    this.querier = new Querier()
    this.gridDao = new GridDao(this.querier)
    this.atlasGridDao = new AtlasGridDao(this.querier)
    this.apiDao = new ApiDao(axios, new Cache())
  }

  async update () {
    console.log(new Date().toISOString(), ' ', 'Started atlas grid update')
    try {
      const grids = await this.gridDao.getAllAndAtlasGridForAtlas(4)
      const atlasGrids = await this.atlasGridDao.getAllForAtlasId(4)
  
      let speciesData = await this.apiDao.getListOfDistinctBirdsForActiveAtlasPaginated()
      let results = speciesData.results
      for (let i = 2; i <= speciesData.lastPage; i++) {
        results.push(...(await this.apiDao.getListOfDistinctBirdsForActiveAtlasPaginated(i)).results)
      }
      const gridClassSumLookup = {}

      for (const grid of grids) {
        let gridSpeciesData = results.filter(data => {
          return grid.coordinates === `${data.aggregateBy['gathering.conversions.ykj10kmCenter.lat'].slice(0,3)}:${data.aggregateBy['gathering.conversions.ykj10kmCenter.lon'].slice(0,3)}`
        })


        if (!gridSpeciesData.length) {
          continue
        }

        gridSpeciesData = clearLesserTaxa(gridSpeciesData)

        for ( const data of gridSpeciesData) {
          const taxon = await this.apiDao.getSpecies(urlRemover(data.taxonId))

          data.taxonomicOrder = taxon.taxonomicOrder
        }

        const atlasClassSum = getAtlasClassSum(gridSpeciesData)

        gridClassSumLookup[grid.id] = gridClassSumLookup[grid.id] === undefined ? atlasClassSum : gridClassSumLookup[grid.id] + atlasClassSum
      }

      const insertionTable = []
      const updateTable = []

      for (const grid of grids) {
        const atlasClassSum = gridClassSumLookup[grid.id]

        if (atlasClassSum === undefined) {
          continue
        }

        const activityCategory = getActivityCategory(atlasClassSum, grid)

        const atlasGrid = atlasGrids?.find(atlasGrid => atlasGrid.grid === grid.id)

        if (!atlasGrid) {
          insertionTable.push({
            atlas: 4,
            grid: grid.id,
            atlasClassSum,
            activityCategory
          })
        } else if (atlasClassSum !== atlasGrid.atlasClassSum) {
          updateTable.push({
            id: atlasGrid.id,
            atlasClassSum,
            activityCategory
          })
        }
      }

      if (insertionTable.length) {
        await this.atlasGridDao.addAtlasGridDataMany(insertionTable)
      }

      if (updateTable.length) {
        await this.atlasGridDao.updateAtlasGridDataMany(updateTable)
      }

      console.log(new Date().toISOString(), ' ', 'Finished atlas grid update')
    } catch (err) {
      console.error(new Date().toISOString(), ' ', 'Altas grid update error: ', err)
      throw err
    }
  }
}

module.exports = AtlasGridUpdater