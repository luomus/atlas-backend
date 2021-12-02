const Querier = require('../../dao/querier')
const BirdDao = require('../../dao/bird_dao')
const GridDao = require('../../dao/grid_dao')
const BirdGridDao = require('../../dao/bird_grid_dao')
const querier = Querier()
const birdGridDao = new BirdGridDao(querier)
const birdDao = new BirdDao(querier)
const gridDao = new GridDao(querier)

class Grid {

  /**
     * A method that gets info for one data point.
     * @returns {JSON}
     */
  getGridInfo() {
    return (req, res) => {
      console.log('kysytään ruutua: ', req.param('gridId'))
      return gridDao.getGridById(req.param('gridId'))
        .then((data) => res.send(JSON.stringify(data)), () => res.send(null))
    }
  }

}

module.exports = Grid
