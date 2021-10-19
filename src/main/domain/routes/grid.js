const BirdGridDao = require("../../dao/bird_grid_dao")
const {param} = require("express/lib/router");

class Grid {
    #mapService
    #gridDao
    #birdGridDao

    /**
     * @constructor
     * @param {GridDao} gridDao 
     * @param {MapService} mapService 
     * @param {BirdGridDao} birdGridDao 
     */
    constructor(gridDao, mapService, birdGridDao) {
        this.#gridDao = gridDao
        this.#mapService = mapService
        this.#birdGridDao = birdGridDao
    }
    /**
     * A method that returns the observation grid. Data contains
     * id, coordinateN, coordinateE, municipality_id, gridName
     * for each square of the grid.
     * @example /api/grid:
     * [{"id":661312,"coordinateN":661,"coordinateE":312,"municipality_id":147,"gridName":"Bogskär"},
     * {"id":663318,"coordinateN":663,"coordinateE":318,"municipality_id":181,"gridName":"Alu"}, ...]
     * @returns {array}
     */
    getAll () {
        // return (req, res) => this.#gridDao.getAllGrids()
        //     .then(data => res.json(data), () => res.send(null))
        return (req, res) => {
            res.setHeader('Content-Type', 'image/svg+xml')
            res.send(this.#mapService.getBaseMap())
        }
    }

    /**
     * A method that returns an image of the grid.
     * @returns {SVGElement}
     */
    getGrid () {
        return (req, res) => {
            res.setHeader('Content-Type', 'image/svg+xml')
            res.send(this.#mapService.getGrid("svg"))
        }
    }

    /**
     * A method that creates an image of the grid with a bird's breeding data.
     * @returns {SVGElement}
     */
    createGridForBirdData () {
        return (req, res) => {
            this.#birdGridDao.getGridAndBreedingdataForBird(req.param("id")).then(data => {
                if (req.param('type') === 'png') {
                    res.setHeader('Content-Type', 'image/png')
                    this.#mapService.getSpeciesMap(data, callback, 'png', req.param('scaling'))
                    function callback(png) {
                        res.send(png)
                    }
                } else {
                    res.setHeader('Content-Type', 'image/svg+xml')
                    res.send(this.#mapService.getSpeciesMap(data, 'svg', req.param('scaling')))
                }
            })
        }
    }

}

module.exports = Grid