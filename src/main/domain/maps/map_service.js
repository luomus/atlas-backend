const SvgImage = require(__rootdir + "/domain/maps/svg_image.js")
const geojson2svg = require('geojson2svg')
const { createCanvas, Image } = require('canvas')
const svg64 = require('svg64')

/**
 * Provides an interface for map-related functionalities. When a ready-made atlas map is given as an argument, it is
 * used as it stands as an archetypal atlas map. Otherwise, grid data must be given as an argument for a base map and
 * grid overlay to be created during construction. The base map is created using specific GeoJSON files.
 * @param {Object, string=} atlasMap - An archetypal atlas map that contains certain mandatory elements. It can be an
 *     SVG XMLDocument (https://developer.mozilla.org/en-US/docs/Web/API/XMLDocument) or an SVG string.
 * @param {{id: string, e: number, n: number}[]} gridArray - An object array containing grid objects with an id as well
 *     as north and east coordinates in Finland Uniform Coordinate System (EPSG:2393).
 * @returns {MapService}
 * @constructor
 */
// To improve readability, initialization procedures, like base map and grid creation, should be differentiated from
// this main function. Should GeoJSON files be dependency injected?
function MapService(atlasMap, gridArray) {
    if (typeof gridArray === 'undefined' && typeof atlasMap === 'undefined')
        return console.error("Wrong number of arguments: either atlasMap or gridArray should be defined")
    const overlayPadding = 15
    const overlayCircleRadius = 0.5
    let converterOptions
    let baseMapScaleFactor
    let overlayTranslationCoords
    const baseMap = SvgImage()
    const invisibleGridOverlay = typeof atlasMap !== "undefined" ?
        SvgImage(atlasMap) : drawGrid(gridArray, SvgImage())

    return {
        getGrid: function (type = 'svg', callback, scaleFactor = 4) {
            const gridOverlay = invisibleGridOverlay.copy()
            gridOverlay.setAttributesForAllElements("gridCircle", { display: true })
            const width = gridOverlay.getWidth() * scaleFactor
            const height = gridOverlay.getHeight() * scaleFactor
            gridOverlay.setDimensions(width, height)
            if (type === 'png') {
               this.convertToPng(gridOverlay, callback, gridOverlay.getWidth(), gridOverlay.getHeight())
            } else {
                return gridOverlay.serialize()
            }
        },
        getSpeciesMap: function (data, callback, type = 'svg', scaleFactor = 4) {
            const gridOverlay = invisibleGridOverlay.copy()
            data.forEach(datapoint => {
                const color = getColorForBreedingCategory(datapoint.breedingCategory)
                gridOverlay.setAttributesOfElement(datapoint.id, {fill: color, display: 'block'})
            })
            const width = gridOverlay.getWidth() * scaleFactor
            const height = gridOverlay.getHeight() * scaleFactor
            gridOverlay.setDimensions(width, height)
            const transformOptions = 'translate\(' + overlayTranslationCoords.x + ',' + overlayTranslationCoords.y + '\)'
            gridOverlay.setAttributesForAllElements("gridCircle", { transform: transformOptions })
            gridOverlay.mergeSvg(baseMap)
            if (type === 'png') {
                this.convertToPng(gridOverlay, callback, width, height)
            } else {
                return gridOverlay.serialize()
            }
        },
        convertToPng: function (svg, callback, width, height) {
            const image = new Image()
            const canvas = typeof createCanvas !== 'undefined' ?
                createCanvas(width, height) : document.createElement('canvas')
            const context = canvas.getContext('2d')
            image.onload = () => {
                context.drawImage(image, 0, 0, width, height)
                const png = canvas.toBuffer('image/png')
                callback(png)
            }
            image.onerror = err => { throw err }
            image.src = svg64(svg.serialize())
        },
        setBaseMap: function (geoJsons) {
            setConverterOptions(geoJsons)
            const converter = geojson2svg(converterOptions)
            let color
            geoJsons.forEach(geoJsonObj => {
                let svgStringArray = converter.convert(geoJsonObj.geoJson)
                if (geoJsonObj.id === 'YKJ100km') {
                    color = 'darkgrey'
                } else {
                    color = 'black'
                }
                const propertyMap = { id: geoJsonObj.id, class: 'basemap', stroke: color, 'stroke-width':'0.15', 'fill-opacity': 0 }
                baseMap.addElement('g', propertyMap)
                svgStringArray.forEach(str => baseMap.addElementFromString(str, propertyMap, geoJsonObj.id))
            })
            const minMaxCoords = baseMap.getMinMaxCoords()
            const width = Math.abs(minMaxCoords.maxX - minMaxCoords.minX)
            const height = Math.abs(minMaxCoords.maxY - minMaxCoords.minY)
            baseMapScaleFactor = 10 / (width / 8)
            baseMap.setDimensions(baseMapScaleFactor * width, baseMapScaleFactor * height)
            baseMap.setViewBox(0, 0, width, height)
            overlayTranslationCoords = calculateOverlayTranslationCoords()
        },
        getBaseMap: function (type, callback) {
            const width = baseMap.getWidth()
            const height = baseMap.getHeight()
            baseMap.setDimensions(width, height)
            if (type === 'png') {
                this.convertToPng(baseMap, callback, width, height)
            } else {
                return baseMap.serialize()
            }
        }
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
                .addElement("g", {id: "overlay"})
        drawLegend(svgImage)
        svgGridArray.forEach(rect => {
            const propertyMap = { id: rect.id, class: "gridCircle", cx: rect.e, cy: rect.n, fill: "black", r: overlayCircleRadius, display: "none" }
            return svgImage.addElement('circle', propertyMap, 'overlay')
        })
        return svgImage
    }

    function drawLegend(svgImage) {
        const legendWidth = svgImage.getWidth() * (2 / 5)
        const legendHeight = svgImage.getHeight() * (2 / 5)
        svgImage.addElement("g", {id: "legend"})
                .addElement("g", {id: "legendBox", display: "none"})
        const boxPropertyMap = { id: "legendBox", class: "legendBox", x: 0, y: 0, width: legendWidth, height: legendHeight, fill: "white", 'fill-opacity': 0, stroke: "black", "stroke-width": 0.15 }
        svgImage.addElement('rect', boxPropertyMap, 'legendBox')
                .addElement("text", { id: "atlasTitle", class: "title", x: 1, y: 5, "font-size": 4 }, 'legend')
                .setText("atlasTitle", "Lintuatlas 3")
                .addElement('text', { id: "speciesFI", class: "speciesName", x: 1, y: 10, "font-size": 3 }, 'legend')
                .setText("speciesFI", "suomenkielinen nimi")
                .addElement('text', { id: "speciesSVE", class: "speciesName", x: 1, y: 15, "font-size": 3 }, 'legend')
                .setText("speciesSVE", "svenskt namn")
                .addElement('text', { id: "speciesENG", class: "speciesName", x: 1, y: 20, "font-size": 3 }, 'legend')
                .setText("speciesENG", "English name")
                .addElement('text', { id: "speciesSCI", class: "scientificName", x: 1, y: 25, "font-size": 3, "font-style": "italic" }, 'legend')
                .setText("speciesSCI", "scientific name")
                .addElement('text', { id: "breedingColourTitle", class: "title", x: 1, y: 35, "font-size": 4 }, 'legend')
                .setText("breedingColourTitle", "Pesintä")
                .addElement("rect", {id: "colourBox4", class: "colourBox", x: 1, y: 38, width: 1, height: 1, fill: getColorForBreedingCategory(4), stroke: "black", "stroke-width": 0.1 }, "legend")
                .addElement('text', { id: "colorTitle4", class: "colourTitle", x: 3, y: 39, "font-size": 2 }, 'legend')
                .setText("colorTitle4", "varma pesintä")
                .addElement("rect", {id: "colourBox3", class: "colourBox", x: 1, y: 42, width: 1, height: 1, fill: getColorForBreedingCategory(3), stroke: "black", "stroke-width": 0.1 }, "legend")
                .addElement('text', { id: "colorTitle3", class: "colourTitle", x: 3, y: 43, "font-size": 2 }, 'legend')
                .setText("colorTitle3", "todennäköinen pesintä")
                .addElement("rect", {id: "colourBox2", class: "colourBox", x: 1, y: 46, width: 1, height: 1, fill: getColorForBreedingCategory(2), stroke: "black", "stroke-width": 0.1 }, "legend")
                .addElement('text', { id: "colorTitle2", class: "colourTitle", x: 3, y: 47, "font-size": 2 }, 'legend')
                .setText("colorTitle2", "mahdollinen pesintä")
        return svgImage
    }

    function getColorForBreedingCategory(breedingCategory) {
        let color = "rgba(124,240,10,0.0)"
        if (breedingCategory === 4) color = "cornflowerblue"
        else if (breedingCategory === 3) color = "yellowgreen"
        else if (breedingCategory === 2) color = "gold"
        return color
    }

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

    function setConverterOptions(geoJsonArray) {
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
        converterOptions = {
            mapExtent: {
                bottom: minN,
                left: minE,
                top: maxN,
                right: maxE
            },
            attributes: [{ property: 'properties.lineID', type: 'dynamic', key: 'id' }, 'properties.typeID']
        }
    }

    function calculateOverlayTranslationCoords() {
        const dataMapCoords = invisibleGridOverlay.getElementCoordsById(680320)
        const baseMapX = baseMap.getElementCoordsById(32).x * baseMapScaleFactor
        const baseMapY = baseMap.getElementCoordsById(68).y * baseMapScaleFactor
        const translateX = baseMapX - dataMapCoords.x + overlayCircleRadius
        const translateY = baseMapY - dataMapCoords.y - overlayCircleRadius
        return { x: translateX, y: translateY }
    }

}

module.exports = MapService