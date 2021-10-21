const { DOMImplementation, XMLSerializer, DOMParser } = require('xmldom')
const { all } = require('../../server')

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

module.exports = SvgImage