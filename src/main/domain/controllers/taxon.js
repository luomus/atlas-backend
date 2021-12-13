const Querier = require('../../dao/querier')
const SpeciesDao = require('../../dao/species_dao')
const AtlasDataDao = require('../../dao/atlas_data_dao')
const AtlasDao = require('../../dao/atlas_dao')
const querier = Querier()
const atlasDataDao = new AtlasDataDao(querier)
const atlasDao = new AtlasDao(querier)
const speciesDao = new SpeciesDao(querier)

class Taxon {
  /**
   * A method that returns all species in the database.
   * @returns {JSON}
   */
  getAll() {
    return (req, res) => speciesDao.getAll()
        .then((data) => res.json(data), () => res.send(null))
  }

  /**
   * Returns all observations of the given species in given atlas.
   * @returns {JSON}
   */
  getAllDataForSpeciesAndAtlas() {
    return (req, res) => {
      return atlasDataDao.getDataForSpeciesAndAtlas(req.params.speciesId, req.param('atlasId'))
          .then((data) => res.json(data), () => res.send(null))
    }
  }

  /**
   * Returns all atlas data of the given species.
   * @returns {JSON}
   */
  getAllDataForSpecies() {
    return (req, res) => {
      return atlasDataDao.getDataForSpecies(req.params.speciesId)
          .then((data) => res.json(data), () => res.send(null))
    }
  }

  /**
     * Returns atlas data of the given species.
     * @returns {JSON}
     */
  getGridAndBreedingdataForBird() {
    return (req, res) => {
      return atlasDataDao.getGridAndBreedingdataForSpecies(req.params.speciesId)
          .then((data) => res.send(JSON.stringify(data)), () => res.send(null))
    }
  }

  /**
   * Returns the species with given id (MX.code).
   * @returns {Array}
   */
  getSpeciesById() {
    return (req, res) => speciesDao.getById(req.params.speciesId)
        .then((data) => res.json(data), () => res.send(null))
  }

  /**
   * Returns the statistics of the given species in given atlas.
   * @returns {Array}
   */
  getAtlasForTaxon() {
    return async (req, res) => {
      let {speciesId, atlasId} = req.params
      speciesId = speciesId.split(".")[1]
      const stats = await atlasDataDao.getBreedingCategorySumForSpecies(speciesId, atlasId).catch((e) => [])
      const atlas = await atlasDao.getById(atlasId).catch((e) => [])
      return res.json({
          type: "species_atlas_data",
          species: {id: 'MX:' + speciesId.toString()},
          atlas: {
            id: atlasId.toString(),
            period: {
              from: atlas[0].STARTINGYEAR,
              to: atlas[0].ENDINGYEAR
            }
          },
          statistics: stats,
          links: [{
            rel: "related",
            href: `/area?speciesId=MX.${speciesId}&atlasId=${atlasId}`
          }]
      })
    }
  }

  /**
   * Returns a list of species with the given search term in their name.
   * @returns {JSON}
   */
  findTaxon() {
    return (req, res) => speciesDao.searchForSpecies(req.params.species)
          .then((data) => res.json(data), () => res.send(null))
  }

  // countByGroup() {
  //   return (req, res) => speciesDao.countByGroup(req.params.speciesId)
  //       .then((data) => res.json(data), () => res.send(null))
  // }

  getAtlases() {
    return async (req, res) => {
      const speciesId = req.params.speciesId.split(".")[1]
      const atlases = await atlasDataDao.getAtlasesForSpecies(speciesId).catch((e) => [])
      const uniqueAtlases = [...new Set(atlases.map(a => a.atlas_id))]
      const getAtlasForTaxonFunc = this.getAtlasForTaxon()
      const _res = {json: data => data}
      const atlasDataCollection = await Promise.all(uniqueAtlases.map(async (atlasId) => 
        await getAtlasForTaxonFunc({params: {speciesId: req.params.speciesId, atlasId: atlasId}}, _res)
      ))
      return res.json(atlasDataCollection)
    } 
  }

}

module.exports = Taxon
