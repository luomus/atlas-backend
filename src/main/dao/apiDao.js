const axios = require('axios')
const CachedAxios = require('./cachedAxios')
const cachedAxios = CachedAxios()
const access_token = process.env.LAJI_ACCESS_TOKEN

class ApiDao {
  getEnumRange(range) {
    const params = {
      lang: 'multi',
      asLookupObject: true,
      access_token: access_token
    }
    return cachedAxios(`https://api.laji.fi/v0/metadata/ranges/${range}`, params)
  }

  /**
   * Gets the currently active atlas data for queried YKJ-square from laji.fi-api
   * @param {Object} grid
   * @returns {Promise}
   */
    getListOfDistinctBirdsForGridAndActiveAtlas(grid, page = 1) {
    const params = {
      aggregateBy: 'unit.linkings.taxon.speciesId,unit.linkings.taxon.speciesNameEnglish,unit.linkings.taxon.speciesNameFinnish,unit.linkings.taxon.speciesNameSwedish,unit.linkings.taxon.speciesScientificName,unit.linkings.taxon.speciesTaxonomicOrder',
      orderBy: 'unit.linkings.taxon.speciesTaxonomicOrder',
      atlasCounts: true,
      taxonId: 'MX.37580',
      time: '2022/2025',
      coordinateAccuracyMax: 10000,
      ykj10kmCenter: grid,
      recordQuality: 'EXPERT_VERIFIED,COMMUNITY_VERIFIED,NEUTRAL',
      hasValue: 'unit.atlasClass',
      pageSize: 1000,
      page: page,
      cache: true,
    }
    return axios.get('https://laji.fi/api/warehouse/query/unit/aggregate', { params })
  }

  /**
   * Returns the species atlas data for current bird atlas from laji.fi api
   * @param {string} speciesId
   * @returns {Promise}
   */
  getGridAndBreedingdataForSpeciesAndActiveAtlas(speciesId) {
  const params = {
    aggregateBy: 'gathering.conversions.ykj10kmCenter.lat,gathering.conversions.ykj10kmCenter.lon',
    atlasCounts: true,
    excludeNulls: true,
    taxonId: speciesId,
    time: '2022/2025',
    recordQuality: 'EXPERT_VERIFIED,COMMUNITY_VERIFIED,NEUTRAL',
    hasValue: 'unit.atlasClass',
    pageSize: 1000,
    page: 1,
    cache: true,
  }
  return axios.get('https://laji.fi/api/warehouse/query/unit/aggregate', { params })
  }

  /**
   * Returns the names for given speciesId
   * @param {string} speciesId 
   * @returns {Promise}
   */
  getSpecies(speciesId) {
  const params = {
    lang: 'multi',
    selectedFields: 'scientificName,vernacularName'
  }
  return axios.get(`https://laji.fi/api/taxa/${speciesId}`, {params})
  }
}

module.exports = ApiDao