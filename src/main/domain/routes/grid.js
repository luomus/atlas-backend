class Grid {
    #mapService
    #gridDao
    #birdGridDao

    constructor(gridDao, mapService, birdGridDao) {
        this.#gridDao = gridDao
        this.#mapService = mapService
        this.#birdGridDao = birdGridDao
    }

    getAll () {
        return (req, res) => this.#gridDao.getAllGrids()
            .then(data => res.json(data), () => res.send(null))
    }

    getGrid () {
        return (req, res) => {
            res.setHeader('Content-Type', 'image/svg+xml')
            res.send(this.#mapService.getMap("svg"))
        }
    }

    createGridForBirdData () {
        return (req, res) => {
            this.#birdGridDao.getGridAndBreedingdataForBird(req.param("id")).then(data => {
                res.setHeader('Content-Type', 'image/svg+xml')
                res.send(this.#mapService.speciesMap(data).getMap("svg"))
            })
        }
    }

}

module.exports = Grid