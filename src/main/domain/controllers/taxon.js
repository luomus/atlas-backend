const Querier = require('../../dao/querier')
const querier = new Querier()
const urlRemover = require('../../helpers/urlRemover')
const axios = require('axios')
const Cache = require('../../dao/cache')
const cache = new Cache()
const ApiDao = require('../../dao/apiDao')
const apiDao = new ApiDao(axios, new Cache())
const GridDao = require('../../dao/gridDao')
const gridDao = new GridDao(querier)
const CompleteListDao = require('../../dao/completeListDao')
const completeListDao = new CompleteListDao(gridDao, apiDao, cache)

class Taxon {
  /**
   * Returns atlas species list.
   * @returns {JSON}
   */
  getTaxonList() {
    return async (req, res) => {
      try {
        const taxonList = await apiDao.getBirdList()
        
        return res.json(taxonList)
      } catch (e) {
        return res.status(500).send(e.message)
      }
    }
  }

  getCompleteList() {
    return async (req, res) => {
      try {
      const taxonSet = req.params.taxonSet
      const grid = req.params.grid

      if (!grid) {
        return res.status(400).send('Grid missing')
      } else if (!completeListDao.isAcceptedTaxonSet(taxonSet)) {
        return res.status(400).send('Unacceptable taxonSet')
      }

      const completeList = await completeListDao.getCompleteLists(taxonSet, grid)

      return res.json(completeList)
      } catch (e) {
        console.log(e)

        return res.status(500).send(e.message)
      }
    }
  }

  /**
   * Returns single species from the list and previous and next species in taxonomic order.
   * @returns {JSON}
   */
  getSpeciesFromList() {
    return async (req, res) => {
      try {
        const lang = req.query.language || 'fi'

        const taxonList = await apiDao.getBirdList()
        const taxonListLen = taxonList.length

        const ind = taxonList.findIndex(taxon => taxon.id === req.params.taxonId)

        if (ind === -1) {
          return res.status(404).send()
        }

        const prevInd = ind === 0 ? taxonListLen - 1 : ind - 1
        const nextInd = ind === taxonListLen - 1 ? 0 : ind + 1

        const taxon = taxonList[ind]
        const prevTaxon = taxonList[prevInd]
        const nextTaxon = taxonList[nextInd]

        const toReturn = {
          ...taxon,
          prev: prevTaxon,
          next: nextTaxon,
        }
        return res.json(toReturn)
      } catch (e) {
        return res.status(500).send(e.message)
      }
    }
  }

  /**
   * Returns the grid counts for specific taxon
   * @returns {JSON}
   */
  getSpeciesGridStats() {
    return async (req, res) => {
      try {
        const { taxonId } = req.params
        const breedingData = await apiDao.getGridAndBreedingdataForSpeciesAndActiveAtlas(taxonId)
        const grid = await gridDao.getAll()

        const stats = {
          'MY.atlasClassEnumB': 0,
          'MY.atlasClassEnumC': 0,
          'MY.atlasClassEnumD': 0,
          total: 0
        }

        const breedingDataLookup = {};
        breedingData.forEach(data => {
          breedingDataLookup[`${data['aggregateBy']['gathering.conversions.ykj10kmCenter.lat'].slice(0,3)}:${data['aggregateBy']['gathering.conversions.ykj10kmCenter.lon'].slice(0,3)}`] = urlRemover(data.atlasClassMax)
        })

        grid.forEach((square) => {
          const atlasClass = breedingDataLookup[square.coordinates]

          if (stats[atlasClass] !== undefined) {
            stats[atlasClass] += 1
            stats['total'] += 1
          }
        })

        return res.json(stats)
      } catch (e) {
        return res.status(500).send(e.message)
      }
    }
  }
}

module.exports = Taxon