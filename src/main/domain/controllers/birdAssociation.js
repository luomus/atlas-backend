const axios = require('axios')
const Cache = require('../../dao/cache')
const ApiDao = require('../../dao/apiDao')
const apiDao = new ApiDao(axios, new Cache())

class BirdAssociation {
  /**
   * Returns all area points of the grid.
   * @returns {JSON}
   */
  getAll() {
    return async (req, res) => {
      try {
      const birdAssociationAreas = await apiDao.getBirdAssociationAreas()

      return res.json(birdAssociationAreas)
      } catch (e) {
        console.error(new Date().toString() + ' ' + e.message)
        return res.status(500).send(e.message)
      }
    }
  }
}
  module.exports = BirdAssociation
