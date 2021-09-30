class Grids {
    #gridDao

    constructor(gridDao) {
        this.#gridDao = gridDao
    }

    getAll () {
        return (req, res) => this.#gridDao.getAllGrids()
            .then(data => res.send(JSON.stringify(data)), () => res.send(null))
    }

}

module.exports = Grids