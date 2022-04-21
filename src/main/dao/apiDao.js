const access_token = process.env.LAJI_ACCESS_TOKEN
const url_root = process.env.LAJI_API_URL

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
  async getListOfDistinctBirdsForGridAndActiveAtlas(grid) {
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

    const response = await this.axios.get(`${url_root}/warehouse/query/unit/aggregate`, { params })

    return response.data.results
  }

  /**
   * Gets the currently active atlas data for all ykj-grids
   * @param {number} page
   * @returns {Promise}
   */
  async getListOfDistinctBirdsForActiveAtlasPaginated(page = 1) {
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
    const response = await this.axios.get(`${url_root}/warehouse/query/unit/aggregate`, { params })

    return response.data
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
      pageSize: 10000,
      cache: true,
    }
    const response = await this.axios.get(`${url_root}/warehouse/query/unit/aggregate`, { params })

    return response.data.results
  }

  /**
   * Returns the names for given speciesId
   * @param {string} speciesId 
   * @returns {Promise}
   */
  async getSpecies(speciesId) {
    return await this.cache.wrapper(speciesId, async () => {
      const params = {
        lang: 'multi',
        selectedFields: 'scientificName,vernacularName'
      }
    
      const response = await this.axios.get(`${url_root}/taxa/${speciesId}`, { params })
      return response.data
    })
  }

  /**
   * Returns the enum lookup object for given range
   * @param {string} range 
   * @returns {Promise}
   */
  async getEnumRange(range) {
    return await this.cache.wrapper(range, async () => {
      const params = {
        lang: 'multi',
        asLookupObject: true,
        access_token: access_token
      }
  
      const response = await this.axios.get(`${url_root}/metadata/ranges/${range}`, { params })
  
      return response.data  
    })
  }

  async getBirdAssociationAreas() {
    return await this.cache.wrapper('MNP.birdAssociationArea', async () => {
      const params = {
        type: 'birdAssociationArea',
        pageSize: 100,
        access_token: access_token
      }

      const response = await this.axios.get(`${url_root}/areas`, { params })
      const associationLookupTable = {}
        
      response.data.results.forEach(association => {
        associationLookupTable[association.id] = association.name
      })
  
      return associationLookupTable
    })
  }


  async getBirdList() {
    return await this.cache.wrapper('TaxonList', async () => {
      const params = {
        taxonRanks: 'MX.species',
        lang: 'multi',
        langFallback: true,
        typesOfOccurrenceFilters: 'MX.typeOfOccurrenceRegularBreeder,MX.typeOfOccurrenceIrregularBreeder',
        selectedFields: 'id,scientificName,vernacularName',
        onlyFinnish: true,
        sortOrder: 'taxonomic',
        pageSize: 1000
      }
      
      const response = await this.axios.get(`${url_root}/taxa/MX.37580/species`, { params })

      return response.data.results
    })
  }

  async getSpeciesCountForGrids() {
    return await this.cache.wrapper('SpeciesCountList', async () => {
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
  
      const response = await this.axios.get(`${url_root}/warehouse/query/unit/aggregate`, { params })

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