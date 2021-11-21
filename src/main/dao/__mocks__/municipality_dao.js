class MunicipalityDao {
  #data

  constructor() {
    this.#data = [
      {
        'id': 13,
        'regionNumber': 23,
        'birdSocietyNameFI': 'Lapin lintutieteellinen yhdistys',
        'birdSocietyNameSV': 'Lapin lintutieteellinen yhdistys',
        'municipalityName': 'Enontekiö',
      },
      {
        'id': 39,
        'regionNumber': 3,
        'birdSocietyNameFI': 'Helsingin Seudun Lintutieteellinen Yhdistys Tringa',
        'birdSocietyNameSV': 'Helsingforstraktens Ornitologiska Förening Tringa',
        'municipalityName': 'Helsinki',
      },
      {
        'id': 147,
        'regionNumber': 1,
        'birdSocietyNameFI': 'Ålands Fågelskyddsförening. Ahvenanmaa',
        'birdSocietyNameSV': 'Ålands Fågelskyddsförening',
        'municipalityName': 'Kökar',
      },
      {
        'id': 180,
        'regionNumber': 11,
        'birdSocietyNameFI': 'Porin Lintutieteellinen Yhdistys',
        'birdSocietyNameSV': 'Porin Lintutieteellinen Yhdistys',
        'municipalityName': 'Luvia',
      },
      {
        'id': 181,
        'regionNumber': 2,
        'birdSocietyNameFI': 'Turun Lintutieteellinen Yhdistys',
        'birdSocietyNameSV': 'Turun Lintutieteellinen Yhdistys',
        'municipalityName': 'Länsi-Turunmaa',
      },
      {
        'id': 352,
        'regionNumber': 2,
        'birdSocietyNameFI': 'Turun Lintutieteellinen Yhdistys',
        'birdSocietyNameSV': 'Turun Lintutieteellinen Yhdistys',
        'municipalityName': 'Turku',
      },
      {
        'id': 360,
        'regionNumber': 23,
        'birdSocietyNameFI': 'Lapin lintutieteellinen yhdistys',
        'birdSocietyNameSV': 'Lapin lintutieteellinen yhdistys',
        'municipalityName': 'Utsjoki',
      },
    ]
  }

  getAllMunicipalities() {
    return Promise.resolve(this.#data)
  }
}

module.exports = MunicipalityDao
