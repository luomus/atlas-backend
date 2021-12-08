const MapService = require('../main/domain/maps/map_service')
const createAtlasMap = require('../main/domain/maps/create_atlas_map')
const GridDao = require('../main/dao/grid_dao')
const SpeciesDao = require('../main/dao/species_dao')
const AtlasDataDao = require('../main/dao/atlas_data_dao')
const fs = require('fs')
const {DOMImplementation, XMLSerializer, DOMParser} = require('xmldom')


jest.mock('../main/dao/grid_dao')
jest.mock('../main/dao/species_dao')
jest.mock('../main/dao/atlas_data_dao')

let mapService
let config
let s
let d

beforeEach(() => {
  const configFile = fs.readFileSync('atlas-config.json')
  config = JSON.parse(configFile)
  const gridDao = new GridDao()
  const speciesDao = new SpeciesDao()
  const atlasDataDao = new AtlasDataDao()
  const geoJsonArray = readBaseMapFiles()
  let gridArray
  let atlasMap
  gridDao.getAllGrids().then((returnedGridArray) => {
    atlasDataDao.getDataForSpeciesAndAtlas(27697, 3).then((data) => {
      speciesDao.getSpeciesById(27697).then((species) => {
        gridArray = returnedGridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
        d = data.map((datapoint) => ({...datapoint, id: datapoint.grid_id}))
        atlasMap = createAtlasMap(gridArray, geoJsonArray, config)
        mapService = new MapService(atlasMap, config)
        s = species.map((datapoint) => ({...datapoint}))
      })
    })
  })
})


describe('Map is drawn correctly', () => {
  test('Image type is correct', () => {
    const image = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, undefined)
    expect(image).toContain(`</svg>`)
    // expect(image).toBeInstanceOf('image/svg')
  })
  test('Correct data points are visible', () => {
    const image = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, undefined)
    expect(image).toContain(`fill="${config.legend.colourBox4.fill}" display="block" id="768326"`)
  })
})


describe('Map legend is shown correctly', () => {
  test('Legend has correct species name', () => {
    const imageText = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, 'fi')
    const image = parseDocument(imageText)
    expect(image.getElementById('speciesFI').textContent).toEqual(s[0].speciesFI)
  })

  test('Legend has correct language', () => {
    const imageText = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, 'en')
    const image = parseDocument(imageText)
    expect(image.getElementById('atlasTitle').textContent).toEqual(config.legend.atlasTitle.textEN)
  })

  test('Legend box is shown', () => {
    const imageText = mapService.getSpeciesMap(d, s[0], undefined, 'svg', undefined, undefined)
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
