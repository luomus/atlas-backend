const MapService = require('../main/domain/maps/map_service')
const createAtlasMap = require('../main/domain/maps/create_atlas_map')
const GridDao = require('../main/dao/grid_dao')
const BirdDao = require('../main/dao/bird_dao')
const BirdGridDao = require('../main/dao/bird_grid_dao')
const fs = require('fs')

jest.mock('../main/dao/grid_dao')
jest.mock('../main/dao/bird_dao')
jest.mock('../main/dao/bird_grid_dao')

let mapService
let configObject
let s
let d

beforeEach(() => {
  const configFile = fs.readFileSync('atlas-config.json')
  configObject = JSON.parse(configFile)
  const gridDao = new GridDao()
  const birdDao = new BirdDao()
  const birdGridDao = new BirdGridDao()
  const geoJsonArray = readBaseMapFiles()
  let gridArray
  let atlasMap
  gridDao.getAllGrids().then((returnedGridArray) => {
    birdGridDao.getBySpeciesFromAtlas3(27697).then((data) => {
      birdDao.getSpeciesById(27697).then((species) => {
        gridArray = returnedGridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
        d = data.map((datapoint) => ({...datapoint, id: datapoint.grid_id}))
        atlasMap = createAtlasMap(gridArray, geoJsonArray, configObject)
        mapService = new MapService(atlasMap, configObject)
        s = species
      })
    })
  })  
})


describe('Map is drawn correctly', () => {
  // test('Image type is correct', () => {
  //   const image = mapService.getSpeciesMap(d, s, undefined, 'svg', undefined, undefined)
  //   expect(image).toBeInstanceOf('image/svg')
  // })
  test('Correct data points are visible', () => {
    const image = mapService.getSpeciesMap(d, s, undefined, 'svg', undefined, undefined)
    expect(image).toContain(`fill="${configObject.legend.colourBox4.fill}" display="block" id="768326"`)
  })  
})


// describe('Map legend is shown correctly', () => {
//   test('Legend has correct species name', () => {
    
//   })

//   test('Legend has correct language', () => {
    
//   })

//   test('Legend box is shown', () => {
    
//   })
// })


readBaseMapFiles = function() {
  let geoJsonArray = []
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