const MapService = require('../main/domain/maps/mapService')
const createAtlasMap = require('../main/domain/maps/createAtlasMap')
const ApiDao = require('../main/dao/apiDao')
const GridDao = require('../main/dao/gridDao')
const AtlasGridSpeciesDataDao = require('../main/dao/atlasGridSpeciesDataDao')
const AtlasGridDao = require('../main/dao/atlasGridDao')
const fs = require('fs')
const SvgImage = require('../main/domain/maps/svgImage')
const {DOMImplementation, XMLSerializer, DOMParser} = require('xmldom')
const { text } = require('express')

jest.mock('../main/dao/apiDao')
jest.mock('../main/dao/gridDao')
jest.mock('../main/dao/atlasGridSpeciesDataDao')
jest.mock('../main/dao/atlasGridDao')

let mapService
let config
let atlasData
let speciesData
let gridData

beforeEach(async () => {
  const configFile = fs.readFileSync('atlas-config.json')
  config = JSON.parse(configFile)
  const geoJsonArray = readBaseMapFiles()
  const apiDao = new ApiDao()
  const gridDao = new GridDao()
  const atlasGridSpeciesDataDao = new AtlasGridSpeciesDataDao()
  const returnedGridArray = await gridDao.getAll().catch((e) => [])
  const breedingData = await atlasGridSpeciesDataDao.getDataForSpeciesAndAtlas('MX.36287', 4).catch((e) => [])
  speciesData = (await apiDao.getSpecies('MX.36287'))
  const gridArray = returnedGridArray.map((rect) => ({...rect, n: rect.coordinates.split(':')[0], e: rect.coordinates.split(':')[1]}))
  atlasData = breedingData.map((datapoint) => ({...datapoint, id: datapoint.grid}))
  atlasMap = createAtlasMap(gridArray, geoJsonArray, config)
  mapService = new MapService(atlasMap, config)
  gridData = []
})


describe('Map is drawn correctly', () => {
  test('Image type is correct', () => {
    const image = mapService.getSpeciesMap(atlasData, [], speciesData, undefined, 'svg', undefined, undefined, 4, false)
    expect(image).toContain(`</svg>`)
  })
  test('Correct data points are visible', () => {
    const imageText = mapService.getSpeciesMap(atlasData, [], speciesData, undefined, 'svg', undefined, undefined, 4, false)
    const image = SvgImage(imageText)
    expect(image.returnElementById('http://tun.fi/YKJ.667:337').getAttribute('class')).toEqual('cir classB')
  })

  /** 
  test('Correct activity category colours are visibe', () => {
    const imageText = mapService.getSpeciesMap(atlasData, [], speciesData, undefined, 'svg', undefined, undefined, 4, false)
    const image = parseDocument(imageText)
    expect(image.getElementById('667317bg').getAttribute('fill')).toEqual(config.activityCategoryColour.category5)
  })
  */
})

// eslint-disable-next-line max-lines-per-function
describe('Map legend is shown correctly', () => {
  test('Legend has correct species name', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData, undefined, 'svg', undefined, 'fi', 4)
    const image = SvgImage(imageText)
    expect(image.returnElementById('speciesFI').textContent).toEqual(speciesData.vernacularName.fi)
  })

  test('Legend has correct atlas name', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData, undefined, 'svg', undefined, 'fi', 4)
    const image = SvgImage(imageText)
    expect(image.returnElementById('atlasTitle').textContent).toEqual(config.legend.atlasTitle.textFIAtlas4)
  })

  test('Legend has correct language', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData, undefined, 'svg', undefined, 'en', 4)
    const image = SvgImage(imageText)
    expect(image.returnElementById('breedingColourTitle').textContent).toEqual(config.legend.breedingColourTitle.textEN)
  })

  test('Legend box is shown', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData, undefined, 'svg', undefined, undefined, 4)
    const image = SvgImage(imageText)
    expect(image.returnElementById('breedingColourBox').getAttribute('display')).toEqual('block')
  })

  test('Legend colour boxes have correct classes', () => {
    const imageText = mapService.getSpeciesMap(atlasData, gridData, speciesData, undefined, 'svg', undefined, undefined, 4, true)
    const image = SvgImage(imageText)
    expect(image.returnElementById('breedingColourBox3').getAttribute('class')).toEqual('classC')
    expect(image.returnElementById('activityColourBox2').getAttribute('class')).toEqual('category2')
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
