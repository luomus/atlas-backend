const access_token = process.env.LAJI_ACCESS_TOKEN

class ApiDao {
  axios
  cache


  constructor(axios, cache) {
    this.axios = axios,
    this.cache = cache
  }

  /**
   * Gets the currently active atlas data for queried YKJ-square from laji.fi-api
   * @param {string} grid
   * @returns {Promise}
   */
    async getListOfDistinctBirdsForGridAndActiveAtlas(grid, page = 1) {
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
    const response = await this.axios.get('https://laji.fi/api/warehouse/query/unit/aggregate', { params })

    return response.data.results
  }

  /**
   * Returns the species atlas data for current bird atlas from laji.fi api
   * @param {string} speciesId
   * @returns {Promise}
   */
  async getGridAndBreedingdataForSpeciesAndActiveAtlas(speciesId) {
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
  const response = await this.axios.get('https://laji.fi/api/warehouse/query/unit/aggregate', { params })

  return response.data.results
  }

  /**
   * Returns the names for given speciesId
   * @param {string} speciesId 
   * @returns {Promise}
   */
  async getSpecies(speciesId) {
    const params = {
      lang: 'multi',
      selectedFields: 'scientificName,vernacularName'
    }

    const data = this.cache.getCache(speciesId)

    if (data === undefined) {
      const response = await this.axios.get(`https://laji.fi/api/taxa/${speciesId}`, { params })

      this.cache.setCache(speciesId, response.data)
      return response.data
    }

    return data
  }

  /**
   * Returns the enum lookup object for given range
   * @param {string} range 
   * @returns {Promise}
   */
  async getEnumRange(range) {
    const params = {
      lang: 'multi',
      asLookupObject: true,
      access_token: access_token
    }

    const data = this.cache.getCache(range)
    if (data === undefined) {
      const response = await this.axios.get(`https://laji.fi/api/metadata/ranges/${range}`, { params })

      this.cache.setCache(range, response.data)
      return response.data
    }

    return data
  }

  async getBirdAssociationAreas() {
    const params = {
      type: 'birdAssociationArea',
      pageSize: 100,
      access_token: access_token
    }

    const data = this.cache.getCache('MNP.birdAssociationArea')

    if (data === undefined) {
      const response = await this.axios.get('ttps://laji.fi/api/areas', { params })
      const associationLookupTable = {}
        
      response.data.results.forEach(association => {
        associationLookupTable[association.id] = association.name
      })
  
      this.cache.setCache('MNP.birdAssociationArea', associationLookupTable)
      return associationLookupTable
    }

    return data
  }
}

module.exports = ApiDao