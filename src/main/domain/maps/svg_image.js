const {DOMImplementation, XMLSerializer, DOMParser} = require('xmldom')

/**
 * Represents an SVG image with methods to manipulate the image and get information about it. Uses DOM interface
 * internally, hiding it from the user of the SVG image.
 * @param {Object, string=} svgDocument - Either an SVG XMLDocument
 *     (https://developer.mozilla.org/en-US/docs/Web/API/XMLDocument) or an SVG string.
 * @returns {SvgImage}
 * @constructor
 */
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
        addElement: function (tagName, propertyMap, parentId) {
            const element = doc.createElementNS(namespace, tagName)
            const parent = typeof parentId !== 'undefined' ?
                doc.getElementById(parentId) : svg
            if (typeof propertyMap !== 'undefined')
                mapPropertiesToAttributes(propertyMap, element)
            parent.appendChild(element)
            return this
        },
        // Could use propertyMap as well
        addElementFromString: function (svgString, parentId) {
            const element = parseDocument(svgString)
            const parent = typeof parentId !== 'undefined' ?
                doc.getElementById(parentId) : svg
            parent.appendChild(element)
            return this
        },
        setAttributesOfElement: function (id, propertyMap) {
            const element = doc.getElementById(id)
            mapPropertiesToAttributes(propertyMap, element)
            return this
        },
        setAttributesForAllElements: function (className, propertyMap) {
            const allElements = doc.getElementsByClassName(className)
            for (let i = 0; i < allElements.length; i++) {
                mapPropertiesToAttributes(propertyMap, allElements[i])
            }
            return this
        },
        getElementById: function (id) {
            return doc.getElementById(id)
        },
        setText: function (id, text) {
            doc.getElementById(id).textContent = text
            return this
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
                const coords = getElementCoords(allPaths[i])
                xArray.push(coords.x)
                yArray.push(coords.y)
            }
            return coords = {
                minX: Math.min.apply(null, xArray),
                minY: Math.min.apply(null, yArray),
                maxX: Math.max.apply(null, xArray),
                maxY: Math.max.apply(null, yArray)
            }
        },
        getElementCoordsById: function (id) {
            const element = doc.getElementById(id)
            if (element === null)
                return console.error('Element not found')
            return getElementCoords(element)
        },
        mergeSvg: function (otherSvg, scaleFactor) {
            const children = otherSvg.getSvgElement().childNodes
            for (let i = 0; i < children.length; i++) {
                const clone = children[i].cloneNode(true)
                clone.setAttribute('transform', `scale\(${scaleFactor}\)`)
                svg.appendChild(clone)
            }
            return this
        }
    }

    function mapPropertiesToAttributes(propertyMap, svgElement) {
        for (const prop in propertyMap)
            svgElement.setAttributeNS(null, prop, propertyMap[prop])
    }

    function getElementCoords(element) {
        let x, y
        if (element.tagName === 'circle') {
            x = element.getAttribute('cx')
            y = element.getAttribute('cy')
        } else if (element.tagName === 'path') {
            const d = element.getAttribute('d')
            const coordString = d.substring(1).replace(/[\[\]&]+|M/g, '')
            x = parseFloat(coordString.split(',')[0])
            y = parseFloat(coordString.split(',')[1])
        } else {
            x = element.getAttribute('x')
            y = element.getAttribute('y')
        }
        return {x: x, y: y}
    }

}

module.exports = SvgImage