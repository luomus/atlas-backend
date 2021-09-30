const { DOMImplementation, XMLSerializer } = require('xmldom')

function SvgService() {
    const xmlSerializer = new XMLSerializer();
    const namespace = 'http://www.w3.org/2000/svg';
    let document, svg;

    return {
        initEmptyDocument: function (width, height) {
            const domImplementation = new DOMImplementation()
            const doc = domImplementation.createDocument(namespace, 'svg:svg')
            document = doc
            svg = doc.createElementNS(namespace, 'svg')
            svg.setAttribute('width', width)
            svg.setAttribute('height', height)
            return this
        },
        setViewBox: function (minX, minY, width, height) {
            svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`)
            return this
        },
        addRectangle: function (propertyMap) {
            const rect = document.createElementNS(namespace, 'rect')
            mapPropertiesToAttributes(propertyMap, rect)
            svg.appendChild(rect)
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