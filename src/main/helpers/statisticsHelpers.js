const lodash = require('lodash')

const cacheKeyBaseSumSouth = 'sum_stats_south'
const cacheKeyBaseSumAll = 'sum_stats_all'
const cacheKeyBaseAll = 'all_stats'
const cacheKeyBaseSouth = 'lappi_south_stats'
const cacheKey50km = 'lappi_50km_stats'
const langs = ['fi', 'en', 'sv']

const fulfilledCategories = [
  'MY.atlasActivityCategoryEnum5',
  'MY.atlasActivityCategoryEnum4',
  'MY.atlasActivityCategoryEnum3'
]
const sumSouthTranslations = {
  'fi': 'Suomi PL. Pohjois-Lappi',
  'en': 'Finland excluding northern Lapland',
  'sv': 'Finland utom norra Lappland'
}

const lappiSouthTranslations = {
  'fi': 'eteläinen',
  'en': 'southern',
  'sv': 'södra'
}
const lappiExceptionSquares = {
  '750:334': '750:335-754:339',
  '755:360': '755:355-759:359',
  '740:360': '740:355-744:359',
  '775:355': '775:350-779:354'
}

async function getCachedAllAssociationStatistics(language, gridDao, apiDao, cache) {
  const allStats = (await getCachedStatistics(cacheKeyBaseAll, gridDao, apiDao, cache))[language]
  const sumStatsSouth = (await getCachedStatistics(cacheKeyBaseSumSouth, gridDao, apiDao, cache))[language]
  const lappiSouthStats = (await getCachedStatistics(cacheKeyBaseSouth, gridDao, apiDao, cache))[language]

  
  const toReturn  = [ sumStatsSouth ].concat(allStats.map(stats => {
    if(stats.birdAssociationArea.key === 'ML.1112') {
      return lappiSouthStats
    }

    return stats
  }))

  return toReturn
}

async function getCachedLaplandStatistics(language, gridDao, apiDao, cache) {
  const lappiStats = (await getCachedStatistics(cacheKey50km, gridDao, apiDao, cache))[language]

  return lappiStats
}

async function getCachedAssociationStatistics(associationId, language, gridDao, apiDao, cache) {
  const allStats = (await getCachedStatistics(cacheKeyBaseAll, gridDao, apiDao, cache))[language]

  return allStats.find(stats => stats.birdAssociationArea.key === associationId)
}

async function getCachedFinlandStatistics(language, gridDao, apiDao,cache) {
  return (await getCachedStatistics(cacheKeyBaseSumAll, gridDao, apiDao, cache))[language]
}

async function getCachedStatistics(cacheKey, gridDao, apiDao, cache) {
  let stats = cache.getCache(cacheKey)

  if (!stats) {
    await updateCachedStatistics(gridDao, apiDao, cache)
    stats = cache.getCache(cacheKey)
  }

  return stats
}

async function updateCachedStatistics(gridDao, apiDao, cache) {
  const stats = await getStatistics(gridDao, apiDao)

  cache.setCache(cacheKeyBaseSumSouth, stats.sumStatsSouth, 24 * 3600)
  cache.setCache(cacheKeyBaseSumAll, stats.sumStatsAll, 24 * 3600)
  cache.setCache(cacheKeyBaseAll, stats.allStats, 24 * 3600)
  cache.setCache(cacheKeyBaseSouth, stats.lappiSouthStats, 24 * 3600)
  cache.setCache(cacheKey50km, stats.lappi50kmStats, 24 * 3600)
}

async function getStatistics(gridDao, apiDao) {
  const data = await gridDao.getAllAndAtlasGridForAtlas(__latestAtlas)
  const birdAssociationAreas = await apiDao.getBirdAssociationAreasAsLookup()
  const activityCategory = await apiDao.getEnumRange('MY.atlasActivityCategoryEnum')

  if (!data) {
    throw { code: 404, message: 'species data for grids not found for current atlas'}
  }

  const statsBlock = {
    targetPercentage: 0.0,
    targetSquares: 0,
    totalSquares: 0,
    activityCategories: {
      'MY.atlasActivityCategoryEnum0': {
        name: 'MY.atlasActivityCategoryEnum0',
        squareSum: 0,
        squarePercentage: 0.0 
      },
      'MY.atlasActivityCategoryEnum1': {
        name: 'MY.atlasActivityCategoryEnum1',
        squareSum: 0,
        squarePercentage: 0.0 
      },
      'MY.atlasActivityCategoryEnum2':{
        name: 'MY.atlasActivityCategoryEnum2',
        squareSum: 0,
        squarePercentage: 0.0 
      },
      'MY.atlasActivityCategoryEnum3':{
        name: 'MY.atlasActivityCategoryEnum3',
        squareSum: 0,
        squarePercentage: 0.0 
      },
      'MY.atlasActivityCategoryEnum4':{
        name: 'MY.atlasActivityCategoryEnum4',
        squareSum: 0,
        squarePercentage: 0.0 
      },
      'MY.atlasActivityCategoryEnum5':{
        name: 'MY.atlasActivityCategoryEnum5',
        squareSum: 0,
        squarePercentage: 0.0 
      },
  }}


  const sumStatsSouth = lodash.cloneDeep(statsBlock)
  const sumStatsAll = lodash.cloneDeep(statsBlock)
  const allStats = {}
  const lappiSouthStats = lodash.cloneDeep(statsBlock)
  let lappiTarget = {}
  const toReturn = {
    lappiSouthStats: {},
    sumStatsAll: {},
    sumStatsSouth: {},
    allStats: [],
    lappi50kmStats: []
  }

  Object.keys(birdAssociationAreas).forEach((area) => {
    allStats[area] = lodash.cloneDeep(statsBlock)
  })

  data.forEach(grid => {
    const birdAssociationArea = grid.birdAssociationArea
    const activityCategory = grid.activityCategory !== null ? grid.activityCategory : 'MY.atlasActivityCategoryEnum0'

    allStats[birdAssociationArea].activityCategories[activityCategory].squareSum += 1
    allStats[birdAssociationArea].totalSquares += 1

    sumStatsAll.totalSquares += 1
    sumStatsAll.activityCategories[activityCategory].squareSum += 1

    if (birdAssociationArea !== 'ML.1112') {
      sumStatsSouth.totalSquares += 1
      sumStatsSouth.activityCategories[activityCategory].squareSum += 1
    } else {
      let northing = Number.parseInt(grid.coordinates.slice(0,3))
      northing = northing - northing % 5
      let easting = Number.parseInt(grid.coordinates.slice(4,7))
      easting = easting - easting % 5

      if (northing < 740) {
        sumStatsSouth.totalSquares += 1
        sumStatsSouth.activityCategories[activityCategory].squareSum += 1

        lappiSouthStats.activityCategories[activityCategory].squareSum += 1
        lappiSouthStats.totalSquares += 1

        return
      }
      
      let grid50km

      if (lappiExceptionSquares[grid.coordinates]) {
        grid50km = lappiExceptionSquares[grid.coordinates]
      } else {
        grid50km = `${northing}:${easting}-${northing + 4}:${easting + 4}`
      }


      if (!lappiTarget[grid50km]) {
        lappiTarget[grid50km] = {
          targetMet: false,
          targetPercentage: 0.0,
          targetSquares: 0,
          totalSquares: 0,
          grid: grid50km,
          latMin: northing,
          lonMin: easting,
          latMax: northing + 4,
          lonMax: easting + 4,
          grids: []
        }
      }

      if (fulfilledCategories.includes(grid.activityCategory)) {
        lappiTarget[grid50km].targetSquares += 1
      }

      lappiTarget[grid50km].totalSquares += 1
      lappiTarget[grid50km].grids.push({
        id: grid.id,
        name: grid.name,
        coordinates: grid.coordinates,
        atlasClassSum: grid.atlasClassSum !== null ? grid.atlasClassSum : 0,
        activityCategory: grid.activityCategory !== null ?
          {
            key: grid.activityCategory,
            value: grid.activityCategory + '_toReplace'
          } :
          {
            key: 'MY.atlasActivityCategoryEnum0',
            value: 'MY.atlasActivityCategoryEnum0_toReplace'
          },
      })
    }
  })

  Object.values(lappiTarget).forEach(grid => {
    const targetPercentage = grid.totalSquares ? grid.targetSquares / grid.totalSquares : 0.0

    grid.targetPercentage = targetPercentage * 100

    if ( targetPercentage > 0.75) grid.targetMet = true
  })

  let fulfilled = 0
  Object.keys(sumStatsSouth.activityCategories).forEach(category => { 
    const activityCategory = sumStatsSouth.activityCategories[category]
    activityCategory.squarePercentage = sumStatsSouth.totalSquares === 0 ? 0.0 : activityCategory.squareSum / sumStatsSouth.totalSquares * 100

    if (fulfilledCategories.includes(category)) {
      fulfilled += activityCategory.squareSum
    }
  })
  sumStatsSouth.targetSquares = fulfilled
  sumStatsSouth.targetPercentage = sumStatsSouth.totalSquares === 0 ? 0.0 : fulfilled / sumStatsSouth.totalSquares * 100

  fulfilled = 0
  Object.keys(sumStatsAll.activityCategories).forEach(category => { 
    const activityCategory = sumStatsAll.activityCategories[category]
    activityCategory.squarePercentage = sumStatsAll.totalSquares === 0 ? 0.0 : activityCategory.squareSum / sumStatsAll.totalSquares * 100

    if (fulfilledCategories.includes(category)) {
      fulfilled += activityCategory.squareSum
    }
  })
  sumStatsAll.targetSquares = fulfilled
  sumStatsAll.targetPercentage = sumStatsAll.totalSquares === 0 ? 0.0 : fulfilled / sumStatsAll.totalSquares * 100
  
  fulfilled = 0
  Object.keys(lappiSouthStats.activityCategories).forEach(category => {
    const activityCategory = lappiSouthStats.activityCategories[category]
    activityCategory.squarePercentage = lappiSouthStats.totalSquares === 0 ? 0.0 : activityCategory.squareSum / lappiSouthStats.totalSquares * 100
  
    if (fulfilledCategories.includes(category)) {
      fulfilled += activityCategory.squareSum
    }
  })
  lappiSouthStats.targetSquares = fulfilled
  lappiSouthStats.targetPercentage = lappiSouthStats.totalSquares === 0 ? 0.0 : fulfilled / lappiSouthStats.totalSquares * 100

  Object.keys(allStats).forEach(area => {
    let fulfilled = 0
    Object.keys(allStats[area].activityCategories).forEach(category =>{ 
      const activityCategory = allStats[area].activityCategories[category]
      activityCategory.squarePercentage = allStats[area].totalSquares === 0 ? 0.0 : activityCategory.squareSum / allStats[area].totalSquares * 100
  
      if (fulfilledCategories.includes(category)) {
        fulfilled += activityCategory.squareSum
      }
    })

    allStats[area].targetSquares = fulfilled
    allStats[area].targetPercentage = allStats[area].totalSquares === 0 ? 0.0 : fulfilled / allStats[area].totalSquares * 100

    allStats[area].birdAssociationArea = {
      key: area,
      value: birdAssociationAreas[area]
    }
  })

  lappiTarget = Object.values(lappiTarget).sort((a,b) => {
    if (a.grid < b.grid) {
      return -1
    } else if (a.grid > b.grid) {
      return 1
    } else {
      return 0
    }
  })
  
  langs.forEach(lang => {
    const categories = Object.keys(activityCategory)

    toReturn['lappiSouthStats'][lang] = lodash.cloneDeepWith(lappiSouthStats, (value) => {
      if (categories.includes(value)) {
        return activityCategory[value][lang]
      }
    })

    toReturn['lappiSouthStats'][lang].birdAssociationArea = {
      key: 'ML.1112',
      value: birdAssociationAreas['ML.1112'] + ` (${lappiSouthTranslations[lang]})`
    }

    toReturn['sumStatsSouth'][lang] = lodash.cloneDeepWith(sumStatsSouth, (value) => {
      if (categories.includes(value)) {
        return activityCategory[value][lang]
      }
    })

    toReturn['sumStatsAll'][lang] = lodash.cloneDeepWith(sumStatsAll, (value) => {
      if (categories.includes(value)) {
        return activityCategory[value][lang]
      }
    })

    toReturn['sumStatsSouth'][lang].birdAssociationArea = {
      key: undefined,
      value: sumSouthTranslations[lang]
    }

    toReturn['allStats'][lang] = Object.values(lodash.cloneDeepWith(allStats, (value) => {
      if (categories.includes(value)) {
        return activityCategory[value][lang]
      }
    }))


    toReturn['lappi50kmStats'][lang] = lodash.cloneDeepWith(lappiTarget, (value) => {
      if (typeof value === 'string' && value.includes('_toReplace')) {
        return activityCategory[value.replace('_toReplace', '')][lang]
      }
    })
  })
  
  return toReturn
}

module.exports = { getCachedAllAssociationStatistics, getCachedLaplandStatistics, getCachedAssociationStatistics, getCachedFinlandStatistics, updateCachedStatistics }
