const SvgImage = require('./svgImage.js')
const geojson2svg = require('geojson2svg')

/**
 * Creates the Atlas map grid and map legend without data.
 * @returns {SvgImage}
 * @constructor
 */
function createAtlasMap(gridArray, geoJsonArray, config) {
  const overlayPadding = 15
  const overlayCircleRadius = 0.5
  const YKJgridRatio = 10
  const numberOfYKJsquaresE = 8

  let baseMap = createGlobalStyleDoc(SvgImage())
  baseMap = drawBaseMap(geoJsonArray, baseMap)
  const overlay = drawGrid(gridArray, SvgImage())
  const scaleFactor = getScaleFactorForMerge(baseMap, overlay)
  const atlasMap = baseMap.mergeSvg(moveOverlay(baseMap, overlay), scaleFactor)

  return atlasMap

  function createGlobalStyleDoc(svgImage) {
    svgImage.addGlobalStyle(`
      text {
        font-family: Helvetica, Arial, sans-serif;
      }

      .back {
          width: 1px;
          height: 1px;
          display: block;
          opacity: 0.7;
      }

      .cir {
          display: block;
      }

      .black {
          fill: black;
          display: none;
      }

      .category5 {
          fill: ${config.activityCategoryColour.category5};
      }
      .category4 {
          fill: ${config.activityCategoryColour.category4};
      }
      .category3 {
          fill: ${config.activityCategoryColour.category3};
      }
      .category2 {
          fill: ${config.activityCategoryColour.category2};
      }
      .category1 {
          fill: ${config.activityCategoryColour.category1};
      }
      .category0 {
          fill: ${config.activityCategoryColour.category0};
      }

      .classD, .classC, .classB {
          stroke-width: 0.03;
          stroke: #000;
      }

      .classD {
          fill: ${config.atlasClassColour.categoryD};
      }
      .classC {
          fill: ${config.atlasClassColour.categoryC};
      }
      .classB {
          fill: ${config.atlasClassColour.categoryB};
          stroke-width: 0.06;
          stroke: #000;
      }
      .classA {
        fill: rgba(124,240,10,0.0) 
      }`
    )

    return svgImage
  }

  function drawBaseMap(geoJsonArray, svgImage) {
    svgImage.setBackgroundColour(config.mapBackground)
    const converterOptions = getConverterOptions(geoJsonArray)
    const converter = geojson2svg(converterOptions)
    let color
    geoJsonArray.forEach((geoJsonObj) => {
      const svgStringArray = converter.convert(geoJsonObj.geoJson)
      if (geoJsonObj.id === 'YKJ100km')
        color = 'darkgrey'
      else
        color = 'black'

      const propertyMap =
        {'id': geoJsonObj.id, 'class': 'baseMap', 'stroke': color, 'stroke-width': '0.15', 'fill-opacity': 0}
      svgImage.addElement('g', propertyMap)
      svgStringArray.forEach((str) => svgImage.addElementFromString(str, geoJsonObj.id))
    })
    const minMaxCoords = svgImage.getMinMaxCoords()
    const width = Math.ceil(minMaxCoords.maxX - minMaxCoords.minX)
    const height = Math.ceil(minMaxCoords.maxY - minMaxCoords.minY)
    svgImage.setDimensions(width, height)
    svgImage.setViewBox(0, 0, width, height)
    return svgImage
  }

  function getConverterOptions(geoJsonArray) {
    let [minN, minE] = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
    let [maxN, maxE] = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    const geoJsons = geoJsonArray.map((obj) => obj.geoJson)
    geoJsons.forEach((geoJson) => {
      const features = geoJson.features
      const n1 = features.map((f) => f.properties.ETRS_N1)
      n1.forEach((n) => {minN = (typeof n !== 'undefined' && n < minN) ? n : minN})
      const e1 = features.map((f) => f.properties.ETRS_E1)
      e1.forEach((e) => {minE = (typeof e !== 'undefined' && e < minE) ? e : minE})
      const n2 = features.map((f) => f.properties.ETRS_N2)
      n2.forEach((n) => {maxN = (typeof n !== 'undefined' && n > maxN) ? n : maxN})
      const e2 = features.map((f) => f.properties.ETRS_E2)
      e2.forEach((e) => {maxE = (typeof e !== 'undefined' && e > maxE) ? e : maxE})
    })
    const converterOptions = {
      mapExtent: {bottom: minN, left: minE, top: maxN, right: maxE},
      attributes: [{property: 'properties.lineID', type: 'dynamic', key: 'id'}, 'properties.typeID'],
    }
    return converterOptions
  }

  function moveOverlay(baseMap, overlay) {
    const overlayTranslationCoords = getOverlayTranslationCoords(baseMap, overlay)
    const transformOptions = `translate\(${overlayTranslationCoords.x} ${overlayTranslationCoords.y}\)`
    overlay.setAttributesOfElement('overlay', {transform: transformOptions})
        .setAttributesOfElement('background', {transform: transformOptions})
    return overlay
  }

  function getOverlayTranslationCoords(baseMap, overlay) {
    const baseMapScaleFactor = YKJgridRatio / (baseMap.getWidth() / numberOfYKJsquaresE)
    const dataMapCoords = overlay.getElementCoordsById(config.alignmentCoordinates.combined)
    const baseMapX = Math.ceil(baseMap.getElementCoordsById(config.alignmentCoordinates.e).x * baseMapScaleFactor)
    const baseMapY = Math.ceil(baseMap.getElementCoordsById(config.alignmentCoordinates.n).y * baseMapScaleFactor)
    const translateX = baseMapX - dataMapCoords.x + overlayCircleRadius
    const translateY = baseMapY - dataMapCoords.y - overlayCircleRadius
    return {x: translateX, y: translateY}
  }

  function getScaleFactorForMerge(baseMap, overlay) {
    const baseMapX1 = baseMap.getElementCoordsById(config.alignmentCoordinates.e).x
    const baseMapX2 = baseMap.getElementCoordsById(config.alignmentCoordinates.e + 1).x
    const baseMapDistance = Math.abs(baseMapX1 - baseMapX2)
    const dataMapX1 = overlay.getElementCoordsById(config.alignmentCoordinates.combined).x
    const dataMapX2 = overlay.getElementCoordsById(config.alignmentCoordinates.combined10).x
    const dataMapDistance = Math.abs(dataMapX1 - dataMapX2)
    return baseMapDistance / dataMapDistance
  }

  // eslint-disable-next-line max-lines-per-function
  function drawGrid(gridArray, svgImage) {
    const verticalFlipMatrix = [[-1, 0], [0, 1]]
    const rotate180ccwMatrix = [[-1, 0], [0, -1]]
    const transformationMatrix = multiplyMatrices(verticalFlipMatrix, rotate180ccwMatrix)
    const minMaxValues = transformCoordsByMatrix(gridArray, transformationMatrix)
    const shiftCoordsToStartFromZero = (rect) => ({'id': rect.id,
      'e': rect.e - minMaxValues.minE, 'n': rect.n - minMaxValues.minN})
    const svgGridArray = gridArray.map(shiftCoordsToStartFromZero)
    const width = Math.abs(minMaxValues.maxE - minMaxValues.minE)
    const height = Math.abs(minMaxValues.maxN - minMaxValues.minN)
    svgImage.setDimensions(width + overlayPadding, height + overlayPadding)
        .setViewBox(0, 0, width + overlayPadding, height + overlayPadding)
        .addElement('g', {id: 'background'})
        .addElement('g', {id: 'overlay'})
    drawLegend(svgImage)
    svgGridArray.forEach((rect) => {
      const circlePropertyMap =
          Object.assign(config.gridCircle, {id: rect.id, cx: (rect.e), cy: (rect.n), r: overlayCircleRadius})
      const backgroundPropertyMap =
          Object.assign(config.gridBackground, {'id': (rect.id + 'bg'), 'x': (rect.e - 0.5), 'y': (rect.n - 0.5)})
      return svgImage
          .addElement('rect', backgroundPropertyMap, 'background')
          .addElement('circle', circlePropertyMap, 'overlay')
    })
    return svgImage

    function transformCoordsByMatrix(coordArray, matrix) {
      let [minE, minN] = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
      let [maxE, maxN] = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
      for (let i = 0; i < coordArray.length; i++) {
        const coordMatrix = [[coordArray[i].e, coordArray[i].n]]
        const transformedCoords = multiplyMatrices(coordMatrix, matrix)
        coordArray[i].e = transformedCoords[0][0]
        coordArray[i].n = transformedCoords[0][1]
        if (coordArray[i].e < minE) minE = coordArray[i].e
        if (coordArray[i].n < minN) minN = coordArray[i].n
        if (coordArray[i].e > maxE) maxE = coordArray[i].e
        if (coordArray[i].n > maxN) maxN = coordArray[i].n
      }
      return {minE, minN, maxE, maxN}
    }

    function multiplyMatrices(m1, m2) {
      const result = [];
      for (let i = 0; i < m1.length; i++) {
        result[i] = [];
        for (let j = 0; j < m2[0].length; j++) {
          let sum = 0;
          for (let k = 0; k < m1[0].length; k++)
            sum += m1[i][k] * m2[k][j];

          result[i][j] = sum;
        }
      }
      return result;
    }
  }

  /**
   * Draws map legend with default settings.
   * @param {SvgImage} svgImage
   * @returns {SvgImage}
   */
  function drawLegend(svgImage) {
    svgImage.addElement('g', {id: 'legendBox'})
        .addElement('g', {id: 'legend'})
        .addElement('rect', config.legendBox.textBox, 'legendBox')
        .addElement('text', config.legend.atlasTitle, 'legend')
        .addElement('text', config.legend.speciesFI, 'legend')
        .addElement('text', config.legend.speciesSCI, 'legend')
        .addElement('text', config.legend.speciesSV, 'legend')
        .addElement('text', config.legend.speciesEN, 'legend')
    svgImage = drawBreedingLegend(svgImage)
    svgImage = drawActivityLegend(svgImage)
    return svgImage
  }

  /**
   * Draws species data legend.
   * @param {SvgImage} svgImage 
   * @returns {SvgImage}
   */
  function drawBreedingLegend(svgImage) {
    svgImage.addElement('g', {id: 'breedingLegend'})
        .addElement('rect', config.legendBox.breedingColourBox, 'breedingLegend')
        .addElement('text', config.legend.breedingColourTitle, 'breedingLegend')
        .addElement('rect', config.legend.breedingColourBox4, 'breedingLegend')
        .setAttributesOfElement(config.legend.breedingColourBox4.id, {class: 'classD'})
        .addElement('text', config.legend.breedingColourTitle4, 'breedingLegend')
        .addElement('rect', config.legend.breedingColourBox3, 'breedingLegend')
        .setAttributesOfElement(config.legend.breedingColourBox3.id, {class: 'classC'})
        .addElement('text', config.legend.breedingColourTitle3, 'breedingLegend')
        .addElement('rect', config.legend.breedingColourBox2, 'breedingLegend')
        .setAttributesOfElement(config.legend.breedingColourBox2.id, {class: 'classB'})
        .addElement('text', config.legend.breedingColourTitle2, 'breedingLegend')
    return svgImage
  }

  function drawActivityLegend(svgImage) {
    svgImage.addElement('g', {id: 'activityLegend'})
        .addElement('rect', config.legendBox.activityColourBox, 'activityLegend')
        .addElement('text', config.legend.activityColourTitle, 'activityLegend')
        .addElement('rect', config.legend.activityColourBox5, 'activityLegend')
        .setAttributesOfElement(config.legend.activityColourBox5.id, {class: 'category5'})
        .addElement('text', config.legend.activityColourTitle5, 'activityLegend')
        .addElement('rect', config.legend.activityColourBox4, 'activityLegend')
        .setAttributesOfElement(config.legend.activityColourBox4.id, {class: 'category4'})
        .addElement('text', config.legend.activityColourTitle4, 'activityLegend')
        .addElement('rect', config.legend.activityColourBox3, 'activityLegend')
        .setAttributesOfElement(config.legend.activityColourBox3.id, {class: 'category3'})
        .addElement('text', config.legend.activityColourTitle3, 'activityLegend')
        .addElement('rect', config.legend.activityColourBox2, 'activityLegend')
        .setAttributesOfElement(config.legend.activityColourBox2.id, {class: 'category2'})
        .addElement('text', config.legend.activityColourTitle2, 'activityLegend')
        .addElement('rect', config.legend.activityColourBox1, 'activityLegend')
        .setAttributesOfElement(config.legend.activityColourBox1.id, {class: 'category1'})
        .addElement('text', config.legend.activityColourTitle1, 'activityLegend')
        .addElement('rect', config.legend.activityColourBox0, 'activityLegend')
        .setAttributesOfElement(config.legend.activityColourBox0.id, {class: 'category0'})
        .addElement('text', config.legend.activityColourTitle0, 'activityLegend')
    return svgImage
  }
}

module.exports = createAtlasMap
