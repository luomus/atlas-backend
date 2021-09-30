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
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(this.#mapService.createGridOverlay(this.#gridDao.getAllGrids()))
        }
    }

}

module.exports = Grid