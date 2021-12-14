const MapService = require('../main/domain/maps/map_service')
const createAtlasMap = require('../main/domain/maps/create_atlas_map')
const GridDao = require('../main/dao/grid_dao')
const SpeciesDao = require('../main/dao/species_dao')
const AtlasDataDao = require('../main/dao/atlas_data_dao')
const GridDataDao = require('../main/dao/atlas_grid_dao')
const fs = require('fs')
const {DOMImplementation, XMLSerializer, DOMParser} = require('xmldom')


jest.mock('../main/dao/grid_dao')
jest.mock('../main/dao/species_dao')
jest.mock('../main/dao/atlas_data_dao')
jest.mock('../main/dao/atlas_grid_dao')

let mapService
let config
let speciesData
let atlasData
let gridData

beforeEach(async () => {
  const configFile = fs.readFileSync('atlas-config.json')
  config = JSON.parse(configFile)
  const gridDao = new GridDao()
  const speciesDao = new SpeciesDao()
  const atlasDataDao = new AtlasDataDao()
  const gridDataDao = new GridDataDao()
  const geoJsonArray = readBaseMapFiles()
  const returnedGridArray = await gridDao.getAll().catch(e => [])
  const breedingData = await atlasDataDao.getGridAndBreedingdataForSpeciesAndAtlas(27697, 3).catch(e => [])
  const species = await speciesDao.getById(27697).catch(e => [])
  const atlasGrid = await gridDataDao.getAllGridInfoForAtlas(3).catch(e => [])
  const gridArray = returnedGridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
  atlasData = breedingData.map((datapoint) => ({...datapoint, id: datapoint.grid_id}))
  speciesData = species.map((datapoint) => ({...datapoint}))
  gridData = atlasGrid.map((datapoint) => ({...datapoint}))
  atlasMap = createAtlasMap(gridArray, geoJsonArray, config)
  mapService = new MapService(atlasMap, config)
})


describe('Map is drawn correctly', () => {
  test('Image type is correct', () => {
    const image = mapService.getSpeciesMap(atlasData, gridData, speciesData[0], undefined, 'svg', undefined, undefined, 3)
    expect(image).toContain(`</svg>`)
  })
  test('Correct data points are visible', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData[0], undefined, 'svg', undefined, undefined, 3)
    const image = parseDocument(imageText)
    expect(image.getElementById(768326).getAttribute('fill')).toEqual(config.breedingCategoryColour.category4)
  })
  test('Correct activity category colours are visibe', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData[0], undefined, 'svg', undefined, undefined, 3)
    const image = parseDocument(imageText)
    expect(image.getElementById('667317bg').getAttribute('fill')).toEqual(config.activityCategoryColour.category5)
  })
})

// eslint-disable-next-line max-lines-per-function
describe('Map legend is shown correctly', () => {
  test('Legend has correct species name', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData[0], undefined, 'svg', undefined, 'fi', 3)
    const image = parseDocument(imageText)
    expect(image.getElementById('speciesFI').textContent).toEqual(speciesData[0].speciesFI)
  })

  test('Legend has correct atlas name', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData[0], undefined, 'svg', undefined, 'fi', 2)
    const image = parseDocument(imageText)
    expect(image.getElementById('atlasTitle').textContent).toEqual(config.legend.atlasTitle.textFIAtlas2)
  })

  test('Legend has correct language', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData[0], undefined, 'svg', undefined, 'en', 3)
    const image = parseDocument(imageText)
    expect(image.getElementById('breedingColourTitle').textContent).toEqual(config.legend.breedingColourTitle.textEN)
  })

  test('Legend box is shown', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData[0], undefined, 'svg', undefined, undefined, 3)
    const image = parseDocument(imageText)
    expect(image.getElementById('breedingColourBox').getAttribute('display')).toEqual('block')
  })

  test('Legend colour boxes have correct colour', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData[0], undefined, 'svg', undefined, undefined, 3)
    const image = parseDocument(imageText)
    expect(image.getElementById('breedingColourBox3').getAttribute('fill')).toEqual(config.breedingCategoryColour.category3)
    expect(image.getElementById('activityColourBox2').getAttribute('fill')).toEqual(config.activityCategoryColour.category2)
  })
})


readBaseMapFiles = function() {
  const geoJsonArray = []
  try {
    const baseMapGrid = fs.readFileSync('src/main/geojson/YKJ100km.geojson')
    const finnishBorders = fs.readFileSync('src/main/geojson/finnish_borders.geojson')
    geoJsonArray.push({
      geoJson: JSON.parse(baseMapGrid),
      id: 'YKJ100km',
    })
    geoJsonArray.push({
      geoJson: JSON.parse(finnishBorders),
      id: 'borders',
    })
  } catch (err) {
    console.error(err)
  }
  return geoJsonArray
}

function parseDocument(svgDoc) {
  const domParser = new DOMParser()
  return domParser.parseFromString(svgDoc, 'image/svg+xml')
}
