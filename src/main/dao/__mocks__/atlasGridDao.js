class AtlasGridDao {
  #data

  constructor() {
    this.#data = [
      {
        "id": 1,
        "grid": "http://tun.fi/YKJ.678:332",
        "atlas": 4,
        "atlasClassSum": 10,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": 2,
        "grid": "http://tun.fi/YKJ.678:333",
        "atlas": 4,
        "atlasClassSum": 25,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": 3,
        "grid": "http://tun.fi/YKJ.679:332",
        "atlas": 4,
        "atlasClassSum": 95,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": 4,
        "grid": "http://tun.fi/YKJ.700:335",
        "atlas": 4,
        "atlasClassSum": 100,
        "activityCategory": "MY.atlasActivityCategoryEnum2"
      },
      {
        "id": 5,
        "grid": "http://tun.fi/YKJ.699:334",
        "atlas": 4,
        "atlasClassSum": 2,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": 6,
        "grid": "http://tun.fi/YKJ.699:335",
        "atlas": 4,
        "atlasClassSum": 11,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": 7,
        "grid": "http://tun.fi/YKJ.698:334",
        "atlas": 4,
        "atlasClassSum": 55,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": 8,
        "grid": "http://tun.fi/YKJ.699:333",
        "atlas": 4,
        "atlasClassSum": 51,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": 9,
        "grid": "http://tun.fi/YKJ.680:320",
        "atlas": 4,
        "atlasClassSum": 2,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": 10,
        "grid": "http://tun.fi/YKJ.690:330",
        "atlas": 4,
        "atlasClassSum": 34,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": 11,
        "grid": "http://tun.fi/YKJ.667:337",
        "atlas": 4,
        "atlasClassSum": 13,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      }
    ]
  }

  getAll() {
    return Promise.resolve(this.#data)
  }

  getAllForAtlasId(atlasId) {
    return Promise.resolve(this.#data.filter((x) => x.atlas == atlasId))
  }
}

module.exports = AtlasGridDao
