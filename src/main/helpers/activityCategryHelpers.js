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

module.exports = { getAtlasClassSum, getActivityCategory }
