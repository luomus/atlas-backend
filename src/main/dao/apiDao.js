const access_token = process.env.LAJI_ACCESS_TOKEN
const url_root = process.env.LAJI_API_URL

class ApiDao {
  axios
  cache


  constructor(axios, cache) {
    this.axios = axios,
    this.cache = cache
  }

  async getPaginatedAxios(url, params, timeout, page = 1) {
    const res = await this.axios.get(url, { params: { ...params, page }, timeout})

    const data = res.data.results

    if (res.data.nextPage) {
      for (let i = res.data.nextPage; i <= res.data.lastPage; i++) {
        const nextRes = await this.axios.get(url, { params: { ...params, page: i }, timeout})

        data.push(...nextRes.data.results)
      }
    }
    return data
  }

  async getTaxonSet(taxonSet) {
    const url = `${url_root}/taxa`
    const params = {
      taxonSets: taxonSet,
      lang: 'multi',
      selectedFields: 'id,scientificName,vernacularName,taxonomicOrder,informalTaxonGroups',
      sortOrder: 'taxonomic',
      pageSize: 10000
    }
    
    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => {
       const res = await this.axios.get(url, { params, timeout })

       return res.data.results
    })
  }

  async getCountsOfCompleteListsForAtlas(time) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'gathering.conversions.ykj100km.lat,gathering.conversions.ykj100km.lon,document.documentId',
      taxonId: 'MX.37580',
      typeOfOccurrenceId: 'MX.typeOfOccurrenceRegularBreeder,MX.typeOfOccurrenceIrregularBreeder',
      onlyCount: true,
      excludeNulls: true,
      pessimisticDateRangeHandling: false,
      pageSize: 1000,
      page: 1,
      cache: true,
      dayOfYear: time,
      qualityIssues: 'NO_ISSUES',
      completeListType: 'MY.completeListTypeComplete'
    }

    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => { 
      return await this.getPaginatedAxios(url, params, timeout)
    })
  }

  async getObservationCountsForAtlas(time) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'gathering.conversions.ykj100km.lat,gathering.conversions.ykj100km.lon,unit.linkings.taxon.id',
      taxonId: 'MX.37580',
      typeOfOccurrenceId: 'MX.typeOfOccurrenceRegularBreeder,MX.typeOfOccurrenceIrregularBreeder',
      onlyCount: true,
      taxonCounts: false,
      gatheringCounts: false,
      pairCounts: false,
      atlasCounts: false,
      excludeNulls: true,
      pessimisticDateRangeHandling: false,
      pageSize: 1000,
      page: 1,
      cache: true,
      dayOfYear: time,
      qualityIssues: 'NO_ISSUES',
      completeListType: 'MY.completeListTypeComplete'
    }

    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => { 
      return await this.getPaginatedAxios(url, params, timeout)
    })
  }

  async getObservationCountsForAtlasWholeFinland(time) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'unit.linkings.taxon.id',
      taxonId: 'MX.37580',
      typeOfOccurrenceId: 'MX.typeOfOccurrenceRegularBreeder,MX.typeOfOccurrenceIrregularBreeder',
      countryId: 'ML.206',
      onlyCount: true,
      taxonCounts: false,
      gatheringCounts: false,
      pairCounts: false,
      atlasCounts: false,
      excludeNulls: true,
      pessimisticDateRangeHandling: false,
      pageSize: 1000,
      page: 1,
      cache: true,
      dayOfYear: time,
      qualityIssues: 'NO_ISSUES',
    }

    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => { 
      return await this.getPaginatedAxios(url, params, timeout)
    })
  }

  async getCountsOfCompleteListsByTaxonSet(time, taxonSetId) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'gathering.conversions.ykj100km.lat,gathering.conversions.ykj100km.lon,document.documentId',
      taxonSetId: taxonSetId,
      onlyCount: true,
      excludeNulls: true,
      pessimisticDateRangeHandling: false,
      pageSize: 1000,
      page: 1,
      cache: true,
      dayOfYear: time,
      qualityIssues: 'NO_ISSUES',
      completeListType: 'MY.completeListTypeComplete'
    }

    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => { 
      return await this.getPaginatedAxios(url, params, timeout)
    })
  }

  async getObservationCountsByTaxonSet(time, taxonSetId) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'gathering.conversions.ykj100km.lat,gathering.conversions.ykj100km.lon,unit.linkings.taxon.id',
      taxonSetId: taxonSetId,
      onlyCount: true,
      taxonCounts: false,
      gatheringCounts: false,
      pairCounts: false,
      atlasCounts: false,
      excludeNulls: true,
      pessimisticDateRangeHandling: false,
      pageSize: 1000,
      page: 1,
      cache: true,
      dayOfYear: time,
      qualityIssues: 'NO_ISSUES',
      completeListType: 'MY.completeListTypeComplete'
    }

    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => { 
      return await this.getPaginatedAxios(url, params, timeout)
    })
  }

  async getObservationCountsByTaxonSetWholeFinland(time, taxonSetId) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'unit.linkings.taxon.id',
      taxonSetId: taxonSetId,
      countryId: 'ML.206',
      onlyCount: true,
      taxonCounts: false,
      gatheringCounts: false,
      pairCounts: false,
      atlasCounts: false,
      excludeNulls: true,
      pessimisticDateRangeHandling: false,
      pageSize: 1000,
      page: 1,
      cache: true,
      dayOfYear: time,
      qualityIssues: 'NO_ISSUES',
    }

    const key = url + JSON.stringify(params)

    console.log(params)
    return await this.cache.wrapper(key, async (timeout = 0) => { 
      return await this.getPaginatedAxios(url, params, timeout)
    })
  }

  /**
   * Gets the currently active atlas data for queried YKJ-square from laji.fi-api
   * @param {string} grid
   * @returns {Promise}
   */
  async getListOfDistinctBirdsForGridAndActiveAtlas(grid) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
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
      pageSize: 10000,
      cache: true,
    }
    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => { 
      const response = await this.axios.get(url, { params, timeout })
      return response.data.results
    })
  }

  /**
   * Gets the currently active atlas data for all ykj-grids
   * @param {number} page
   * @returns {Promise}
   */
  async getListOfDistinctBirdsForActiveAtlasPaginated(page = 1) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'unit.linkings.taxon.speciesId,gathering.conversions.ykj10kmCenter.lat,gathering.conversions.ykj10kmCenter.lon',
      orderBy: 'gathering.conversions.ykj10kmCenter.lat,gathering.conversions.ykj10kmCenter.lon',
      atlasCounts: true,
      taxonId: 'MX.37580',
      time: '2022/2025',
      coordinateAccuracyMax: 10000,
      recordQuality: 'EXPERT_VERIFIED,COMMUNITY_VERIFIED,NEUTRAL',
      hasValue: 'unit.atlasClass',
      pageSize: 10000,
      page: page,
      cache: true,
    }
    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => { 
      const response = await this.axios.get(url, { params, timeout })
      return response.data
    })
  }

  /**
   * Returns the species atlas data for current bird atlas from laji.fi api
   * @param {string} speciesId
   * @returns {Promise}
   */
  async getGridAndBreedingdataForSpeciesAndActiveAtlas(speciesId) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'gathering.conversions.ykj10kmCenter.lat,gathering.conversions.ykj10kmCenter.lon',
      atlasCounts: true,
      excludeNulls: true,
      taxonId: speciesId,
      time: '2022/2025',
      recordQuality: 'EXPERT_VERIFIED,COMMUNITY_VERIFIED,NEUTRAL',
      hasValue: 'unit.atlasClass',
      pageSize: 10000,
      cache: true,
    }

    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => { 
      return  await this.getPaginatedAxios(url, params, timeout)
    })
  }


  /**
   * Returns the atlas data within a specific association area for all finnish species in current bird atlas from laji.fi api aggregated by ykj-squares, species id
   * @returns {Promise}
   */
  async getBreedingDataForActiveAtlasAndAssociation(associationId) {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'gathering.conversions.ykj10kmCenter.lat,gathering.conversions.ykj10kmCenter.lon,unit.linkings.taxon.speciesId',
      orderBy: 'gathering.conversions.ykj10kmCenter.lat,gathering.conversions.ykj10kmCenter.lon',
      taxonRankId: 'MX.species',
      atlasCounts: true,
      excludeNulls: true,
      time: '2022/2025',
      birdAssociationAreaId: associationId,
      typeOfOccurrenceId: 'MX.typeOfOccurrenceRegularBreeder,MX.typeOfOccurrenceIrregularBreeder',
      recordQuality: 'EXPERT_VERIFIED,COMMUNITY_VERIFIED,NEUTRAL',
      hasValue: 'unit.atlasClass,gathering.conversions.ykj10kmCenter.lat,gathering.conversions.ykj10kmCenter.lon',
      pageSize: 10000,
      cache: true,
    }
    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => { 
      return await this.getPaginatedAxios(url, params, timeout)
    }) 
  }

  /**
   * Returns the species atlas data for current bird atlas and association from laji.fi api
   * @param {string} speciesId
   * @param {string} associationId
   * @returns {Promise}
   */
  async getGridAndBreedingdataForSpeciesAssociationAndActiveAtlas(speciesId, associationId) {
    const data = await this.getBreedingDataForActiveAtlasAndAssociation(associationId)
    const fullSpeciesId = 'http://tun.fi/' + speciesId

    return data.filter(data => data.aggregateBy['unit.linkings.taxon.speciesId'] === fullSpeciesId)
  }

  /**
   * Returns the names for given speciesId
   * @param {string} speciesId 
   * @returns {Promise}
   */
  async getSpecies(speciesId) {
    const birdList = await this.getBirdList()
    const species = birdList.find(elem => elem.id === speciesId)

    if (species) {
      return {
        vernacularName: species.vernacularName,
        scientificName: species.scientificName
      }
    }

    const url = `${url_root}/taxa/${speciesId}`
    const params = {
      lang: 'multi',
      selectedFields: 'scientificName,vernacularName'
    }
    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => {    
      const response = await this.axios.get(url, { params, timeout })
      return response.data
    }, 3600)
  }

  /**
   * Returns the enum lookup object for given range
   * @param {string} range 
   * @returns {Promise}
   */
  async getEnumRange(range) {
    const url = `${url_root}/metadata/ranges/${range}`
    const params = {
      lang: 'multi',
      asLookupObject: true,
      access_token: access_token
    }
    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => {  
      const response = await this.axios.get(url, { params, timeout })
  
      return response.data  
    }, 3600)
  }

  async getBirdAssociationAreas() {
    const url = `${url_root}/areas`
    const params = {
      type: 'birdAssociationArea',
      pageSize: 100,
      access_token: access_token
    }
    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => {
      const response = await this.axios.get(url, { params })

      const toReturn = []
      response.data.results.forEach(association => {
        if (association.id !== 'ML.1127') {
          toReturn.push({
            key: association.id,
            value: association.name
          })
        }
      })

      return toReturn
    }, 3600)
  }

  async getBirdAssociationAreasAsLookup() {
    const url = `${url_root}/areas`
    const params = {
      type: 'birdAssociationArea',
      pageSize: 100,
      access_token: access_token
    }
    const key = url + JSON.stringify(params) + 'asLookup'

    return await this.cache.wrapper(key, async (timeout = 0) => {
      const response = await this.axios.get(url, { params })
      const associationLookupTable = {}
        
      response.data.results.forEach(association => {
        if (association.id !== 'ML.1127') associationLookupTable[association.id] = association.name
      })
  
      return associationLookupTable
    }, 3600)
  }


  async getBirdList() {
    const url = `${url_root}/taxa/MX.37580/species`
    const params = {
      taxonRanks: 'MX.species',
      lang: 'multi',
      langFallback: true,
      typesOfOccurrenceFilters: 'MX.typeOfOccurrenceRegularBreeder,MX.typeOfOccurrenceIrregularBreeder',
      selectedFields: 'id,scientificName,vernacularName,taxonomicOrder,sensitive',
      onlyFinnish: true,
      sortOrder: 'taxonomic',
      pageSize: 1000
    }
    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => {
      const response = await this.axios.get(url, { params, timeout })

      return response.data.results
    })
  }

  async getSpeciesCountForGrids() {
    const url = `${url_root}/warehouse/query/unit/aggregate`
    const params = {
      aggregateBy: 'gathering.conversions.ykj10kmCenter.lat,gathering.conversions.ykj10kmCenter.lon',
      taxonCounts: true,
      atlasClass: 'MY.atlasClassEnumB,MY.atlasClassEnumC,MY.atlasClassEnumD',
      time: '2022/2025',
      coordinateAccuracyMax: 10000,
      taxonId: 'MX.37580',
      recordQuality: 'EXPERT_VERIFIED,COMMUNITY_VERIFIED,NEUTRAL',
      pageSize: 10000
    }
    const key = url + JSON.stringify(params)

    return await this.cache.wrapper(key, async (timeout = 0) => {  
      const response = await this.axios.get(url, { params, timeout })

      const toReturn = {}
      //for counts into lookup object to speed up grid list forming
      response.data.results.forEach(data => {
        const grid = `http://tun.fi/YKJ.${data.aggregateBy['gathering.conversions.ykj10kmCenter.lat'].slice(0,3)}:${data.aggregateBy['gathering.conversions.ykj10kmCenter.lon'].slice(0,3)}`

        toReturn[grid] = data.speciesCount
      })

      return toReturn
    })
  }
}

module.exports = ApiDao