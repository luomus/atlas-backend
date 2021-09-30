class Grid {
    #mapService
    #gridDao

    constructor(gridDao, mapService) {
        this.#gridDao = gridDao
        this.#mapService = mapService
    }

    createGrid () {
        return (req, res) => {
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(this.#mapService.createGridOverlay(this.#gridDao.getAll()))
        }
    }

}

module.exports = Grid