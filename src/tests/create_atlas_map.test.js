const createAtlasMap = require('../main/domain/maps/create_atlas_map')
jest.mock('../main/dao/grid_dao')
const GridDao = require('../main/dao/grid_dao')

let atlasMap
let serializedMap
let gridArray
const alignmentCoordE = 32
const alignmentCoordN = 68

beforeEach(() => {
  const gridDao = new GridDao()
  gridDao.getAllGrids().then((returnedGridArray) => {
    gridArray = returnedGridArray.map((rect) => ({...rect, n: rect.coordinateN, e: rect.coordinateE}))
    atlasMap = createAtlasMap(gridArray, geoJsonArray)
    serializedMap = atlasMap.serialize()
  })
})

test('Created map contains a circle element for each square in gridArray', () => {
  gridArray.forEach((rect) => expect(serializedMap).toContain(`circle id="${rect.id}"`))
})

test('Created map contains all elements from geoJsons', () => {
  expect(serializedMap).toContain(`id="${alignmentCoordE}"`)
  expect(serializedMap).toContain(`id="${alignmentCoordE + 1}"`)
  expect(serializedMap).toContain(`id="${alignmentCoordE + 2}"`)
  expect(serializedMap).toContain(`id="${alignmentCoordN}"`)
  expect(serializedMap).toContain(`id="${alignmentCoordN + 1}"`)
})

test('Created map contains groups from geoJsons', () => {
  geoJsonArray.forEach((geoJson) => expect(serializedMap).toContain(`g id="${geoJson.id}"`))
})

test('Overlay and base map are aligned correctly', () => {
  const alignmentCircleId = `${alignmentCoordN}0${alignmentCoordE}0`
  const overlayX = atlasMap.getElementCoordsById(alignmentCircleId).x
  const overlayY = atlasMap.getElementCoordsById(alignmentCircleId).y
  const baseMapX = atlasMap.getElementCoordsById(alignmentCoordE).x
  const baseMapY = atlasMap.getElementCoordsById(alignmentCoordN).y
  const overlayGroup = atlasMap.getElementById('overlay')
  const transform = overlayGroup.getAttribute('transform')
  const scale = parseFloat(transform.split('(')[1].replace(/[a-zA-Z()]/g, ''))
  const translate = transform.split('(')[2].replace(/[a-zA-Z()]/g, '')
  const translateX = parseFloat(translate.split(' ')[0])
  const translateY = parseFloat(translate.split(' ')[1])
  const circleRadius = parseFloat(atlasMap.getElementById(alignmentCircleId).getAttribute('r'))

  const overlayGlobalX = (overlayX + translateX - circleRadius) * scale
  const overlayGlobalY = (overlayY + translateY + circleRadius) * scale

  expect(overlayGlobalX).toBeCloseTo(baseMapX)
  expect(overlayGlobalY).toBeCloseTo(baseMapY)
})

/* eslint-disable */
const geoJsonArray = [
  {
    geoJson: {
      "type": "FeatureCollection",
      "name": "geoJson1",
      "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::3067" } },
      "features": [
        { "type": "Feature", "properties": { "lineID": alignmentCoordE, "typeID": "E", "ETRS_N1": 6597229.329, "ETRS_E1": 599790.715, "ETRS_N2": 7796745.609, "ETRS_E2": 599788.497 }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 599790.714999999967404, 6597229.329 ], [ 599788.496999999973923, 7796745.609000000171363 ] ] ] } },
        { "type": "Feature", "properties": { "lineID": alignmentCoordE + 1, "typeID": "E", "ETRS_N1": 6597229.73, "ETRS_E1": 699750.346, "ETRS_N2": 7796746.11, "ETRS_E2": 699746.911 }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 699750.346000000019558, 6597229.730000000447035 ], [ 699746.910999999963678, 7796746.110000000335276 ] ] ] } },
        { "type": "Feature", "properties": { "lineID": alignmentCoordE + 2, "typeID": "E", "ETRS_N1": 6597230.224, "ETRS_E1": 799710.013, "ETRS_N2": 7796746.36, "ETRS_E2": 799706.416 }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 799710.01300000003539, 6597230.224000000394881 ], [ 799706.415999999968335, 7796746.360000000335276 ] ] ] } },
      ]
    },
    id: "baseMapGroup1",
  },
  {
    geoJson: {
      "type": "FeatureCollection",
      "name": "geoJson2",
      "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::3067" } },
      "features": [
        { "type": "Feature", "properties": { "lineID": alignmentCoordN, "typeID": "N", "ETRS_N1": 6797145.805, "ETRS_E1": 31.099, "ETRS_N2": 6797149.646, "ETRS_E2": 799709.011 }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 31.099, 6797145.804999999701977 ], [ 799709.011000000056811, 6797149.645999999716878 ] ] ] } },
        { "type": "Feature", "properties": { "lineID": alignmentCoordN + 1 , "typeID": "N", "ETRS_N1": 6897105.864, "ETRS_E1": 30.208, "ETRS_N2": 6897109.781, "ETRS_E2": 799708.093 }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 30.208, 6897105.864 ], [ 799708.093, 6897109.781000000424683 ] ] ] } },
      ]
    },
    id: "baseMapGroup2",
  },
]
/* eslint-enable */
