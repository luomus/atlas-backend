class MunicipalityDao {
    #data

    constructor() {
        this.#data = [
            {
                "id":39,
                "regionNumber":3,
                "birdSocietyNameFI":"Helsingin Seudun Lintutieteellinen Yhdistys Tringa",
                "birdSocietyNameSV":"Helsingforstraktens Ornitologiska Förening Tringa",
                "municipalityName":"Helsinki"
            },
            {
                "id":147,
                "regionNumber":1,
                "birdSocietyNameFI":"Ålands Fågelskyddsförening. Ahvenanmaa",
                "birdSocietyNameSV":"Ålands Fågelskyddsförening",
                "municipalityName":"Kökar"
            },
            {
                "id":181,
                "regionNumber":2,
                "birdSocietyNameFI":"Turun Lintutieteellinen Yhdistys",
                "birdSocietyNameSV":"Turun Lintutieteellinen Yhdistys",
                "municipalityName":"Länsi-Turunmaa"
            },
            {
                "id":352,
                "regionNumber":2,
                "birdSocietyNameFI":"Turun Lintutieteellinen Yhdistys",
                "birdSocietyNameSV":"Turun Lintutieteellinen Yhdistys",
                "municipalityName":"Turku"
            },
            
        ]
    }

    getAllMunicipalities() {
        return Promise.resolve(this.#data)
    }

}

module.exports = MunicipalityDao
