class Birds {
    #birdDao
    #birdGridDao
    
    constructor(birdDao, birdGridDao) {
        this.#birdDao = birdDao
        this.#birdGridDao = birdGridDao
    }

    getAll() {
        return (req, res) => this.#birdDao.getAll()
            .then(data => res.send(JSON.stringify(data)), () => res.send(null))
    }

    getAllAtlas3DataBySpecies() {
        return (req, res) => {
            console.log(req.param("mxcode"))
        return this.#birdGridDao.getBySpeciesFromAtlas3(req.param("mxcode"))
            .then(data => res.send(JSON.stringify(data)), () => res.send(null))}

    }

    getGridAndBreedingdataForBird() {
        return (req, res) => {
            console.log(req.param("mxcode"))
        return this.#birdGridDao.getGridAndBreedingdataForBird(req.param("mxcode"))
            .then(data => res.send(JSON.stringify(data)), () => res.send(null))}
    }

}

module.exports = Birds