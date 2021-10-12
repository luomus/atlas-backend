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
            doc = domImplementation.createDocument(namespace, 'svg:svg')
            svg = doc.createElementNS(namespace, 'svg')
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
            const circles = doc.getElementsByTagNameNS(namespace,'circle')
            console.log(circles.length)
            for (let i = 0; i < circles.length; i++) {
                console.log("täällä!!")
                console.log("elementti: ", circle[i].getAttribute(id).value)
              }
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