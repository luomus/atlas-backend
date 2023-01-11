const cacheKeyBase = 'association_stats_'
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

async function getCachedAssociationStatistics(language, gridDao, apiDao, cache) {
  let stats = cache.getCache(cacheKeyBase + language)

  if (!stats) {
    stats = await getAssociationStatistics(language, gridDao, apiDao)
    cache.setCache(cacheKeyBase + language, stats, 24 * 3600)
  }

  return stats
}

async function updateCachedAssociationStatistics(gridDao, apiDao, cache) {
  const langs = ['fi', 'en', 'sv']

  for (const lang of langs) {
    const stats = await getAssociationStatistics(lang, gridDao, apiDao)

    cache.setCache(cacheKeyBase + lang, stats, 24 * 3600)
  }
}

async function getAssociationStatistics(lang, gridDao, apiDao) {
  const data = await gridDao.getAllAndAtlasGridForAtlas(__latestAtlas)
  const birdAssociationAreas = await apiDao.getBirdAssociationAreasAsLookup()
  const activityCategory = await apiDao.getEnumRange('MY.atlasActivityCategoryEnum')

  if (!data) {
    throw { code: 404, message: 'species data for grids not found for current atlas'}
  }


  const stats = {}
  const lappiTarget = {}
  const totalSquares = {
    totals: 0
  };

  stats['totals'] = {
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

  Object.keys(birdAssociationAreas).forEach((area) => {
    totalSquares[area] = 0
    stats[area] = {
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
  })

  data.forEach(grid => {
    const birdAssociationArea = grid.birdAssociationArea
    stats[birdAssociationArea].activityCategories[grid.activityCategory !== null ? grid.activityCategory : 'MY.atlasActivityCategoryEnum0'].squareSum += 1
    totalSquares[birdAssociationArea] += 1

    if (birdAssociationArea !== 'ML.1112') {
      stats.totals.activityCategories[grid.activityCategory !== null ? grid.activityCategory : 'MY.atlasActivityCategoryEnum0'].squareSum += 1
      totalSquares.totals += 1
    } else {
      const grid100km = grid.coordinates.slice(0,2) + ':' + grid.coordinates.slice(4,6)

      if (!lappiTarget[grid100km]) {
        lappiTarget[grid100km] = { fulfilledSquares: 0, totalSquares: 0 }
      }

      if (fulfilledCategories.includes(grid.activityCategory)) {
        lappiTarget[grid100km].fulfilledSquares += 1
      }

      lappiTarget[grid100km].totalSquares += 1
    }
  })

  Object.keys(stats).forEach(area => {
    let fulfilled = 0

    if (area === 'ML.1112') {
      Object.keys(lappiTarget).forEach(grid100km => {
        const fulfilledSquares = lappiTarget[grid100km].fulfilledSquares
        const totalSquares = lappiTarget[grid100km].totalSquares

        if (fulfilledSquares / totalSquares >= 0.75) {
          fulfilled += 1
        }
      })
    } else {
      Object.keys(stats[area].activityCategories).forEach(category =>{ 
        const activityCategory = stats[area].activityCategories[category]
        activityCategory.squarePercentage = totalSquares[area] === 0 ? 0.0 : activityCategory.squareSum / totalSquares[area] * 100
    
        if (fulfilledCategories.includes(category)) {
          fulfilled += activityCategory.squareSum
        }
      })
  
    }

    stats[area].birdAssociationArea = area === 'totals' ? {
      key: 'ML.totals',
      value: totalTranslations[lang]
    } : {
      key: area,
      value: birdAssociationAreas[area]
    }

    stats[area].targetPercentage = totalSquares[area] === 0 ? 0.0 : fulfilled / totalSquares[area] * 100
    stats[area].totalSquares = totalSquares[area]
  })

  return Object.values(stats)
}

module.exports = { getCachedAssociationStatistics, updateCachedAssociationStatistics }
