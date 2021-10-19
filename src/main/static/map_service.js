
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
        getGrid: function (type = 'svg', callback) {
            const gridOverlay = invisibleGridOverlay.copy()
            gridOverlay.changeDisplayForAll(true)
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
        addToBaseMap: function (geoJson, id) {
            const converter = geojson2svg(converterOptions)
            let svgStrings = converter.convert(geoJson)
            const propertyMap = { id: id, stroke: 'black', 'fill-opacity': 0 }
            baseMap.addGroupFromStrings(svgStrings, propertyMap)
            return this
        },
        getBaseMap: function (type, callback) {
            if (type === 'png') {
                this.convertToPng(baseMap, callback, baseMap.getWidth(), baseMap.getHeight())
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

}


function SvgImage(svgDocument) {
    const xmlSerializer = new XMLSerializer()
    const namespace = 'http://www.w3.org/2000/svg'
    let doc, svg

    const docType = typeof svgDocument
    if (docType === 'undefined') doc = createEmptyDocument()
    else if (docType === 'string') doc = parseDocument(svgDocument)
    else doc = svgDocument
    svg = doc.documentElement

    function parseDocument(svgDoc) {
        const domParser = new DOMParser()
        return domParser.parseFromString(svgDoc, "image/svg+xml")
    }

    function createEmptyDocument() {
        const domImplementation = typeof document === "undefined" ?
            new DOMImplementation() : document.implementation
        return domImplementation.createDocument(namespace, 'svg')
    }

    return {
        setDimensions: function (width, height) {
            svg.setAttribute('width', width)
            svg.setAttribute('height', height)
            return this
        },
        getWidth: () => svg.getAttribute('width'),
        getHeight: () => svg.getAttribute('height'),
        setViewBox: function (minX, minY, width, height) {
            svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`)
            return this
        },
        addCircle: function (propertyMap) {
            const circle = doc.createElementNS(namespace, 'circle')
            mapPropertiesToAttributes(propertyMap, circle)
            svg.appendChild(circle)
            return this
        },
        addGroupFromStrings: function (svgStringArray, propertyMap) {
            const group = doc.createElementNS(namespace, 'g')
            mapPropertiesToAttributes(propertyMap, group)
            svg.appendChild(group)
            svgStringArray.forEach(str => {
                svgElement = parseDocument(str)
                group.appendChild(svgElement)
            })
            return this
        },
        addElementFromString: function (svgString) {
            const svgElement = parseDocument(svgString)
            svg.appendChild(svgElement)
            return this
        },
        setAttribute: function (id, propertyMap) {
            const circle = doc.getElementById(id)
            mapPropertiesToAttributes(propertyMap, circle)
            return this
        },
        changeDisplayForAll: function (display) {
            const allCircles = doc.getElementsByTagName('circle')
            for (let i = 0; i < allCircles.length; i++) {
                const element = allCircles[i];
                if (display) { element.setAttribute('display', 'block') } 
                else { element.setAttribute('display', 'none') }
            }
        },
        copy: function () {
            return SvgImage(doc.cloneNode(true))
        },
        getSvgElement: () => svg,
        serialize: function () {
            return xmlSerializer.serializeToString(svg)
        },
    }

    function mapPropertiesToAttributes(propertyMap, svgElement) {
        for (const prop in propertyMap)
            svgElement.setAttributeNS(null, prop, propertyMap[prop])
    }

}

