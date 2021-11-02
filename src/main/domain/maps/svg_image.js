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
        // Is it even necessary to have this method or could addElement be used instead?
        addGroup: function (id, propertyMap) {
            const group = doc.createElementNS(namespace, 'g')
            group.setAttribute('id', id)
            if (typeof propertyMap !== 'undefined')
                mapPropertiesToAttributes(propertyMap, group)
            svg.appendChild(group)
            return this
        },
        // parentId should default to root svg element
        addElement: function (id, propertyMap, tag, parentId) {
            const element = doc.createElementNS(namespace, tag)
            propertyMap.id = id
            mapPropertiesToAttributes(propertyMap, element)
            const parent = doc.getElementById(parentId)
            parent.appendChild(element)
            return this
        },
        // Is it necessary to have complex manipulations like this in SvgImage or should we instead use
        // multiple simple methods to achieve the same result? We could first create the group and then use
        // addElementFromString to add all the elements to the group. It could improve readability.
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
        // Should this be renamed to setAttributesOfElement as it can set multiple attributes of one element at once?
        // Also we should probably add a new method called setAttributesOfElements that can set multiple attributes of
        // multiple elements using their class name.
        setAttribute: function (id, propertyMap) {
            const element = doc.getElementById(id)
            mapPropertiesToAttributes(propertyMap, element)
            return this
        },
        // We should do transformations at group level. We could use setAttribute instead.
        setTransformForAllCircles: function (transformOptions) {
            const allCircles = doc.getElementsByTagName('circle')
            for (let i = 0; i < allCircles.length; i++) {
                allCircles[i].setAttribute('transform', transformOptions)
            }
        },
        // Should setAttribute be used instead?
        changeAttributeForAllElements: function (attribute, tag) {
            const allElements = doc.getElementsByTagName(tag)
            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i];
                element.setAttribute(attribute, value)
            }
        },
        copy: function () {
            return SvgImage(doc.cloneNode(true))
        },
        getSvgElement: () => svg,
        serialize: function () {
            return xmlSerializer.serializeToString(svg)
        },
        // This should take advantage of getElementCoords.
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
        },
        getElementCoords: function (id) {
            const element = doc.getElementById(id)
            let x, y
            if (element === null)
                return console.error('Element not found')
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
        },
        // Instead of the root element all the immediate child elements of the root should be appended.
        mergeSvg: function (other) {
            const otherSvg = other.getSvgElement()
            svg.appendChild(otherSvg)
            return this
        }
    }

    function mapPropertiesToAttributes(propertyMap, svgElement) {
        for (const prop in propertyMap)
            svgElement.setAttributeNS(null, prop, propertyMap[prop])
    }

}

module.exports = SvgImage