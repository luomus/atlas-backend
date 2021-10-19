const SvgImage = require(__rootdir + "/domain/maps/svg_image.js")
const geojson2svg = require('geojson2svg')
const { createCanvas, Image } = require('canvas')
const svg64 = require('svg64')

function MapService(gridOverlaySvg, gridArray) {
    if (typeof gridArray === 'undefined' && typeof gridOverlaySvg === 'undefined')
        return console.error("Wrong number of arguments: either gridOverlaySvg or gridArray should be defined")
    const invisibleGridOverlay = typeof gridOverlaySvg !== "undefined" ?
         SvgImage(gridOverlaySvg) : drawGrid(gridArray, SvgImage())

    const mapWidth = 200
    const mapHeight = 300
    const converterOptions = {
        mapExtent: {
            left: 32.215,
            bottom: 6597226.034,
            right: 799710.013,
            top: 7796745.612
        }
    }
    const baseMap = SvgImage()
    baseMap.setDimensions(mapWidth, mapHeight)
    baseMap.setViewBox(0, 0, mapWidth, mapHeight)

    return {
        getGrid: function (type = 'svg') {
            if (type === 'svg'){
                const gridOverlay = invisibleGridOverlay.copy()
                gridOverlay.changeDisplayForAll(true)
                return gridOverlay.serialize()
            } else {
                return null
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
                image.src = svg64(gridOverlay.serialize())
            } else {
                return gridOverlay.serialize()
            }
        },
        addToBaseMap: function (geoJson, id) {
            const converter = geojson2svg(converterOptions)
            let svgStrings = converter.convert(geoJson)
            const propertyMap = { id: id, stroke: 'black', 'fill-opacity': 0 }
            baseMap.addGroupFromStrings(svgStrings, propertyMap)
            return this
        },
        getBaseMap: function () {
            return baseMap.serialize()
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

}

module.exports = MapService