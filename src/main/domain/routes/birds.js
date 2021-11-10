const BirdDao = require("../../dao/bird_dao")
const BirdGridDao = require("../../dao/bird_grid_dao")

class Birds {
    #birdDao
    #birdGridDao
    
    /**
     * @constructor
     * @param {BirdDao} birdDao 
     * @param {BirdGridDao} birdGridDao 
     */
    constructor(birdDao, birdGridDao) {
        this.#birdDao = birdDao
        this.#birdGridDao = birdGridDao
    }
   
   
    /**
     * A method that returns all birds in the database. The data for each bird includes:
     * mxCode, speciesFI, speciesEN, speciesSCI, speciesAbbr, speciesGroup_id, visibility, speciesSV, id
     * @example /api/birds:
     * [{"mxCode":25836,"speciesFI":"Kaakkuri","speciesEN":"Red-throated Diver","speciesSCI":"Gavia stellata","speciesAbbr":"GAVSTE","speciesGroup_id":1,"visibility":1,"speciesSV":"Smålom","id":36},
     * {"mxCode":25837,"speciesFI":"Kuikka","speciesEN":"Black-throated Diver","speciesSCI":"Gavia arctica","speciesAbbr":"GAVARC","speciesGroup_id":1,"visibility":1,"speciesSV":"Storlom","id":37}, ...]
     * @returns {Array}
     */
    getAll() {
        return (req, res) => this.#birdDao.getAll()
            .then(data => res.json(data), () => res.send(null))
    }
    
    
    /**
     * A method that returns all Atlas3 observations of a certain bird specified by bird id (MX.code).
     * The following data is returned:
     * id, species MX.code, grid id, species breeding index, species breeding category
     * @example /api/species?id=25860:
     * [{"id":729298,"species_mxcode":25860,"grid_id":663324,"breedingIndex":50,"breedingCategory":3},
     * {"id":729299,"species_mxcode":25860,"grid_id":664322,"breedingIndex":30,"breedingCategory":2},
     * {"id":729300,"species_mxcode":25860,"grid_id":664323,"breedingIndex":50,"breedingCategory":3}, ...]
     * @returns {Array}
     */
    getAllAtlas3DataBySpecies() {
        return (req, res) => {
            console.log(req.param("id"))
        return this.#birdGridDao.getBySpeciesFromAtlas3(req.param("id"))
            .then(data => res.json(data), () => res.send(null))}

    }


    /**
     * A method that returns Atlas3 grid data for a certain bird specified by bird id (MX.code).
     * The following data is returned:
     * speciesFI, grid id, grid coordinateN, grid coordinateE, atlas3 breedingCategory.
     * @example /api/species/data?id=25860:
     * [{"speciesFI":"Silkkiuikku","id":663324,"coordinateN":663,"coordinateE":324,"breedingCategory":3},
     * {"speciesFI":"Silkkiuikku","id":664322,"coordinateN":664,"coordinateE":322,"breedingCategory":2},
     * {"speciesFI":"Silkkiuikku","id":664323,"coordinateN":664,"coordinateE":323,"breedingCategory":3}, ...]
     * @returns {Array}
     */
    getGridAndBreedingdataForBird() {
        return (req, res) => {
            console.log(req.param("id"))
        return this.#birdGridDao.getGridAndBreedingdataForBird(req.param("id"))
            .then(data => res.send(JSON.stringify(data)), () => res.send(null))}
    }

}

module.exports = Birds