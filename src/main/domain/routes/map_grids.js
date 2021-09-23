class MapGrids {
    #mapService

    constructor(mapService) {
        this.#mapService = mapService
    }

    getAll () {
        return (req, res) => {
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(this.#mapService.getGridOverlay())
        }
    }

}

module.exports = MapGrids