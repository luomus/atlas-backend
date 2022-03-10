const Querier = require('../../dao/querier')
const AtlasGridSpeciesDataDao = require('../../dao/atlas_grid_species_data_dao')
const AtlasDao = require('../../dao/atlas_dao')
const querier = Querier()
const atlasDao = new AtlasDao(querier)
const atlasSpeciesDataDao = new AtlasGridSpeciesDataDao(querier)

class Taxon {
  /**
   * Returns the statistics of the given species in given atlas.
   * @returns {Array}
   */
  // eslint-disable-next-line max-lines-per-function
  getAtlasForTaxon() {
    // eslint-disable-next-line max-lines-per-function
    return async (req, res) => {
      const {speciesId, atlasId} = req.params
      const stats = await atlasSpeciesDataDao.getatlasClassSumForSpecies(speciesId, atlasId).catch((e) => [])
      const atlas = await atlasDao.getById(atlasId).catch((e) => [])
      return res.json({
        type: 'species_atlas_data',
        species: {id: speciesId},
        atlas: {
          id: atlasId.toString(),
          name: atlas[0].NAME.toString(),
          period: {
            from: atlas[0].STARTINGYEAR,
            to: atlas[0].ENDINGYEAR,
          },
        },
        statistics: stats,
        links: [{
          rel: 'related',
          href: `/area?speciesId=MX.${speciesId}&atlasId=${atlasId}`,
        }],
      })
    }
  }
}

module.exports = Taxon
