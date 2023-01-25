const lodash = require('lodash')

const cacheKeyBaseAssociation = 'association_stats_'
const cacheKeyBaseAll = 'all_stats_'

const fulfilledCategories = [
  'MY.atlasActivityCategoryEnum5',
  'MY.atlasActivityCategoryEnum4',
  'MY.atlasActivityCategoryEnum3'
]
const totalTranslations = {
  'fi': 'Suomi PL. Lapin lintutieteelinen yhdistys',
  'en': 'Finland excluding Lapin Lintutieteelinen yhdistys',
  'sv': 'Finland utom Lapin Lintutieteeline yhdistys'
}
const lappiExceptionSquares = {
  '750:334': '750:335',
  '755:360': '755:355',
  '740:360': '740:355',
  '775:355': '775:350'
}

async function getCachedAssociationStatistics(language, gridDao, apiDao, cache) {
  return await getCachedStatistics(cacheKeyBaseAssociation + language, gridDao, apiDao, cache)
}

async function getCachedFinlandStatistics(language, gridDao, apiDao,cache) {
  return await getCachedStatistics(cacheKeyBaseAll + language, gridDao, apiDao, cache)
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
  const langs = ['fi', 'en', 'sv']

  for (const lang of langs) {
    const stats = await getStatistics(lang, gridDao, apiDao)

    cache.setCache(cacheKeyBaseAssociation + lang, stats.associationStats, 24 * 3600)
    cache.setCache(cacheKeyBaseAll + lang, stats.fullStats, 24 * 3600)
  }
}

async function getStatistics(lang, gridDao, apiDao) {
  const data = await gridDao.getAllAndAtlasGridForAtlas(__latestAtlas)
  const birdAssociationAreas = await apiDao.getBirdAssociationAreasAsLookup()
  const activityCategory = await apiDao.getEnumRange('MY.atlasActivityCategoryEnum')

  if (!data) {
    throw { code: 404, message: 'species data for grids not found for current atlas'}
  }

  const statsBlock = {
    targetPercentage: 0.0,
    totalSquares: 0,
    activityCategories: {
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
  }}


  const fullStats = lodash.cloneDeep(statsBlock)
  const associationStats = {}
  const lappiTarget = {}
  const totalSquares = {
    totals: 0
  };

  associationStats['totals'] = lodash.cloneDeep(statsBlock)

  Object.keys(birdAssociationAreas).forEach((area) => {
    totalSquares[area] = 0
    associationStats[area] = lodash.cloneDeep(statsBlock)
  })

  data.forEach(grid => {
    const birdAssociationArea = grid.birdAssociationArea
    const activityCategory = grid.activityCategory !== null ? grid.activityCategory : 'MY.atlasActivityCategoryEnum0'

    fullStats.totalSquares += 1
    fullStats.activityCategories[activityCategory].squareSum += 1

    associationStats[birdAssociationArea].activityCategories[activityCategory].squareSum += 1
    totalSquares[birdAssociationArea] += 1

    if (birdAssociationArea !== 'ML.1112') {
      associationStats.totals.activityCategories[activityCategory].squareSum += 1
      totalSquares.totals += 1
    } else {
      let grid50km

      if (lappiExceptionSquares[grid.coordinates]) {
        grid50km = lappiExceptionSquares[grid.coordinates]
      } else {
        const northing = Number.parseInt(grid.coordinates.slice(0,3))
        const easting = Number.parseInt(grid.coordinates.slice(4,7))
        grid50km = `${northing - northing % 5}:${easting - easting % 5}`
      }


      if (!lappiTarget[grid50km]) {
        lappiTarget[grid50km] = { fulfilledSquares: 0, totalSquares: 0 }
      }

      if (fulfilledCategories.includes(grid.activityCategory)) {
        lappiTarget[grid50km].fulfilledSquares += 1
      }

      lappiTarget[grid50km].totalSquares += 1
    }
  })

  Object.keys(fullStats.activityCategories).forEach(category =>{ 
    const activityCategory = fullStats.activityCategories[category]
    activityCategory.squarePercentage = fullStats.totalSquares === 0 ? 0.0 : activityCategory.squareSum / fullStats.totalSquares * 100
  })

  Object.keys(associationStats).forEach(area => {
    let fulfilled = 0

    if (area === 'ML.1112') {
      Object.keys(lappiTarget).forEach(grid50km => {
        const fulfilledSquares = lappiTarget[grid50km].fulfilledSquares
        const totalSquares = lappiTarget[grid50km].totalSquares

        if (fulfilledSquares / totalSquares >= 0.75) {
          fulfilled += 1
        }
      })

      Object.keys(associationStats[area].activityCategories).forEach(category =>{ 
        const activityCategory = associationStats[area].activityCategories[category]
        activityCategory.squarePercentage = totalSquares[area] === 0 ? 0.0 : activityCategory.squareSum / totalSquares[area] * 100
      })

      associationStats[area].targetPercentage = totalSquares[area] === 0 ? 0.0 : fulfilled / Object.keys(lappiTarget).length * 100
    } else {
      Object.keys(associationStats[area].activityCategories).forEach(category =>{ 
        const activityCategory = associationStats[area].activityCategories[category]
        activityCategory.squarePercentage = totalSquares[area] === 0 ? 0.0 : activityCategory.squareSum / totalSquares[area] * 100
    
        if (fulfilledCategories.includes(category)) {
          fulfilled += activityCategory.squareSum
        }
      })
  
      associationStats[area].targetPercentage = totalSquares[area] === 0 ? 0.0 : fulfilled / totalSquares[area] * 100
    }

    associationStats[area].birdAssociationArea = area === 'totals' ? {
      key: 'ML.totals',
      value: totalTranslations[lang]
    } : {
      key: area,
      value: birdAssociationAreas[area]
    }

    associationStats[area].totalSquares = totalSquares[area]
  })

  return {
    associationStats: Object.values(associationStats),
    fullStats: fullStats
  }
}

module.exports = { getCachedAssociationStatistics, getCachedFinlandStatistics, updateCachedStatistics }
