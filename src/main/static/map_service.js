
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
            baseMap.setDimensions(width * 2, height * 2)
            baseMap.setViewBox(0, 0, width, height)
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
            },
            attributes: ['properties.lineID', 'properties.typeID']
        }
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
        getWidth: () => parseInt(svg.getAttribute('width')),
        getHeight: () => parseInt(svg.getAttribute('height')),
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
        getMinMaxCoords: function () {
            const xArray = []
            const yArray = []
            const allPaths = doc.getElementsByTagName('path')
            for (let i = 0; i < allPaths.length; i++) {
                const path = allPaths[i]
                const d = path.getAttribute('d')
                const coordString = d.substring(1).replace(/[\[\]&]+|M/g, '')
                const coordArray = coordString.split(' ')
                coordArray.forEach(coord => {
                    xArray.push(parseFloat(coord.split(',')[0]))
                    yArray.push(parseFloat(coord.split(',')[1]))
                })
            }
            const coords = {
                minX: Math.min.apply(null, xArray),
                minY: Math.min.apply(null, yArray),
                maxX: Math.max.apply(null, xArray),
                maxY: Math.max.apply(null, yArray)
            }
            return coords
        }
    }

    function mapPropertiesToAttributes(propertyMap, svgElement) {
        for (const prop in propertyMap)
            svgElement.setAttributeNS(null, prop, propertyMap[prop])
    }

}

