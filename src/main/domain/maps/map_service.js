const SvgImage = require(__rootdir + "/domain/maps/svg_image.js")
const geojson2svg = require('geojson2svg')
const { createCanvas, Image } = require('canvas')
const svg64 = require('svg64')

function MapService(gridOverlaySvg, gridArray) {
    if (typeof gridArray === 'undefined' && typeof gridOverlaySvg === 'undefined')
        return console.error("Wrong number of arguments: either gridOverlaySvg or gridArray should be defined")
    const invisibleGridOverlay = typeof gridOverlaySvg !== "undefined" ?
         SvgImage(gridOverlaySvg) : drawGrid(gridArray, SvgImage())

    let converterOptions
    const baseMap = SvgImage()

    return {
        getGrid: function (type = 'svg', callback, scaleFactor = 4) {
            const gridOverlay = invisibleGridOverlay.copy()
            gridOverlay.changeDisplayForAll(true)
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
                gridOverlay.setAttribute(datapoint.id, {fill: color, display: 'block'})
            })
            const width = gridOverlay.getWidth() * scaleFactor
            const height = gridOverlay.getHeight() * scaleFactor
            gridOverlay.setDimensions(width, height)
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
            geoJsons.forEach(obj => {
                let svgStringArray = converter.convert(obj.geoJson)
                const propertyMap = { id: obj.id, stroke: 'black', 'stroke-width':'0.15', 'fill-opacity': 0 }
                baseMap.addGroupFromStrings(svgStringArray, propertyMap)
            })
            const minMaxCoords = baseMap.getMinMaxCoords()
            const width = Math.abs(minMaxCoords.maxX - minMaxCoords.minX)
            const height = Math.abs(minMaxCoords.maxY - minMaxCoords.minY)
            baseMap.setDimensions(width, height)
            baseMap.setViewBox(0, 0, width, height)
        },
        getBaseMap: function (type, callback) {
            const width = baseMap.getWidth() * 2
            const height = baseMap.getHeight() * 2
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
        svgImage.setDimensions(width, height).setViewBox(0, 0, width, height)
        svgGridArray.forEach(rect => {
            const propertyMap = { id: rect.id, cx: rect.e, cy: rect.n, fill: "black", r: 0.5, display: "none" }
            return svgImage.addCircle(propertyMap)
        })
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
            }
        }
    }

}

module.exports = MapService