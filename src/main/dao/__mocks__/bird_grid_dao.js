class BirdGridDao {
    #data

    constructor() {
        this.#data = [
            {
                "speciesFI":"Kaakkuri",
                "id":664329,
                "coordinateN":664,
                "coordinateE":329,
                "breedingIndex":10
            },
            {
                "speciesFI":"Kaakkuri",
                "id":664331,
                "coordinateN":664,
                "coordinateE":331,
                "breedingIndex":10
            },
            {
                "speciesFI":"Kaakkuri",
                "id":666328,
                "coordinateN":666,
                "coordinateE":328,
                "breedingIndex":20
            },
            {
                "speciesFI":"Kuikka",
                "id":664328,
                "coordinateN":664,
                "coordinateE":328,
                "breedingIndex":75
            },
            {
                "speciesFI":"Kuikka",
                "id":664329,
                "coordinateN":664,
                "coordinateE":329,
                "breedingIndex":30
            },
            {
                "speciesFI":"Kuikka",
                "id":664331,
                "coordinateN":664,
                "coordinateE":331,
                "breedingIndex":20
            },
            {
                "speciesFI":"Pikku-uikku",
                "id":666324,
                "coordinateN":666,
                "coordinateE":324,
                "breedingIndex":40
            },
            {
                "speciesFI":"Pikku-uikku",
                "id":666331,
                "coordinateN":666,
                "coordinateE":331,
                "breedingIndex":40
            },
            {
                "speciesFI":"Pikku-uikku",
                "id":667337,
                "coordinateN":667,
                "coordinateE":337,
                "breedingIndex":40
            }
        ]
    }

    getBySpeciesFromAtlas3(species_mxcode) {
        return this.#data.filter(x => x.id == species_mxcode)
    }
    
}

module.exports = BirdGridDao