const MapService = require('../main/domain/maps/map_service')
const createAtlasMap = require('../main/domain/maps/create_atlas_map')
const GridDao = require('../main/dao/grid_dao')
const SpeciesDao = require('../main/dao/species_dao')
const AtlasDataDao = require('../main/dao/atlas_data_dao')
const AtlasGridDao = require('../main/dao/atlas_grid_dao')
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
let atlasGrid

beforeEach(() => {
  const configFile = fs.readFileSync('atlas-config.json')
  config = JSON.parse(configFile)
  const gridDao = new GridDao()
  const speciesDao = new SpeciesDao()
  const atlasDataDao = new AtlasDataDao()
  const atlasGridDao = new AtlasGridDao()
  const geoJsonArray = readBaseMapFiles()
  let gridArray
  let atlasMap

  return async (req, res) => {
    const {speciesId, atlasId} = req.params
    const returnedGridArray = await gridDao.getAll().catch(e => [])
    const breedingData = await atlasDataDao.getGridAndBreedingdataForSpeciesAndAtlas(speciesId, atlasId).catch(e => [])
    const species = await speciesDao.getById(speciesId).catch(e => [])
    atlasGrid = await atlasGridDao.getAllBirdAtlasGridInfoByAtlas(atlasId).catch(e => [])
    gridArray = returnedGridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
    atlasData = breedingData.map((datapoint) => ({...datapoint, id: datapoint.grid_id}))
    atlasMap = createAtlasMap(gridArray, geoJsonArray, config)
    mapService = new MapService(atlasMap, config)
    speciesData = species.map((datapoint) => ({...datapoint}))
  }
})


describe('Map is drawn correctly', () => {
  test('Image type is correct', () => {
    const image = mapService.getSpeciesMap(d, atlasGrid, s[0], undefined, 'svg', undefined, undefined, 3)
    expect(image).toContain(`</svg>`)
    // expect(image).toBeInstanceOf('image/svg')
  })
  test('Correct data points are visible', () => {
    const image = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, undefined, 3)
    expect(image).toContain(`fill="${config.legend.colourBox4.fill}" display="block" id="768326"`)
  })
})

// eslint-disable-next-line max-lines-per-function
describe('Map legend is shown correctly', () => {
  test('Legend has correct species name', () => {
    const imageText = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, 'fi', 3)
    const image = parseDocument(imageText)
    expect(image.getElementById('speciesFI').textContent).toEqual(s[0].speciesFI)
  })

  test('Legend has correct atlas name', () => {
    const imageText = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, 'fi', 2)
    const image = parseDocument(imageText)
    expect(image.getElementById('atlasTitle').textContent).toEqual(config.legend.atlasTitle.textFIAtlas2)
  })

  test('Legend has correct language', () => {
    const imageText = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, 'en', 3)
    const image = parseDocument(imageText)
    expect(image.getElementById('breedingColourTitle').textContent).toEqual(config.legend.breedingColourTitle.textEN)
  })

  test('Legend box is shown', () => {
    const imageText = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, undefined, 3)
    const image = parseDocument(imageText)
    expect(image.getElementById('breedingColourBox').getAttribute('display')).toEqual('block')
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
