class BirdGridDao {
  #data

  constructor() {
    this.#data = [
      {
        'id': 725693,
        'species_mxcode': 25836,
        'grid_id': 664329,
        'breedingIndex': 10,
        'breedingCategory': 1,
      },
      {
        'id': 725694,
        'species_mxcode': 25836,
        'grid_id': 664331,
        'breedingIndex': 10,
        'breedingCategory': 1,
      },
      {
        'id': 725695,
        'species_mxcode': 25836,
        'grid_id': 666328,
        'breedingIndex': 20,
        'breedingCategory': 2,
      },
      {
        'id': 726848,
        'species_mxcode': 25837,
        'grid_id': 664328,
        'breedingIndex': 75,
        'breedingCategory': 4,
      },
      {
        'id': 726849,
        'species_mxcode': 25837,
        'grid_id': 664329,
        'breedingIndex': 30,
        'breedingCategory': 2,
      },
      {
        'id': 726850,
        'species_mxcode': 25837,
        'grid_id': 664331,
        'breedingIndex': 20,
        'breedingCategory': 2,
      },
      {
        'id': 729270,
        'species_mxcode': 25844,
        'grid_id': 666324,
        'breedingIndex': 40,
        'breedingCategory': 3,
      },
      {
        'id': 729271,
        'species_mxcode': 25844,
        'grid_id': 666331,
        'breedingIndex': 40,
        'breedingCategory': 3,
      },
      {
        'id': 729272,
        'species_mxcode': 25844,
        'grid_id': 667337,
        'breedingIndex': 40,
        'breedingCategory': 3,
      },
      {
        "id": 767775,
        "species_mxcode": 27697,
        "grid_id": 664318,
        "breedingIndex": 10,
        "breedingCategory": 1,
      },
      {
        "id":767776,
        "species_mxcode":27697,
        "grid_id":667317,
        "breedingIndex":10,
        "breedingCategory":1,
      },
      {
        "id":767777,
        "species_mxcode":27697,
        "grid_id":667318,
        "breedingIndex":10,
        "breedingCategory":1,
      },
      {
        "id":767778,
        "species_mxcode":27697,
        "grid_id":683319,
        "breedingIndex":10,
        "breedingCategory":1,
      },
      {
        "id":767779,
        "species_mxcode":27697,
        "grid_id":766327,
        "breedingIndex":73,
        "breedingCategory":4,
      },
      {
        "id":767780,
        "species_mxcode":27697,
        "grid_id":768326,
        "breedingIndex":74,
        "breedingCategory":4,
      },
      {
        "id":767781,
        "species_mxcode":27697,
        "grid_id":769326,
        "breedingIndex":20,
        "breedingCategory":2,
      },
      {
        "id":767782,
        "species_mxcode":27697,
        "grid_id":769327,
        "breedingIndex":73,
        "breedingCategory":4,
      },
      {
        "id":767783,
        "species_mxcode":27697,
        "grid_id":773352,
        "breedingIndex":20,
        "breedingCategory":2,
      }
    ]
  }

  getBySpeciesFromAtlas3(speciesMxcode) {
    return Promise.resolve(this.#data.filter((x) => x.species_mxcode == speciesMxcode))
  }
}

module.exports = BirdGridDao
