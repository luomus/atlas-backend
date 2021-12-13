class AtlasGridDao {
  #data

  constructor() {
    this.#data = [
      {
        'id': 7755,
        'grid_id': 667317,
        'atlas_id': 3,
        'level1': 1.00,
        'level2': 110.90,
        'level3': 222.80,
        'level4': 270.40,
        'level5': 319.10,
        'activitySum': 406,
        'activityCategory':	5,
      },
      {
        'id': 8307,
        'grid_id': 680320,
        'atlas_id': 3,
        'level1': 1.00,
        'level2': 102.40,
        'level3': 205.80,
        'level4': 250.20,
        'level5': 295.60,
        'activitySum': 363,
        'activityCategory':	5,
      },
      {
        'id': 8317,
        'grid_id': 680330,
        'atlas_id': 3,
        'level1': 1.00,
        'level2': 104.00,
        'level3': 186.00,
        'level4': 240.00,
        'level5': 276.00,
        'activitySum': 289,
        'activityCategory':	5,
      },
      {
        'id': 11376,
        'grid_id': 769326,
        'atlas_id': 3,
        'level1': 1.00,
        'level2': 44.80,
        'level3': 72.00,
        'level4': 115.20,
        'level5': 144.00,
        'activitySum': 85,
        'activityCategory':	3,
      },
      {
        'id': 11377,
        'grid_id': 769327,
        'atlas_id': 3,
        'level1': 1.00,
        'level2': 56.00,
        'level3': 90.00,
        'level4': 144.0,
        'level5': 180.00,
        'activitySum': 64,
        'activityCategory':	2,
      },
      {
        'id': 11447,
        'grid_id': 773352,
        'atlas_id': 3,
        'level1': 1.00,
        'level2': 56.00,
        'level3': 90.00,
        'level4': 144.0,
        'level5': 180.00,
        'activitySum': 115,
        'activityCategory':	3,
      },
    ]
  }

  getAll() {
    return Promise.resolve(this.#data)
  }

  getAllGridInfoForAtlas(atlasId) {
    return Promise.resolve(this.#data.filter((x) => x.atlas_id == atlasId))
  }
}

module.exports = AtlasGridDao
