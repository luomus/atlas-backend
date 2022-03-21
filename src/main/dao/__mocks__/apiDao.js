class ApiDao {
  #data = {
    gridData: [],
    breedingData: [],
    speciesData: {},
    atlasCode: {},
    atlasClass: {}
  }

  constructor() {
    this.#data.gridData = [
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.27649',
          'unit.linkings.taxon.speciesNameEnglish': 'Eurasian Woodcock',
          'unit.linkings.taxon.speciesNameFinnish': 'lehtokurppa',
          'unit.linkings.taxon.speciesNameSwedish': 'morkulla',
          'unit.linkings.taxon.speciesScientificName': 'Scolopax rusticola',
          'unit.linkings.taxon.speciesTaxonomicOrder': '47931'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum1',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumA'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.27748',
          'unit.linkings.taxon.speciesNameEnglish': 'Mew Gull',
          'unit.linkings.taxon.speciesNameFinnish': 'kalalokki',
          'unit.linkings.taxon.speciesNameSwedish': 'fiskmås',
          'unit.linkings.taxon.speciesScientificName': 'Larus canus',
          'unit.linkings.taxon.speciesTaxonomicOrder': '48176'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum1',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumA'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.27903',
          'unit.linkings.taxon.speciesNameEnglish': 'Rock Dove',
          'unit.linkings.taxon.speciesNameFinnish': 'kalliokyyhky',
          'unit.linkings.taxon.speciesNameSwedish': 'klippduva',
          'unit.linkings.taxon.speciesScientificName': 'Columba livia',
          'unit.linkings.taxon.speciesTaxonomicOrder': '48230'
        },
        count: 6,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.27908',
          'unit.linkings.taxon.speciesNameEnglish': 'Stock Dove',
          'unit.linkings.taxon.speciesNameFinnish': 'uuttukyyhky',
          'unit.linkings.taxon.speciesNameSwedish': 'skogsduva',
          'unit.linkings.taxon.speciesScientificName': 'Columba oenas',
          'unit.linkings.taxon.speciesTaxonomicOrder': '48236'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.27911',
          'unit.linkings.taxon.speciesNameEnglish': 'Common Wood Pigeon',
          'unit.linkings.taxon.speciesNameFinnish': 'sepelkyyhky',
          'unit.linkings.taxon.speciesNameSwedish': 'ringduva',
          'unit.linkings.taxon.speciesScientificName': 'Columba palumbus',
          'unit.linkings.taxon.speciesTaxonomicOrder': '48239'
        },
        count: 4,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.30504',
          'unit.linkings.taxon.speciesNameEnglish': 'Black Woodpecker',
          'unit.linkings.taxon.speciesNameFinnish': 'palokärki',
          'unit.linkings.taxon.speciesNameSwedish': 'spillkråka',
          'unit.linkings.taxon.speciesScientificName': 'Dryocopus martius',
          'unit.linkings.taxon.speciesTaxonomicOrder': '50381'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum1',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumA'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.30443',
          'unit.linkings.taxon.speciesNameEnglish': 'Great Spotted Woodpecker',
          'unit.linkings.taxon.speciesNameFinnish': 'käpytikka',
          'unit.linkings.taxon.speciesNameSwedish': 'större hackspett',
          'unit.linkings.taxon.speciesScientificName': 'Dendrocopos major',
          'unit.linkings.taxon.speciesTaxonomicOrder': '50493'
        },
        count: 6,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.30438',
          'unit.linkings.taxon.speciesNameEnglish': 'White-backed Woodpecker',
          'unit.linkings.taxon.speciesNameFinnish': 'valkoselkätikka',
          'unit.linkings.taxon.speciesNameSwedish': 'vitryggig hackspett',
          'unit.linkings.taxon.speciesScientificName': 'Dendrocopos leucotos',
          'unit.linkings.taxon.speciesTaxonomicOrder': '50497'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum62',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.30428',
          'unit.linkings.taxon.speciesNameEnglish': 'Lesser Spotted Woodpecker',
          'unit.linkings.taxon.speciesNameFinnish': 'pikkutikka',
          'unit.linkings.taxon.speciesNameSwedish': 'mindre hackspett',
          'unit.linkings.taxon.speciesScientificName': 'Dendrocopos minor',
          'unit.linkings.taxon.speciesTaxonomicOrder': '50498'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.32801',
          'unit.linkings.taxon.speciesNameEnglish': 'European Robin',
          'unit.linkings.taxon.speciesNameFinnish': 'punarinta',
          'unit.linkings.taxon.speciesNameSwedish': 'rödhake',
          'unit.linkings.taxon.speciesScientificName': 'Erithacus rubecula',
          'unit.linkings.taxon.speciesTaxonomicOrder': '57220'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.33106',
          'unit.linkings.taxon.speciesNameEnglish': 'Common Blackbird',
          'unit.linkings.taxon.speciesNameFinnish': 'mustarastas',
          'unit.linkings.taxon.speciesNameSwedish': 'koltrast',
          'unit.linkings.taxon.speciesScientificName': 'Turdus merula',
          'unit.linkings.taxon.speciesTaxonomicOrder': '57406'
        },
        count: 6,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.33954',
          'unit.linkings.taxon.speciesNameEnglish': 'Goldcrest',
          'unit.linkings.taxon.speciesNameFinnish': 'hippiäinen',
          'unit.linkings.taxon.speciesNameSwedish': 'kungsfågel',
          'unit.linkings.taxon.speciesScientificName': 'Regulus regulus',
          'unit.linkings.taxon.speciesTaxonomicOrder': '57674'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.34574',
          'unit.linkings.taxon.speciesNameEnglish': 'Eurasian Blue Tit',
          'unit.linkings.taxon.speciesNameFinnish': 'sinitiainen',
          'unit.linkings.taxon.speciesNameSwedish': 'blåmes',
          'unit.linkings.taxon.speciesScientificName': 'Cyanistes caeruleus',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58047'
        },
        count: 12,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.34567',
          'unit.linkings.taxon.speciesNameEnglish': 'Great Tit',
          'unit.linkings.taxon.speciesNameFinnish': 'talitiainen',
          'unit.linkings.taxon.speciesNameSwedish': 'talgoxe',
          'unit.linkings.taxon.speciesScientificName': 'Parus major',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58052'
        },
        count: 8,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.34549',
          'unit.linkings.taxon.speciesNameEnglish': 'Coal Tit',
          'unit.linkings.taxon.speciesNameFinnish': 'kuusitiainen',
          'unit.linkings.taxon.speciesNameSwedish': 'svartmes',
          'unit.linkings.taxon.speciesScientificName': 'Periparus ater',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58063'
        },
        count: 4,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.34616',
          'unit.linkings.taxon.speciesNameEnglish': 'Eurasian Treecreeper',
          'unit.linkings.taxon.speciesNameFinnish': 'puukiipijä',
          'unit.linkings.taxon.speciesNameSwedish': 'trädkrypare',
          'unit.linkings.taxon.speciesScientificName': 'Certhia familiaris',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58154'
        },
        count: 3,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.37090',
          'unit.linkings.taxon.speciesNameEnglish': 'Eurasian Jay',
          'unit.linkings.taxon.speciesNameFinnish': 'närhi',
          'unit.linkings.taxon.speciesNameSwedish': 'nötskrika',
          'unit.linkings.taxon.speciesScientificName': 'Garrulus glandarius',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58297'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.37122',
          'unit.linkings.taxon.speciesNameEnglish': 'Eurasian Magpie',
          'unit.linkings.taxon.speciesNameFinnish': 'harakka',
          'unit.linkings.taxon.speciesNameSwedish': 'skata',
          'unit.linkings.taxon.speciesScientificName': 'Pica pica',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58316'
        },
        count: 4,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum62',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.37142',
          'unit.linkings.taxon.speciesNameEnglish': 'Western Jackdaw',
          'unit.linkings.taxon.speciesNameFinnish': 'naakka',
          'unit.linkings.taxon.speciesNameSwedish': 'kaja',
          'unit.linkings.taxon.speciesScientificName': 'Corvus monedula',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58325'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.73566',
          'unit.linkings.taxon.speciesNameEnglish': 'Carrion Crow',
          'unit.linkings.taxon.speciesNameFinnish': 'varis',
          'unit.linkings.taxon.speciesNameSwedish': 'kråka',
          'unit.linkings.taxon.speciesScientificName': 'Corvus corone',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58364'
        },
        count: 5,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.37178',
          'unit.linkings.taxon.speciesNameEnglish': 'Northern Raven',
          'unit.linkings.taxon.speciesNameFinnish': 'korppi',
          'unit.linkings.taxon.speciesNameSwedish': 'korp',
          'unit.linkings.taxon.speciesScientificName': 'Corvus corax',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58367'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum62',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.36817',
          'unit.linkings.taxon.speciesNameEnglish': 'Common Starling',
          'unit.linkings.taxon.speciesNameFinnish': 'kottarainen',
          'unit.linkings.taxon.speciesNameSwedish': 'stare',
          'unit.linkings.taxon.speciesScientificName': 'Sturnus vulgaris',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58428'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.36573',
          'unit.linkings.taxon.speciesNameEnglish': 'House Sparrow',
          'unit.linkings.taxon.speciesNameFinnish': 'varpunen',
          'unit.linkings.taxon.speciesNameSwedish': 'gråsparv',
          'unit.linkings.taxon.speciesScientificName': 'Passer domesticus',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58579'
        },
        count: 9,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum62',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.36589',
          'unit.linkings.taxon.speciesNameEnglish': 'Eurasian Tree Sparrow',
          'unit.linkings.taxon.speciesNameFinnish': 'pikkuvarpunen',
          'unit.linkings.taxon.speciesNameSwedish': 'pilfink',
          'unit.linkings.taxon.speciesScientificName': 'Passer montanus',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58595'
        },
        count: 7,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum62',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.36237',
          'unit.linkings.taxon.speciesNameEnglish': 'Common Chaffinch',
          'unit.linkings.taxon.speciesNameFinnish': 'peippo',
          'unit.linkings.taxon.speciesNameSwedish': 'bofink',
          'unit.linkings.taxon.speciesScientificName': 'Fringilla coelebs',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58631'
        },
        count: 4,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.36283',
          'unit.linkings.taxon.speciesNameEnglish': 'European Greenfinch',
          'unit.linkings.taxon.speciesNameFinnish': 'viherpeippo',
          'unit.linkings.taxon.speciesNameSwedish': 'grönfink',
          'unit.linkings.taxon.speciesScientificName': 'Carduelis chloris',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58746'
        },
        count: 8,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum62',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.36306',
          'unit.linkings.taxon.speciesNameEnglish': 'European Goldfinch',
          'unit.linkings.taxon.speciesNameFinnish': 'tikli',
          'unit.linkings.taxon.speciesNameSwedish': 'steglits',
          'unit.linkings.taxon.speciesScientificName': 'Carduelis carduelis',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58747'
        },
        count: 8,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.36287',
          'unit.linkings.taxon.speciesNameEnglish': 'Eurasian Siskin',
          'unit.linkings.taxon.speciesNameFinnish': 'vihervarpunen',
          'unit.linkings.taxon.speciesNameSwedish': 'grönsiska',
          'unit.linkings.taxon.speciesScientificName': 'Carduelis spinus',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58748'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'unit.linkings.taxon.speciesId': 'http://tun.fi/MX.36366',
          'unit.linkings.taxon.speciesNameEnglish': 'Eurasian Bullfinch',
          'unit.linkings.taxon.speciesNameFinnish': 'punatulkku',
          'unit.linkings.taxon.speciesNameSwedish': 'domherre',
          'unit.linkings.taxon.speciesScientificName': 'Pyrrhula pyrrhula',
          'unit.linkings.taxon.speciesTaxonomicOrder': '58893'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum1',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumA'
      }
    ]
    this.#data.breedingData = [
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '667.0',
          'gathering.conversions.ykj10kmCenter.lon': '337.0'
        },
        count: 12,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '666.0',
          'gathering.conversions.ykj10kmCenter.lon': '332.0'
        },
        count: 5,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '666.0',
          'gathering.conversions.ykj10kmCenter.lon': '331.0'
        },
        count: 4,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum1',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumA'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '667.0',
          'gathering.conversions.ykj10kmCenter.lon': '336.0'
        },
        count: 3,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '700.0',
          'gathering.conversions.ykj10kmCenter.lon': '322.0'
        },
        count: 3,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '711.0',
          'gathering.conversions.ykj10kmCenter.lon': '355.0'
        },
        count: 3,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '720.0',
          'gathering.conversions.ykj10kmCenter.lon': '342.0'
        },
        count: 3,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '666.0',
          'gathering.conversions.ykj10kmCenter.lon': '337.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '667.0',
          'gathering.conversions.ykj10kmCenter.lon': '338.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '667.0',
          'gathering.conversions.ykj10kmCenter.lon': '339.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum62',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '670.0',
          'gathering.conversions.ykj10kmCenter.lon': '324.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '670.0',
          'gathering.conversions.ykj10kmCenter.lon': '349.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum1',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumA'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '671.0',
          'gathering.conversions.ykj10kmCenter.lon': '324.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '676.0',
          'gathering.conversions.ykj10kmCenter.lon': '342.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '678.0',
          'gathering.conversions.ykj10kmCenter.lon': '324.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '679.0',
          'gathering.conversions.ykj10kmCenter.lon': '320.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '679.0',
          'gathering.conversions.ykj10kmCenter.lon': '321.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '680.0',
          'gathering.conversions.ykj10kmCenter.lon': '335.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '683.0',
          'gathering.conversions.ykj10kmCenter.lon': '321.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '690.0',
          'gathering.conversions.ykj10kmCenter.lon': '343.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum6',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '691.0',
          'gathering.conversions.ykj10kmCenter.lon': '350.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '694.0',
          'gathering.conversions.ykj10kmCenter.lon': '344.0'
        },
        count: 2,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '665.0',
          'gathering.conversions.ykj10kmCenter.lon': '331.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum1',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumA'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '667.0',
          'gathering.conversions.ykj10kmCenter.lon': '332.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum5',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '669.0',
          'gathering.conversions.ykj10kmCenter.lon': '334.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '670.0',
          'gathering.conversions.ykj10kmCenter.lon': '325.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '670.0',
          'gathering.conversions.ykj10kmCenter.lon': '346.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum1',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumA'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '671.0',
          'gathering.conversions.ykj10kmCenter.lon': '323.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '671.0',
          'gathering.conversions.ykj10kmCenter.lon': '345.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '672.0',
          'gathering.conversions.ykj10kmCenter.lon': '341.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '672.0',
          'gathering.conversions.ykj10kmCenter.lon': '342.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '673.0',
          'gathering.conversions.ykj10kmCenter.lon': '341.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '674.0',
          'gathering.conversions.ykj10kmCenter.lon': '334.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum1',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumA'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '675.0',
          'gathering.conversions.ykj10kmCenter.lon': '344.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '676.0',
          'gathering.conversions.ykj10kmCenter.lon': '324.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '677.0',
          'gathering.conversions.ykj10kmCenter.lon': '321.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '677.0',
          'gathering.conversions.ykj10kmCenter.lon': '324.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '677.0',
          'gathering.conversions.ykj10kmCenter.lon': '334.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '678.0',
          'gathering.conversions.ykj10kmCenter.lon': '320.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '679.0',
          'gathering.conversions.ykj10kmCenter.lon': '345.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '680.0',
          'gathering.conversions.ykj10kmCenter.lon': '321.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '681.0',
          'gathering.conversions.ykj10kmCenter.lon': '321.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum62',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '681.0',
          'gathering.conversions.ykj10kmCenter.lon': '322.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '681.0',
          'gathering.conversions.ykj10kmCenter.lon': '334.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '681.0',
          'gathering.conversions.ykj10kmCenter.lon': '339.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '681.0',
          'gathering.conversions.ykj10kmCenter.lon': '340.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '682.0',
          'gathering.conversions.ykj10kmCenter.lon': '323.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '682.0',
          'gathering.conversions.ykj10kmCenter.lon': '332.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '683.0',
          'gathering.conversions.ykj10kmCenter.lon': '331.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '683.0',
          'gathering.conversions.ykj10kmCenter.lon': '332.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '683.0',
          'gathering.conversions.ykj10kmCenter.lon': '351.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '687.0',
          'gathering.conversions.ykj10kmCenter.lon': '343.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '691.0',
          'gathering.conversions.ykj10kmCenter.lon': '343.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '691.0',
          'gathering.conversions.ykj10kmCenter.lon': '353.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '692.0',
          'gathering.conversions.ykj10kmCenter.lon': '340.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '694.0',
          'gathering.conversions.ykj10kmCenter.lon': '345.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '696.0',
          'gathering.conversions.ykj10kmCenter.lon': '366.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '697.0',
          'gathering.conversions.ykj10kmCenter.lon': '364.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum4',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumC'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '698.0',
          'gathering.conversions.ykj10kmCenter.lon': '343.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '700.0',
          'gathering.conversions.ykj10kmCenter.lon': '323.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '701.0',
          'gathering.conversions.ykj10kmCenter.lon': '322.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '701.0',
          'gathering.conversions.ykj10kmCenter.lon': '342.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '702.0',
          'gathering.conversions.ykj10kmCenter.lon': '342.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '704.0',
          'gathering.conversions.ykj10kmCenter.lon': '341.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '709.0',
          'gathering.conversions.ykj10kmCenter.lon': '337.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '711.0',
          'gathering.conversions.ykj10kmCenter.lon': '356.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '713.0',
          'gathering.conversions.ykj10kmCenter.lon': '336.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum3',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '715.0',
          'gathering.conversions.ykj10kmCenter.lon': '351.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '723.0',
          'gathering.conversions.ykj10kmCenter.lon': '341.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      },
      {
        aggregateBy: {
          'gathering.conversions.ykj10kmCenter.lat': '729.0',
          'gathering.conversions.ykj10kmCenter.lon': '338.0'
        },
        count: 1,
        atlasCodeMax: 'http://tun.fi/MY.atlasCodeEnum2',
        atlasClassMax: 'http://tun.fi/MY.atlasClassEnumB'
      }
    ]
    this.#data.speciesData = {
      vernacularName: { sv: 'grönsiska', fi: 'vihervarpunen', en: 'Eurasian Siskin' },
      scientificName: 'Carduelis spinus',
      intellectualRights: 'MZ.intellectualRightsCC-BY-4.0'
    }
    this.#data.atlasCode = {
      'MY.atlasCodeEnum1': {
        fi: '1 Epätodennäköinen pesintä: havaittu lajin yksilö, havainto ei viittaa pesintään.',
        en: '1 Breeding unlikely; Species detected in the grid during the breeding season, but almost certainly does not breed there',
        sv: '1 Osannolik häckning; Art observerad som vistats i rutan under häckningstid, men som högst sannolikt inte häckar där.'
      },
      'MY.atlasCodeEnum2': {
        en: '2 Possible breeding; A solitary bird detected once in suitable breeding habitat, and breeding of the species in the grid is possible',
        fi: '2 Mahdollinen pesintä: yksittäinen lintu kerran, on sopivaa pesimäympäristöä.',
        sv: '2 Möjlig häckning; Ensam fågel observerad en gång (t.ex. sjungande eller spelande hane) i för arten typisk häckningsbiotop, och artens häckning i rutan är möjlig.'
      },
      'MY.atlasCodeEnum3': {
        en: '3 Possible breeding; A pair detected once in a suitable breeding habitat, and breeding of the species in the grid is possible',
        sv: '3 Möjlig häckning; Par observerat en gång i lämplig häckningsbiotop, och artens häckning i rutan är möjlig.',
        fi: '3 Mahdollinen pesintä: pari kerran, on sopivaa pesimäympäristöä.'
      },
      'MY.atlasCodeEnum4': {
        en: '4 Probable breeding; A singing or a displaying male observed at the same site in different days',
        fi: '4 Todennäköinen pesintä: koiras reviirillä (esim. laulaa) eri päivinä.',
        sv: '4 Möjlig häckning; Sjungande, spelande eller uppträdande hane observerad på samma plats (dvs. på ett bestående revir) under flera dagar.'
      },
      'MY.atlasCodeEnum5': {
        sv: '5 Möjlig häckning; Observerats hona eller par på samma plats under flera dagar.',
        en: '5 Probable breeding; A female or a pair observed at the same site in different days',
        fi: '5 Todennäköinen pesintä: naaras tai pari reviirillä eri päivinä.'
      },
      'MY.atlasCodeEnum6': {
        sv: '6 Sannolik häckning; Fågel eller par setts',
        en: '6 Probable breeding; A bird or a pair observed',
        fi: '6 Todennäköinen pesintä: linnun tai parin havainto viittaa vahvasti pesintään.'
      },
      'MY.atlasCodeEnum61': {
        sv: '61 Sannolik häckning; Fågel eller par setts återkommande besöka en sannolik boplats',
        fi: '61 Todennäköinen pesintä: lintu tai pari käy usein todennäköisellä pesäpaikalla.',
        en: '61 Probable breeding; A bird or a pair observed visiting frequently at the probable nest'
      },
      'MY.atlasCodeEnum62': {
        sv: '62 Sannolik häckning; Fågel eller par setts bygga bo',
        en: '62 Probable breeding; A bird or a pair observed building a nest',
        fi: '62 Todennäköinen pesintä: lintu tai pari rakentaa pesää tai vie pesämateriaalia.'
      },
      'MY.atlasCodeEnum63': {
        fi: '63 Todennäköinen pesintä: lintu tai pari varoittelee ehkä pesästä tai poikueesta.',
        en: '63 Probable breeding; A bird or a pair observed giving alarm calls because of proximity to nest or brood',
        sv: '63 Sannolik häckning; Fågel eller par setts varna för att bo eller kull uppenbarligen är i närheten'
      },
      'MY.atlasCodeEnum64': {
        sv: '64 Sannolik häckning; Fågel eller par setts spelande vingskadad',
        fi: '64 Todennäköinen pesintä: lintu tai pari houkuttelee pois ehkä pesältä / poikueelta.',
        en: '64 Probable breeding; A bird or a pair observed displaying broken wing -act'
      },
      'MY.atlasCodeEnum65': {
        sv: '65 Sannolik häckning; Fågel eller par setts anfalla',
        en: '65 Probable breeding; A bird or a pair observed attacking the observer',
        fi: '65 Todennäköinen pesintä: lintu tai pari hyökkäilee, lähellä ehkä pesä / poikue.'
      },
      'MY.atlasCodeEnum66': {
        en: '66 Todennäköinen pesintä: asuttu tai koristeltu pesä, ei tietoa munista / poikasista.',
        fi: '66 Todennäköinen pesintä; Nähty pesä, jossa samanvuotista rakennusmateriaalia tai ravintojätettä; ei kuitenkaan varmaa todistetta munista tai poikasista',
        sv: '66 Sannolik häckning; Fågel eller par setts bo iakttaget med samma års bobyggnadsmaterial eller födorester; men ej säkra bevis på ägg eller ungar'
      },
      'MY.atlasCodeEnum7': {
        fi: '7 Varma pesintä: havaittu epäsuora todiste varmasta pesinnästä.',
        en: '7 Confirmed breeding; Indirect evidence of verified breeding detected',
        sv: '7 Säker häckning; Indirekt bevis på säker häckning konstaterat'
      },
      'MY.atlasCodeEnum71': {
        sv: '71 Säker häckning; Indirekt bevis på säker häckning konstaterat bo iakttaget där häckning ägt rum detta år, då boet innehöll ägg eller äggskal, lämningar av ungar, rester av fjäderslidor el. dyl',
        en: '71 Confirmed breeding; Indirect evidence of verified breeding detected: nest found with signs indicating that is has been used in the same year',
        fi: '71 Varma pesintä: nähty pesässä saman vuoden munia, kuoria, jäänteitä. Voi olla epäonnistunut.'
      },
      'MY.atlasCodeEnum72': {
        sv: '72 Säker häckning; Indirekt bevis på säker häckning konstaterat: fågel iakttagen som besöker bo på ett sätt som klart pekar på häckning (ägg eller ungar dock ej sedda; t.ex. fåglar häckande i håligheter eller högt)',
        en: '72 Confirmed breeding; Indirect evidence of verified breeding detected: a bird seen entering or coming out from the nest in a way that suggests breeding',
        fi: '72 Varma pesintä: käy pesällä pesintään viittaavasti. Munia / poikasia ei havaita (kolo tms.).'
      },
      'MY.atlasCodeEnum73': {
        fi: '73 Varma pesintä: juuri lentokykyiset poikaset tai untuvikot oletettavasti ruudulta.',
        en: '73 Confirmed breeding; Indirect evidence of verified breeding detected: fledglings or young detected so that they can be assumed to have hatched within the grid',
        sv: '73 Säker häckning; Indirekt bevis på säker häckning konstaterat: nyligen flygga ungar eller dunungar observerade, när dessa kan anses vara födda i rutan'
      },
      'MY.atlasCodeEnum74': {
        fi: '74 Varma pesintä: emo kantaa ruokaa tai poikasten ulosteita, pesintä oletettavasti ruudulla.',
        sv: '74 Säker häckning; Indirekt bevis på säker häckning konstaterat: förälder iakttagen bärande föda till ungar, eller ungars avföring; boet kan antas ligga inom rutan',
        en: '74 Confirmed breeding; Indirect evidence of verified breeding detected: a parent carrying food to nestlings or faeces of nestlings away from the nest'
      },
      'MY.atlasCodeEnum75': {
        en: '75 Varma pesintä: nähty pesässä hautova emo.',
        fi: '75 Varma pesintä; Havaittu epäsuora todiste varmasta pesinnästä: nähty pesässä hautova emo',
        sv: '75 Säker häckning; Indirekt bevis på säker häckning konstaterat: förälder sedd ruvande i boet'
      },
      'MY.atlasCodeEnum8': {
        fi: '8 Varma pesintä: havaittu suora todiste varmasta pesinnästä.',
        sv: '8 Säker häckning; Direkt bevis på säker häckning konstaterat',
        en: '8 Confirmed breeding; Direct evidence of verified breeding detected'
      },
      'MY.atlasCodeEnum81': {
        sv: '81 Säker häckning; Direkt bevis på säker häckning konstaterat: ungars läten hörda från boet',
        fi: '81 Varma pesintä: kuultu poikasten ääntelyä pesässä (kolo / pesä korkealla).',
        en: '81 Confirmed breeding; Direct evidence of a verified breeding detected: begging or other calls of nestlings heard from the nest'
      },
      'MY.atlasCodeEnum82': {
        fi: '82 Varma pesintä: nähty pesässä munia tai poikasia.',
        en: '82 Confirmed breeding; Direct evidence of a verified breeding detected: a nest found with eggs or nestlings',
        sv: '82 Säker häckning; Direkt bevis på säker häckning konstaterat: bo iakttaget med ägg eller ungar'
      }
    }
    this.#data.atlasClass = {
      'MY.atlasClassEnumA': {
        en: 'Unlikely breeding',
        fi: 'Epätodennäköinen pesintä',
        sv: 'Osannolik häckning'
      },
      'MY.atlasClassEnumB': {
        en: 'Possible breeding',
        fi: 'Mahdollinen pesintä',
        sv: 'Möjlig avel'
      },
      'MY.atlasClassEnumC': {
        fi: 'Todennäköinen pesintä',
        en: 'Probable breeding',
        '': 'Trolig avel',
        sv: ''
      },
      'MY.atlasClassEnumD': {
        fi: 'Varma pesintä',
        en: 'Confirmed breeding',
        sv: 'Bekräftad avel'
      }
    }
  }

  getListOfDistinctBirdsForGridAndActiveAtlas(grid, page) {
    return Promise.resolve({ 
      data: {
        results: this.#data.gridData
      }
    })
  }

  getGridAndBreedingdataForSpeciesAndActiveAtlas(speciesId) {
    return Promise.resolve({
      data: {
        results: this.#data.breedingData
      }
    })
  }

  getSpecies(speciesId) {
    return Promise.resolve({
      data: this.#data.speciesData
    })
  }

  getEnumRange(range) {
    if (range === 'MY.atlasCodeEnum') {
      return Promise.resolve({
        data: this.#data.atlasCode
      })
    } else if (range === 'MY.atlasClassEnum') {
      return Promise.resolve({
        data: this.#data.atlasClass
      })
    } else {
      return Promise.reject()
    }
  }
}

module.exports = ApiDao
