


function clearLesserTaxa(speciesData) {
  const clearedSpeciesDataLookup = {}

  speciesData.forEach(obs => {
    let taxon

    if (obs.aggregateBy['unit.linkings.taxon.aggregateId'] !== '') {
      taxon = obs.aggregateBy['unit.linkings.taxon.aggregateId']
      addLesserTaxa(clearedSpeciesDataLookup, taxon, obs)
    } else if (obs.aggregateBy['unit.linkings.taxon.subspeciesId' !== '']) {
      taxon = obs.aggregateBy['unit.linkings.taxon.subspeciesId']
      addLesserTaxa(clearedSpeciesDataLookup, taxon, obs)
    } else {
      taxon = obs.aggregateBy['unit.linkings.taxon.speciesId']
      addLesserTaxa(clearedSpeciesDataLookup, taxon, obs)
    }
  })

  return Object.values(clearedSpeciesDataLookup)
}

function addLesserTaxa(lookup, taxon, data) {
  if (!lookup[taxon]) {
    const newAggregateBy = {...data.aggregateBy}

    delete newAggregateBy['unit.linkings.taxon.aggregateId']
    delete newAggregateBy['unit.linkings.taxon.speciesId']
    delete newAggregateBy['unit.linkings.taxon.subspeciesId']

    lookup[taxon] = {...data, aggregateBy: newAggregateBy, taxonId: taxon}
  } else {
    const curr = lookup[taxon]
    lookup[taxon] = {
      ...curr,
      atlasCodeMax: curr.atlasCodeMax.padEnd(32, 0) < data.atlasCodeMax.padEnd(32, 0) ? data.atlasCodeMax : curr.atlasCodeMax,
      atlasClassMax: curr.atlasClassMax < data.atlasClassMax ? data.atlasClassMax : curr.atlasClassMax
    }
  }
}

function getAtlasClassSum(speciesData) {
  const atlasClassSum = speciesData.reduce((prev, curr) => {
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
  
  return atlasClassSum | 0
}

function getActivityCategory(atlasClassSum, grid) {
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

  return activityCategory
}

module.exports = { getAtlasClassSum, getActivityCategory, clearLesserTaxa }
