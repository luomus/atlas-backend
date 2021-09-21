class Birds {
    #birdDao
    
    constructor(birdDao) {
        this.#birdDao = birdDao
    }

    getAll () {
        return (req, res) => this.#birdDao.getAll()
            .then(data => res.send(JSON.stringify(data)), () => res.send(null))
    }

}

module.exports = Birds