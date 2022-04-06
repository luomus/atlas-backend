class AtlasDao {
  #data

  constructor() {
    this.#data = [
      {
        'id': 1,
        'startingYear': 1974,
        'endingYear': 1979,
        "name": 'Lintuatlas 1',
      },
      {
        'id': 2,
        'startingYear': 1986,
        'endingYear': 1989,
        "name": 'Lintuatlas 2',
      },
      {
        'id': 3,
        'startingYear': 2006,
        'endingYear': 2010,
        "name": 'Lintuatlas 3',
      },
      {
        'id': 4,
        'startingYear': 2022,
        'endingYear': 2025,
        'name': 'Lintuatlas 4',
      }
    ]
  }

  getAll() {
    return Promise.resolve(this.#data)
  }

  getById(id) {
    return Promise.resolve(this.#data.filter((x) => x.id == id))
  }
}

module.exports = AtlasDao
