const Querier = require('../../dao/querier')
const querier = Querier()
const urlRemover = require('../../helpers/urlRemover')
const axios = require('axios')
const Cache = require('../../dao/cache')
const ApiDao = require('../../dao/apiDao')
const apiDao = new ApiDao(axios, Cache())

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
}

module.exports = Taxon