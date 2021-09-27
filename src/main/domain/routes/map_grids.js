class MapGrids {
    #mapService
    #gridDao

    constructor(gridDao, mapService) {
        this.#gridDao = gridDao
        this.#mapService = mapService
    }

    getAll () {
        return (req, res) => {
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(this.#mapService.getGridOverlay(this.#gridDao.getAll()))
        }
    }

}

module.exports = MapGrids