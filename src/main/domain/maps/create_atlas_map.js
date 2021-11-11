const SvgImage = require(__rootdir + "/domain/maps/svg_image.js")
const geojson2svg = require('geojson2svg')

/**
 * Creates the Atlas map grid and map legend without data.
 * @returns {SvgImage} 
 * @constructor
 */
function createAtlasMap(gridArray, geoJsonArray) {
    const overlayPadding = 15
    const overlayCircleRadius = 0.5
    const baseMap = drawBaseMap(geoJsonArray, SvgImage())
    const overlay = drawGrid(gridArray, SvgImage())
    const scaleFactor = getScaleFactorForMerge(baseMap, overlay)
    const atlasMap = moveOverlay(baseMap, overlay).mergeSvg(baseMap, scaleFactor)

    return atlasMap

    function drawBaseMap (geoJsonArray, svgImage) {
        const converterOptions = getConverterOptions(geoJsonArray)
        const converter = geojson2svg(converterOptions)
        let color
        geoJsonArray.forEach(geoJsonObj => {
            let svgStringArray = converter.convert(geoJsonObj.geoJson)
            if (geoJsonObj.id === 'YKJ100km') {
                color = 'darkgrey'
            } else {
                color = 'black'
            }
            const propertyMap = { id: geoJsonObj.id, class: 'baseMap', stroke: color, 'stroke-width':'0.15', 'fill-opacity': 0 }
            svgImage.addElement('g', propertyMap)
            svgStringArray.forEach(str => svgImage.addElementFromString(str, geoJsonObj.id))
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
        const geoJsons = geoJsonArray.map(obj => obj.geoJson)
        geoJsons.forEach(geoJson => {
            const features = geoJson.features
            const n1 = features.map(f => f.properties.ETRS_N1)
            n1.forEach(x => {
                if (typeof x !== 'undefined' && x < minN) minN = x
            })
            const e1 = features.map(f => f.properties.ETRS_E1)
            e1.forEach(x => {
                if (typeof x !== 'undefined' && x < minE) minE = x
            })
            const n2 = features.map(f => f.properties.ETRS_N2)
            n2.forEach(x => {
                if (typeof x !== 'undefined' && x > maxN) maxN = x
            })
            const e2 = features.map(f => f.properties.ETRS_E2)
            e2.forEach(x => {
                if (typeof x !== 'undefined' && maxE) maxE = x
            })
        })
        const converterOptions = {
            mapExtent: {
                bottom: minN,
                left: minE,
                top: maxN,
                right: maxE
            },
            attributes: [{ property: 'properties.lineID', type: 'dynamic', key: 'id' }, 'properties.typeID']
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
        const baseMapScaleFactor = 10 / (baseMap.getWidth() / 8)
        const dataMapCoords = overlay.getElementCoordsById(680320)
        const baseMapX = baseMap.getElementCoordsById(32).x * baseMapScaleFactor
        const baseMapY = baseMap.getElementCoordsById(68).y * baseMapScaleFactor
        const translateX = baseMapX - dataMapCoords.x + overlayCircleRadius
        const translateY = baseMapY - dataMapCoords.y - overlayCircleRadius
        return { x: translateX, y: translateY }
    }

    function getScaleFactorForMerge(svgImage, overlay) {
        const baseMapDistance = Math.abs(svgImage.getElementCoordsById(32).x - svgImage.getElementCoordsById(33).x)
        const dataMapDistance = Math.abs(overlay.getElementCoordsById(680320).x - overlay.getElementCoordsById(680330).x)
        return dataMapDistance / baseMapDistance
    }

    function drawGrid(gridArray, svgImage) {
        const verticalFlipMatrix = [[-1, 0], [0, 1]]
        const rotate180ccwMatrix = [[-1, 0], [0, -1]]
        const transformationMatrix = multiplyMatrices(verticalFlipMatrix, rotate180ccwMatrix)
        const minMaxValues = transformCoordsByMatrix(gridArray, transformationMatrix)
        const shiftCoordsToStartFromZero = (rect) => ({"id": rect.id,
            "e": rect.e - minMaxValues.minE, "n": rect.n - minMaxValues.minN})
        const svgGridArray = gridArray.map(shiftCoordsToStartFromZero)
        const width = Math.abs(minMaxValues.maxE - minMaxValues.minE)
        const height = Math.abs(minMaxValues.maxN - minMaxValues.minN)
        svgImage.setDimensions(width + overlayPadding, height + overlayPadding)
                .setViewBox(0, 0, width + overlayPadding, height + overlayPadding)
                .addElement("g", {id: "background"})
                .addElement("g", {id: "overlay"})
                
        drawLegend(svgImage)
        svgGridArray.forEach(rect => {
            const circlePropertyMap = { id: rect.id, class: "gridCircle", cx: (rect.e), cy: (rect.n), fill: "black", r: overlayCircleRadius, display: "none" }
            const backgroundPropertyMap = { id: (rect.id + "bg"), class: "gridBackground", x: (rect.e - 0.5), y: (rect.n - 0.5), width: 1, height: 1, fill: "#ebebeb", "shape-rendering": "optimizeSpeed" }
            return svgImage//.addElement('rect', backgroundPropertyMap, 'background')
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
                    for (let k = 0; k < m1[0].length; k++) {
                        sum += m1[i][k] * m2[k][j];
                    }
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
        const legendWidth = svgImage.getWidth() * (2 / 5)
        const legendHeight = svgImage.getHeight() * (2 / 5)
        svgImage.addElement("g", {id: "legend"})
                .addElement("g", {id: "legendBox", display: "none"})
        const boxPropertyMap = { id: "legendBox", class: "legendBox", x: 0, y: 0, width: legendWidth, height: legendHeight, fill: "white", 'fill-opacity': 0, stroke: "black", "stroke-width": 0.15 }
        svgImage.addElement('rect', boxPropertyMap, 'legendBox')
                .addElement("text", { id: "atlasTitle", class: "title", x: 1, y: 5, "font-size": 3.5 }, 'legend')
                .setText("atlasTitle", "Lintuatlas 3 (2006-2010)")
                .addElement('text', { id: "speciesFI", class: "speciesName", x: 1, y: 24, "font-size": 2.5 }, 'legend')
                .setText("speciesFI", "suomenkielinen nimi")
                .addElement('text', { id: "speciesSCI", class: "scientificName", x: 1, y: 28, "font-size": 2.5, "font-style": "italic" }, 'legend')
                .setText("speciesSCI", "scientific name")
                .addElement('text', { id: "speciesSV", class: "speciesName", x: 1, y: 24, "font-size": 2.5 }, 'legend')
                .setText("speciesSV", "svenskt namn")
                .addElement('text', { id: "speciesEN", class: "speciesName", x: 1, y: 24, "font-size": 2.5 }, 'legend')
                .setText("speciesEN", "English name")
                .addElement('text', { id: "breedingColourTitle", class: "title", x: 1, y: 45, "font-size": 3 }, 'legend')
                .setText("breedingColourTitle", "Pesintä")
                .addElement("rect", {id: "colourBox4", class: "colourBox", x: 1, y: 48, width: 1, height: 1, fill: 'cornflowerblue', stroke: "black", "stroke-width": 0.1 }, "legend")
                .addElement('text', { id: "colorTitle4", class: "colourTitle", x: 3, y: 49, "font-size": 2 }, 'legend')
                .setText("colorTitle4", "varma pesintä")
                .addElement("rect", {id: "colourBox3", class: "colourBox", x: 1, y: 52, width: 1, height: 1, fill: 'yellowgreen', stroke: "black", "stroke-width": 0.1 }, "legend")
                .addElement('text', { id: "colorTitle3", class: "colourTitle", x: 3, y: 53, "font-size": 2 }, 'legend')
                .setText("colorTitle3", "todennäköinen pesintä")
                .addElement("rect", {id: "colourBox2", class: "colourBox", x: 1, y: 56, width: 1, height: 1, fill: 'gold', stroke: "black", "stroke-width": 0.1 }, "legend")
                .addElement('text', { id: "colorTitle2", class: "colourTitle", x: 3, y: 57, "font-size": 2 }, 'legend')
                .setText("colorTitle2", "mahdollinen pesintä")
        return svgImage
    }

}

module.exports = createAtlasMap