class SpeciesDao {
  #data

  constructor() {
    this.#data = [
      {
        'mxCode': 25836,
        'speciesFI': 'Kaakkuri',
        'speciesSV': 'Smålom',
        'speciesSCI': 'Gavia stellata',
        'speciesAbbr': 'GAVSTE',
        'speciesGroup_id': 1,
        'visibility': 1,
      },
      {
        'mxCode': 25837,
        'speciesFI': 'Kuikka',
        'speciesSV': 'Storlom',
        'speciesSCI': 'Gavia arctica',
        'speciesAbbr': 'GAVARC',
        'speciesGroup_id': 1,
        'visibility': 1,
      },
      {
        'mxCode': 25844,
        'speciesFI': 'Pikku-uikku',
        'speciesSV': 'Smådopping',
        'speciesSCI': 'Tachybaptus ruficollis',
        'speciesAbbr': 'TACRUF',
        'speciesGroup_id': 1,
        'visibility': 1,
      },
      {
        'mxCode': 25859,
        'speciesFI': 'Härkälintu',
        'speciesSV': 'Gråhakedopping',
        'speciesSCI': 'Podiceps grisegena', 
        'speciesAbbr': 'PODGRI',
        'speciesGroup_id': 1,
        'visibility': 1,
      },
      {
        'mxCode': 25860,
        'speciesFI': 'Silkkiuikku',
        'speciesSV': 'Skäggdopping',
        'speciesSCI': 'Podiceps cristatus',
        'speciesAbbr': 'PODCRI',
        'speciesGroup_id': 1,
        'visibility': 1,
      },
      {
        'mxCode': 27697,
        'speciesFI': 'Merisirri',
        'speciesSV': 'Skärsnäppa',
        'speciesEN': 'Purple Sandpiper',
        'speciesSCI': 'Calidris maritima',
        'speciesAbbr': 'CALMAR',
        'speciesGroup_id': 1,
        'visibility': 1,
      },
    ]
  }

  getAll() {
    return Promise.resolve(this.#data)
  }

  getById(id) {
    return Promise.resolve(this.#data.filter((x) => x.mxCode == id).map((d) => ({...d, species_id: 'MX.' + d.mxCode})))
  }
}

module.exports = SpeciesDao
