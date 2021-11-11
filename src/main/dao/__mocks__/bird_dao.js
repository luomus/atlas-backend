class BirdDao {
  #data

  constructor() {
    this.#data = [
      {
        'mxCode': 25836,
        'speciesFI': 'GAVSTE',
        'speciesEN': 'Gavia stellata',
        'speciesSCI': 'Kaakkuri',
        'speciesAbbr': 'Smålom',
        'speciesGroup_id': null,
        'visibility': 1,
      },
      {
        'mxCode': 25837,
        'speciesFI': 'GAVARC',
        'speciesEN': 'Gavia arctica',
        'speciesSCI': 'Kuikka',
        'speciesAbbr': 'Storlom',
        'speciesGroup_id': null,
        'visibility': 1,
      },
      {
        'mxCode': 25844,
        'speciesFI': 'TACRUF',
        'speciesEN': 'Tachybaptus ruficollis',
        'speciesSCI': 'Pikku-uikku',
        'speciesAbbr': 'Smådopping',
        'speciesGroup_id': null,
        'visibility': 1,
      },
      {
        'mxCode': 25859,
        'speciesFI': 'PODGRI',
        'speciesEN': 'Podiceps grisegena',
        'speciesSCI': 'Härkälintu',
        'speciesAbbr': 'Gråhakedopping',
        'speciesGroup_id': null,
        'visibility': 1,
      },
      {
        'mxCode': 25860,
        'speciesFI': 'PODCRI',
        'speciesEN': 'Podiceps cristatus',
        'speciesSCI': 'Silkkiuikku',
        'speciesAbbr': 'Skäggdopping',
        'speciesGroup_id': null,
        'visibility': 1,
      },
    ]
  }

  getAll() {
    return Promise.resolve(this.#data)
  }
}

module.exports = BirdDao
