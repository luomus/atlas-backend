class atlasGridSPeciesDataDao {
  #data

  constructor() {
    this.#data = [
      {
        'id': 725693,
        'species': 25836,
        'grid': 664329,
        "atlas":3,
        'atlasCode': 10,
        'atlasClass': 1,
      },
      {
        'id': 725694,
        'species': 25836,
        'grid': 664331,
        "atlas":3,
        'atlasCode': 10,
        'atlasClass': 1,
      },
      {
        'id': 725695,
        'species': 25836,
        'grid': 666328,
        "atlas":3,
        'atlasCode': 20,
        'atlasClass': 2,
      },
      {
        'id': 726848,
        'species': 25837,
        'grid': 664328,
        "atlas":3,
        'atlasCode': 75,
        'atlasClass': 4,
      },
      {
        'id': 726849,
        'species': 25837,
        'grid': 664329,
        "atlas":3,
        'atlasCode': 30,
        'atlasClass': 2,
      },
      {
        'id': 726850,
        'species': 25837,
        'grid': 664331,
        "atlas":3,
        'atlasCode': 20,
        'atlasClass': 2,
      },
      {
        'id': 729270,
        'species': 25844,
        'grid': 666324,
        "atlas":3,
        'atlasCode': 40,
        'atlasClass': 3,
      },
      {
        'id': 729271,
        'species': 25844,
        'grid': 666331,
        "atlas":3,
        'atlasCode': 40,
        'atlasClass': 3,
      },
      {
        'id': 729272,
        'species': 25844,
        'grid': 667337,
        "atlas":3,
        'atlasCode': 40,
        'atlasClass': 3,
      },
      {
        "id": 767775,
        "species": 27697,
        "grid": 664318,
        "atlas":3,
        "atlasCode": 10,
        "atlasClass": 1,
      },
      {
        "id":767776,
        "species":27697,
        "grid":667317,
        "atlas":3,
        "atlasCode":10,
        "atlasClass":1,
      },
      {
        "id":767777,
        "species":27697,
        "grid":667318,
        "atlas":3,
        "atlasCode":10,
        "atlasClass":1,
      },
      {
        "id":767778,
        "species":27697,
        "grid":683319,
        "atlas":3,
        "atlasCode":10,
        "atlasClass":1,
      },
      {
        "id":767779,
        "species":27697,
        "grid":766327,
        "atlas":3,
        "atlasCode":73,
        "atlasClass":4,
      },
      {
        "id":767780,
        "species":27697,
        "grid":768326,
        "atlas":3,
        "atlasCode":74,
        "atlasClass":4,
      },
      {
        "id":767781,
        "species":27697,
        "grid":769326,
        "atlas":3,
        "atlasCode":20,
        "atlasClass":2,
      },
      {
        "id":767782,
        "species":27697,
        "grid":769327,
        "atlas":3,
        "atlasCode":73,
        "atlasClass":4,
      },
      {
        "id":767783,
        "species":27697,
        "grid":773352,
        "atlas":3,
        "atlasCode":20,
        "atlasClass":2,
      }
    ]
  }

  getDataForSpeciesAndAtlas(mxcode, atlasId) {
    return Promise.resolve(this.#data.filter((x) => x.species == mxcode && x.atlas == atlasId))
  }

  getDataForGrid(gridId) {
    return Promise.resolve(this.#data.filter((x) => x.grid == gridId))
  }

  getDataForGridAndAtlas(gridId, atlasId) {
    return Promise.resolve(this.#data.filter((x) => x.grid == gridId && x.atlas == atlasId))
  }

  getGridAndBreedingdataForSpeciesAndAtlas(speciesId, atlasId) {
    return Promise.resolve(this.#data.filter((x) => x.species == speciesId && x.atlas == atlasId).map((d) => ({...d, id: d.grid})))
  }


  getatlasClassSumForSpecies(speciesId, atlasId) {
    return Promise.resolve(this.#data.filter((x) => x.species == speciesId && x.atlas == atlasId))
  }
  
  getListOfDistinctBirdsForGridAndAtlas(gridId, atlasId) {
    return Promise.resolve(this.#data.filter((x) => x.grid == gridId && x.atlas == atlasId))
  }
  
  getAtlasesForSpecies(speciesId) {
    return Promise.resolve(this.#data.filter((x) => x.species == speciesId).map(d => d.atlas))
  }
  getAllData() {
    return Promise.resolve(this.#data)
  }
}

module.exports = atlasGridSPeciesDataDao
