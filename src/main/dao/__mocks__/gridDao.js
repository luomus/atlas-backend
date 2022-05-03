class GridDao {
  #data = {
    grid: [],
    atlasGrid: []
  }

  constructor() {
    this.#data.grid = [
      {
        "id": "http://tun.fi/YKJ.678:332",
        "coordinates": "678:332",
        "birdAssociationArea": "ML.1099",
        "name": "Akaa, Jalanti",
        "level1": 1,
        "level2": 105.60000000000001,
        "level3": 189.20000000000002,
        "level4": 243.20000000000002,
        "level5": 279.2
      },
      {
        "id": "http://tun.fi/YKJ.678:333",
        "coordinates": "678:333",
        "birdAssociationArea": "ML.1099",
        "name": "Akaa, Toijala Metsä-Paavola",
        "level1": 1,
        "level2": 105.60000000000001,
        "level3": 189.20000000000002,
        "level4": 243.20000000000002,
        "level5": 279.2
      },
      {
        "id": "http://tun.fi/YKJ.679:332",
        "coordinates": "679:332",
        "birdAssociationArea": "ML.1099",
        "name": "Akaa, Viiala",
        "level1": 1,
        "level2": 104.8,
        "level3": 187.6,
        "level4": 241.6,
        "level5": 277.6
      },
      {
        "id": "http://tun.fi/YKJ.700:335",
        "coordinates": "700:335",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Aitakangas",
        "level1": 1,
        "level2": 88,
        "level3": 154,
        "level4": 208,
        "level5": 244
      },
      {
        "id": "http://tun.fi/YKJ.699:334",
        "coordinates": "699:334",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Hoisko",
        "level1": 1,
        "level2": 88.8,
        "level3": 155.6,
        "level4": 209.6,
        "level5": 245.6
      },
      {
        "id": "http://tun.fi/YKJ.699:335",
        "coordinates": "699:335",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Iiruu",
        "level1": 1,
        "level2": 88.8,
        "level3": 155.6,
        "level4": 209.6,
        "level5": 245.6
      },
      {
        "id": "http://tun.fi/YKJ.698:334",
        "coordinates": "698:334",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Iso-Räyrinki",
        "level1": 1,
        "level2": 89.60000000000001,
        "level3": 157.20000000000002,
        "level4": 211.20000000000002,
        "level5": 247.20000000000002
      },
      {
        "id": "http://tun.fi/YKJ.699:333",
        "coordinates": "699:333",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Kurejoki",
        "level1": 1,
        "level2": 88.8,
        "level3": 155.6,
        "level4": 209.6,
        "level5": 245.6
      },
      {
        "id": "http://tun.fi/YKJ.680:320",
        "coordinates": "680:320",
        "birdAssociationArea": "ML.1116",
        "name": "Eurajoki, Olkiluoto",
        "level1": 1,
        "level2": 102.4,
        "level3": 205.8,
        "level4": 250.20000000000002,
        "level5": 295.6
      },
      {
        "id": "http://tun.fi/YKJ.690:330",
        "coordinates": "690:330",
        "birdAssociationArea": "ML.1099",
        "name": "Kihniö, Kihniön keskusta",
        "level1": 1,
        "level2": 96,
        "level3": 170,
        "level4": 224,
        "level5": 260
      },
      {
        "id": "http://tun.fi/YKJ.667:337",
        "coordinates": "667:337",
        "birdAssociationArea": "ML.1091",
        "name": "Espoo, Espoon keskusta",
        "level1": 1,
        "level2": 110.9,
        "level3": 222.8,
        "level4": 270.4,
        "level5": 319.1
      }
    ]
    this.#data.atlasGrid = [
      {
        "id": "http://tun.fi/YKJ.678:332",
        "coordinates": "678:332",
        "birdAssociationArea": "ML.1099",
        "name": "Akaa, Jalanti",
        "level1": 1,
        "level2": 105.60000000000001,
        "level3": 189.20000000000002,
        "level4": 243.20000000000002,
        "level5": 279.2,
        "atlas": 4,
        "atlasClassSum": 10,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": "http://tun.fi/YKJ.678:333",
        "coordinates": "678:333",
        "birdAssociationArea": "ML.1099",
        "name": "Akaa, Toijala Metsä-Paavola",
        "level1": 1,
        "level2": 105.60000000000001,
        "level3": 189.20000000000002,
        "level4": 243.20000000000002,
        "level5": 279.2,
        "atlas": 4,
        "atlasClassSum": 25,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": "http://tun.fi/YKJ.679:332",
        "coordinates": "679:332",
        "birdAssociationArea": "ML.1099",
        "name": "Akaa, Viiala",
        "level1": 1,
        "level2": 104.8,
        "level3": 187.6,
        "level4": 241.6,
        "level5": 277.6,
        "atlas": 4,
        "atlasClassSum": 95,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": "http://tun.fi/YKJ.700:335",
        "coordinates": "700:335",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Aitakangas",
        "level1": 1,
        "level2": 88,
        "level3": 154,
        "level4": 208,
        "level5": 244,
        "atlas": 4,
        "atlasClassSum": 100,
        "activityCategory": "MY.atlasActivityCategoryEnum2"
      },
      {
        "id": "http://tun.fi/YKJ.699:334",
        "coordinates": "699:334",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Hoisko",
        "level1": 1,
        "level2": 88.8,
        "level3": 155.6,
        "level4": 209.6,
        "level5": 245.6,
        "atlas": 4,
        "atlasClassSum": 2,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": "http://tun.fi/YKJ.699:335",
        "coordinates": "699:335",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Iiruu",
        "level1": 1,
        "level2": 88.8,
        "level3": 155.6,
        "level4": 209.6,
        "level5": 245.6,
        "atlas": 4,
        "atlasClassSum": 11,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": "http://tun.fi/YKJ.698:334",
        "coordinates": "698:334",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Iso-Räyrinki",
        "level1": 1,
        "level2": 89.60000000000001,
        "level3": 157.20000000000002,
        "level4": 211.20000000000002,
        "level5": 247.20000000000002,
        "atlas": 4,
        "atlasClassSum": 55,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": "http://tun.fi/YKJ.699:333",
        "coordinates": "699:333",
        "birdAssociationArea": "ML.1105",
        "name": "Alajärvi, Kurejoki",
        "level1": 1,
        "level2": 88.8,
        "level3": 155.6,
        "level4": 209.6,
        "level5": 245.6,
        "atlas": 4,
        "atlasClassSum": 51,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": "http://tun.fi/YKJ.680:320",
        "coordinates": "680:320",
        "birdAssociationArea": "ML.1116",
        "name": "Eurajoki, Olkiluoto",
        "level1": 1,
        "level2": 102.4,
        "level3": 205.8,
        "level4": 250.20000000000002,
        "level5": 295.6,
        "atlas": 4,
        "atlasClassSum": 2,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": "http://tun.fi/YKJ.690:330",
        "coordinates": "690:330",
        "birdAssociationArea": "ML.1099",
        "name": "Kihniö, Kihniön keskusta",
        "level1": 1,
        "level2": 96,
        "level3": 170,
        "level4": 224,
        "level5": 260,
        "atlas": 4,
        "atlasClassSum": 34,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      },
      {
        "id": "http://tun.fi/YKJ.667:337",
        "coordinates": "667:337",
        "birdAssociationArea": "ML.1091",
        "name": "Espoo, Espoon keskusta",
        "level1": 1,
        "level2": 110.9,
        "level3": 222.8,
        "level4": 270.4,
        "level5": 319.1,
        "atlas": 4,
        "atlasClassSum": 13,
        "activityCategory": "MY.atlasActivityCategoryEnum1"
      }
    ]
  }

  getAll() {
    return Promise.resolve(this.#data.grid)
  }

  getById(gridId) {
    return Promise.resolve(this.#data.grid.filter((x) => x.id === gridId))
  }

  getByIdAndAtlasGridForAtlas(gridId, atlasId) {
    return Promise.resolve(this.#data.atlasGrid.filter((x) => x.id === gridId && x.atlas === atlasId))
  }
}

module.exports = GridDao
