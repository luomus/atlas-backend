const { DOMImplementation, XMLSerializer, DOMParser } = require('xmldom')

function SvgService() {
    const domImplementation = new DOMImplementation()
    const xmlSerializer = new XMLSerializer()
    const namespace = 'http://www.w3.org/2000/svg'
    let document, svg

    return {
        initEmptyDocument: function (width, height) {
            document = domImplementation.createDocument(namespace, 'svg:svg')
            svg = document.createElementNS(namespace, 'svg')
            svg.setAttribute('width', width)
            svg.setAttribute('height', height)
            return this
        },
        setViewBox: function (minX, minY, width, height) {
            svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`)
            return this
        },
        addCircle: function (propertyMap) {
            const circle = document.createElementNS(namespace, 'circle')
            mapPropertiesToAttributes(propertyMap, circle)
            svg.appendChild(circle)
            return this
        },
        setSvg: function (svgDoc) {
            svg = new DOMParser().parseFromString(svgDoc, "image/svg+xml")
            document = domImplementation.createDocument(namespace, 'svg:svg')
            document.appendChild(svg)
            return this
        },
        serializeDocument: function () {
            return xmlSerializer.serializeToString(svg)
        },
    }

    function mapPropertiesToAttributes(propertyMap, svgElement) {
        for (const prop in propertyMap)
            svgElement.setAttributeNS(null, prop, propertyMap[prop])
    }

}

module.exports = SvgService