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

    createGrid () {
        return (req, res) => {
            this.#mapService.setOverlay()
            this.#gridDao.getAllGrids().then(data => {
                const grid = data.map(rect => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
                res.setHeader('Content-Type', 'image/svg+xml')
                res.send(this.#mapService.createGridOverlay(grid))
            })
        }
    }

    createGridForBirdData () {
        return (req, res) => {
            this.#birdGridDao.getGridAndBreedingdataForBird(req.param("id")).then(data => {
                const grid = data.map(rect => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
                res.setHeader('Content-Type', 'image/svg+xml')
                res.send(this.#mapService.createGridOverlay(grid))
            })
        }
    }

}

module.exports = Grid