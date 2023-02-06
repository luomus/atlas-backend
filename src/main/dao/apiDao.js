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

    return await this.cache.wrapper(key, async (timout = 0) => { 
      const response = await this.axios.get(url, { params, timout })
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
      const response = await this.axios.get(url, { params, timeout })
      return response.data.results
    })
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
      selectedFields: 'id,scientificName,vernacularName',
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