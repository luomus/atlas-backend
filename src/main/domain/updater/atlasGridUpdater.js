const Querier = require('../../dao/querier')
const GridDao = require('../../dao/gridDao')
const AtlasGridDao = require('../../dao/atlasGridDao')
const axios = require('axios')
const Cache = require('../../dao/cache')
const ApiDao = require('../../dao/apiDao')

class AtlasGridUpdater {
  constructor () {
    this.querier = new Querier()
    this.gridDao = new GridDao(this.querier)
    this.atlasGridDao = new AtlasGridDao(this.querier)
    this.apiDao = new ApiDao(axios, new Cache())
  }

  async update () {
    const grids = await this.gridDao.getAllAndAtlasGridForAtlas(4)
    const atlasGrids = await this.atlasGridDao.getAllForAtlasId(4)
 
    let speciesData = await this.apiDao.getListOfDistinctBirdsForActiveAtlasPaginated()
    const gridClassSumLookup = {}

    for (let i = 1; i <= speciesData.lastPage; i++) {
      if (i !== 1) {
        speciesData = await this.apiDao.getListOfDistinctBirdsForActiveAtlasPaginated(i)
      }

      for (const grid of grids) {
        const gridSpeciesData = speciesData.results.filter(data => {
          return grid.coordinates === `${data.aggregateBy['gathering.conversions.ykj10kmCenter.lat'].slice(0,3)}:${data.aggregateBy['gathering.conversions.ykj10kmCenter.lon'].slice(0,3)}`
        })

        if (!gridSpeciesData.length) {
          continue
        }

        const atlasClassSum = gridSpeciesData.reduce((prev, curr) => {
          switch (curr.atlasClassMax) {
            case 'http://tun.fi/MY.atlasClassEnumB':
              return prev + 1
            case 'http://tun.fi/MY.atlasClassEnumC':
              return prev + 2
            case 'http://tun.fi/MY.atlasClassEnumD':
              return prev + 3
            default:
              return prev 
          } 
        }, 0)

        gridClassSumLookup[grid.id] = gridClassSumLookup[grid.id] === undefined ? atlasClassSum : gridClassSumLookup[grid.id] + atlasClassSum
      }
    }

    const insertionTable = []
    const updateTable = []

    for (const grid of grids) {
      const atlasClassSum = gridClassSumLookup[grid.id]

      if (atlasClassSum === undefined) {
        continue
      }

      let activityCategory = 'MY.atlasActivityCategoryEnum0'
      if (atlasClassSum >= grid.level5) {
        activityCategory = 'MY.atlasActivityCategoryEnum5'
      } else if (atlasClassSum >= grid.level4) {
        activityCategory = 'MY.atlasActivityCategoryEnum4'
      } else if (atlasClassSum >= grid.level3) {
        activityCategory = 'MY.atlasActivityCategoryEnum3'
      } else if (atlasClassSum >= grid.level2) {
        activityCategory = 'MY.atlasActivityCategoryEnum2'
      } else if (atlasClassSum >= grid.level1) {
        activityCategory = 'MY.atlasActivityCategoryEnum1'
      }

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
      this.atlasGridDao.addAtlasGridDataMany(insertionTable)
    }

    if (updateTable.length) {
      this.atlasGridDao.updateAtlasGridDataMany(updateTable)
    }
  }
}

module.exports = AtlasGridUpdater