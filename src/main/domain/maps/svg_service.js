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
        setViewBox: function (width, height) {
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
            return this
        },
        addRectangle: function (id, x, y, width, height, fill) {
            const rect = document.createElementNS(namespace, 'rect')
            rect.setAttribute('x', x)
            rect.setAttribute('y', y)
            rect.setAttribute('width', width)
            rect.setAttribute('height', height)
            rect.setAttributeNS(null, 'fill', fill)
            svg.appendChild(rect)
            return this
        },
        serializeDocument: function () {
            return xmlSerializer.serializeToString(svg)
        },
    }

}

module.exports = SvgService