class GridDao {
    #data

    constructor() {
        this.#data = [
            {
                "id":661312,
                "coordinateN":661,
                "coordinateE":312,
                "municipality_id":147,
                "gridName":"Bogskär"
            },
            {
                "id":663318,
                "coordinateN":663,
                "coordinateE":318,
                "municipality_id":181,
                "gridName":"Alu"
            },
            {
                "id":663319,
                "coordinateN":663,
                "coordinateE":319,
                "municipality_id":181,
                "gridName":"Kalkskär"
            },
            {
                "id":663320,
                "coordinateN":663,
                "coordinateE":320,
                "municipality_id":181,
                "gridName":"Flutun"
            },
            {
                "id":663321,
                "coordinateN":663,
                "coordinateE":321,
                "municipality_id":181,
                "gridName":"Ståtbådarna"
            }
        ]
    }

    getAllGridsAtlas3() {
        return Promise.resolve(this.#data)
    }

}

module.exports = GridDao
