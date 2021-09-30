class Grid {
    #mapService
    #gridDao

    constructor(gridDao, mapService) {
        this.#gridDao = gridDao
        this.#mapService = mapService
    }

    getAll () {
        return (req, res) => this.#gridDao.getAllGrids()
            .then(data => res.send(JSON.stringify(data)), () => res.send(null))
    }

    createGrid () {
        return (req, res) => {
            this.#gridDao.getAllGrids().then(data => {
                const grid = data.map(rect => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
                res.setHeader('Content-Type', 'image/svg+xml')
                res.send(this.#mapService.createGridOverlay(grid))
            })
        }
    }

}

module.exports = Grid