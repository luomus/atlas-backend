const moment = require('moment')
const lodash = require('lodash')
const urlRemover = require('../helpers/urlRemover')

const cacheKeyBase = 'completeList_'
const taxonSets = [
  'MX.taxonSetBiomonCompleteListOdonata',
  'MX.taxonSetBirdAtlasCommon'
]

class CompleteListDao {
  gridDao
  apiDao
  cache

  constructor(gridDao, apiDao, cache) {
    this.gridDao = gridDao,
    this.apiDao = apiDao,
    this.cache = cache
  }

  isAcceptedTaxonSet(taxonSet) {
    return taxonSets.includes(taxonSet)
  }

  async update() {       
    const date = new Date().toISOString().split('T')[0]

    for (const set of taxonSets) {
      const stats = await this.getCompleteListData(set, date)
      this.cache.setCache('remove-expired-' + cacheKeyBase + set + date, stats, 24 * 3600)
    }
  }

  async getCompleteLists(taxonSet, grid) {
    let date = new Date().toISOString().split('T')[0]
    let stats = this.cache.getCache(cacheKeyBase + taxonSet + date)
  
    if (!stats) {
      stats = await this.getCompleteListData(taxonSet, date)
      this.cache.setCache('remove-expired-' + cacheKeyBase + taxonSet + date, stats, 24 * 3600)
    }
  
    const gridData = stats.gridData[grid]
    const toReturn = Array(Object.keys(gridData).length)
    
    stats.taxonSet.forEach(taxa => {
      if (gridData[taxa.id] !== undefined) {
        toReturn[gridData[taxa.id]] = taxa
      } else {
        toReturn.push(taxa)
      }
    })
  
    return toReturn
  }

  async getCompleteListData(taxonSet, date) {
    const grids = await this.gridDao.getAll()
  
    const grid100km = []
    const grid100kmData = {}
  
    const dateShort = `${moment(date).subtract(14, 'd').dayOfYear()}/${moment(date).add(14, 'd').dayOfYear()}`
    const dateLong = `${moment(date).subtract(30, 'd').dayOfYear()}/${moment(date).add(30, 'd').dayOfYear()}`
  
  
    grids.forEach(grid => {
      const grid100kmCoords = grid.coordinates.slice(0,2) + ':' + grid.coordinates.slice(4,6)
  
      if (!grid100km.includes(grid100kmCoords)) {
        grid100km.push(grid100kmCoords)
      }
    });
  
    
    const taxonSetBase = await this.apiDao.getTaxonSet(taxonSet)
  
    const taxonSetIndexLookup = {}
    
    taxonSetBase.forEach((val, ind) => {
      taxonSetIndexLookup[val.id] = ind
    })
  
    const shortCounts = await this.apiDao.getCountsOfCompleteLists(dateShort, taxonSet)
    const longCounts = await this.apiDao.getCountsOfCompleteLists(dateLong, taxonSet)
    const longCountsLookup = {}
  
  
    const shortTaxaCounts = await this.apiDao.getObservationCountsByTaxonSet(dateShort, taxonSet)
    const longTaxaCounts = await this.apiDao.getObservationCountsByTaxonSet(dateLong, taxonSet)
    const longTaxaCountsLookup = {}
  
    const wholeFinlandTaxonList = await this.apiDao.getObservationCountsByTaxonSetWholeFinland(dateLong, taxonSet)
    let wholeFinlandTaxa
  
    for (const grid of grid100km) {
      const gridIntCoords = [Number.parseInt(grid.slice(0,2)), Number.parseInt(grid.slice(3,5))]
  
      const shortCount = shortCounts.filter(count => 
        count.aggregateBy['gathering.conversions.ykj100km.lat'] == gridIntCoords[0] &&
        count.aggregateBy['gathering.conversions.ykj100km.lon'] == gridIntCoords[1])
  
      if (shortCount.length > 15) {
        let shortTaxaCount = shortTaxaCounts.filter(counts => 
          counts.aggregateBy['gathering.conversions.ykj100km.lat'] == gridIntCoords[0] &&
          counts.aggregateBy['gathering.conversions.ykj100km.lon'] == gridIntCoords[1])
        
        shortTaxaCount = shortTaxaCount.sort((a, b) => {
          if (b.individualCountSum !== a.individualCountSum) {
            return b.individualCountSum - a.individualCountSum
          }
  
          return taxonSetBase[taxonSetIndexLookup[urlRemover(b.aggregateBy['unit.linkings.taxon.id'])]] 
          - taxonSetBase[taxonSetIndexLookup[urlRemover(a.aggregateBy['unit.linkings.taxon.id'])]]
        })
  
        const toReturn = {}
      
        shortTaxaCount.forEach((count, ind) => {
          toReturn[urlRemover(count.aggregateBy['unit.linkings.taxon.id'])] = ind
        })
  
        grid100kmData[grid] = toReturn
  
      } else {
        const gridTransform = [[1,1],[1,0],[1,-1],[0,1],[0,0],[0,-1],[-1,1],[-1,0],[-1,-1]]
  
        let count = 0
        let grids = []
      
        for (const transform of gridTransform) {
          let grid = `${gridIntCoords[0] + transform[0]}:${gridIntCoords[1] + transform[1]}`
  
          if (longCountsLookup[grid]) {
            count += longCountsLookup[grid]
          } else {
            //check that grid is part of atlas grids
            if (!grid100km.includes(grid)) {
              continue
            }
  
            longTaxaCountsLookup[grid] = longTaxaCounts.filter(count =>
              count.aggregateBy['gathering.conversions.ykj100km.lat'] == gridIntCoords[0] + transform[0] &&
              count.aggregateBy['gathering.conversions.ykj100km.lon'] == gridIntCoords[1] + transform[1])
            
            const longCount = longCounts.filter(count => 
              count.aggregateBy['gathering.conversions.ykj100km.lat'] == gridIntCoords[0] + transform[0] &&
              count.aggregateBy['gathering.conversions.ykj100km.lon'] == gridIntCoords[1] + transform[1])
        
            count += longCount.length
            longCountsLookup[grid] = longCount.length
          }
  
          grids.push(grid)
        }
    
        //get taxon counts for the max 9 squares and calculate
        if (count > 15) {
          const taxaLookup = {}
  
          for (const grid of grids) {
            if (!longCountsLookup[grid]) {
              continue
            }
  
            longTaxaCountsLookup[grid].forEach(taxa => {
              const id = urlRemover(taxa.aggregateBy['unit.linkings.taxon.id'])
              if (taxaLookup[id]) {
                taxaLookup[id].individualCountSum += taxa.individualCountSum
              } else {
                taxaLookup[id] = lodash.cloneDeep(taxa)
              }
            })
          }
  
          const toReturn = {}
  
          Object.values(taxaLookup).sort((a, b) => {
            if (b.individualCountSum !== a.individualCountSum) {
              return b.individualCountSum - a.individualCountSum
            }
    
            return taxonSetBase[taxonSetIndexLookup[urlRemover(b.aggregateBy['unit.linkings.taxon.id'])]] 
            - taxonSetBase[taxonSetIndexLookup[urlRemover(a.aggregateBy['unit.linkings.taxon.id'])]]
          }).forEach((taxa, ind) => {
            toReturn[urlRemover(taxa.aggregateBy['unit.linkings.taxon.id'])] = ind
          })
  
          grid100kmData[grid] = toReturn
    
        //use whole finland 
        } else {
          if (!wholeFinlandTaxa) {
            wholeFinlandTaxa = {}
            
            wholeFinlandTaxonList.sort((a, b) => {
              if (b.individualCountSum !== a.individualCountSum) {
                return b.individualCountSum - a.individualCountSum
              }
      
              return taxonSetBase[taxonSetIndexLookup[urlRemover(b.aggregateBy['unit.linkings.taxon.id'])]] 
              - taxonSetBase[taxonSetIndexLookup[urlRemover(a.aggregateBy['unit.linkings.taxon.id'])]]
            }).forEach((taxa, ind) => {
              wholeFinlandTaxa[urlRemover(taxa.aggregateBy['unit.linkings.taxon.id'])] = ind
            })
          }
          
          grid100kmData[grid] = wholeFinlandTaxa
        }
      }
    }
  
    return {
      taxonSet: taxonSetBase,
      gridData: grid100kmData
    }
  }
}




module.exports = CompleteListDao