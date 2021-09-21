class Grids {
    #birdGridDao

    constructor(birdGridDao) {
        this.#birdGridDao = birdGridDao
    }

    getAll () {
        return (req, res) => this.#birdGridDao.getAll()
            .then(data => res.send(JSON.stringify(data)), () => res.send(null))
    }

}

module.exports = Grids