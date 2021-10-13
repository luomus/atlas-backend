const { DOMImplementation, XMLSerializer, DOMParser } = require('xmldom')

function SvgService() {
    const domImplementation = typeof document === "undefined" ?
        new DOMImplementation() : document.implementation
    const xmlSerializer = new XMLSerializer()
    const domParser = new DOMParser()
    const namespace = 'http://www.w3.org/2000/svg'
    let doc, svg

    return {
        initEmptyDocument: function (width, height) {
            doc = domImplementation.createDocument(namespace, 'svg')
            svg = doc.documentElement
            svg.setAttribute('width', width)
            svg.setAttribute('height', height)
            return this
        },
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
        setAttribute: function (id, propertyMap) {
            const circle = doc.getElementById(id)
            console.log(`circle: {`,
                `id: ${circle.getAttribute('id')}, `,
                `cx: ${circle.getAttribute('cx')}, `,
                `cy: ${circle.getAttribute('cy')}, `,
                `fill: ${circle.getAttribute('fill')} `,
                `}`)
        },
        setSvg: function (svgDoc) {
            doc = domParser.parseFromString(svgDoc, "image/svg+xml")
            svg = doc.documentElement
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