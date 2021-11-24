class Grid {
  #mapService
  #gridDao
  #birdGridDao
  #birdDao

  /**
     * @constructor
     * @param {GridDao} gridDao
     * @param {MapService} mapService
     * @param {BirdGridDao} birdGridDao
     * @param {GridDao} birdDao
     */
  constructor(gridDao, mapService, birdGridDao, birdDao) {
    this.#gridDao = gridDao
    this.#mapService = mapService
    this.#birdGridDao = birdGridDao
    this.#birdDao = birdDao
  }

  /**
     * A method that creates an image of the grid with a bird's breeding data.
     * @returns {SVGElement}
     */
  createGridForBirdData() {

    return (req, res) => {
      console.log('kysytään lintua: ', req.param('id'))
      this.#birdGridDao.getGridAndBreedingdataForBird(req.param('id')).then((data) => {
        this.#birdDao.getById(req.param('id')).then((species) => {
          console.log('lintu grid.js:ssä: ', species)
          if (req.param('type') === 'png') {
            const callback = (png) => res.send(png)
            res.setHeader('Content-Type', 'image/png')
            this.#mapService.getSpeciesMap(data, species, callback, 'png', req.param('scaling'), req.param('language'))
          } else {
            res.setHeader('Content-Type', 'image/svg+xml')
            res.send(this.#mapService.getSpeciesMap(
                data, species, undefined, 'svg', req.param('scaling'), req.param('language'),
            ))
          }
        })
      })
    }
  }

}

module.exports = Grid
