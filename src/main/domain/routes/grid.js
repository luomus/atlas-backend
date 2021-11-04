const BirdGridDao = require("../../dao/bird_grid_dao")
const {param} = require("express/lib/router");

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
     * A method that returns the observation grid. Data contains
     * id, coordinateN, coordinateE, municipality_id, gridName
     * for each square of the grid.
     * @example /api/grid:
     * [{"id":661312,"coordinateN":661,"coordinateE":312,"municipality_id":147,"gridName":"Bogskär"},
     * {"id":663318,"coordinateN":663,"coordinateE":318,"municipality_id":181,"gridName":"Alu"}, ...]
     * @returns {array}
     */
    getAll () {
        return (req, res) => this.#gridDao.getAllGrids()
            .then(data => res.json(data), () => res.send(null))
    }

    /**
     * A method that returns an image of the grid.
     * @returns {SVGElement}
     */
    getGrid () {
        return (req, res) => {
            if (req.param('type') === 'png') {
                res.setHeader('Content-Type', 'image/png')
                const callback = png => res.send(png)
                res.send(this.#mapService.getGrid("png", callback))
            } else {
                res.setHeader('Content-Type', 'image/svg+xml')
                res.send(this.#mapService.getGrid("svg", undefined))
            }
        }
    }

    /**
     * A method that creates an image of the grid with a bird's breeding data.
     * @returns {SVGElement}
     */
    createGridForBirdData () {
        return (req, res) => {
            this.#birdGridDao.getGridAndBreedingdataForBird(req.param("id")).then(data => {
                this.#birdDao.getById(req.param("id")).then(species => {
                    if (req.param('type') === 'png') {
                        const callback = png => res.send(png)
                        res.setHeader('Content-Type', 'image/png')
                        this.#mapService.getSpeciesMap(data, species, callback, 'png', req.param('scaling'))
                    } else {
                        res.setHeader('Content-Type', 'image/svg+xml')
                        res.send(this.#mapService.getSpeciesMap(data, species, undefined, 'svg', req.param('scaling')))
                    }
                })
            })
        }
    }

    /**
     * A method that returns an image of the base map with YKJ100km grid and borders of Finland.
     * @returns {SVGElement}
     */
    getBaseMap () {
        return (req, res) => {
            if (req.param('type') === 'png') {
                res.setHeader('Content-Type', 'image/png')
                const callback = png => res.send(png)
                res.send(this.#mapService.getBaseMap("png", callback))
            } else {
                res.setHeader('Content-Type', 'image/svg+xml')
                res.send(this.#mapService.getBaseMap("svg", undefined))
            }
        }
    }
}

module.exports = Grid