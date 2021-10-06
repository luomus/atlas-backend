const { DOMImplementation, XMLSerializer, DOMParser } = require('xmldom')

function SvgService() {
    const domImplementation = new DOMImplementation()
    const xmlSerializer = new XMLSerializer()
    const namespace = 'http://www.w3.org/2000/svg'
    let document, svg

    return {    
        initEmptyDocument: function (width, height) {
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
        addCircle: function (propertyMap) {
            const circle = document.createElementNS(namespace, 'circle')
            mapPropertiesToAttributes(propertyMap, circle)
            svg.appendChild(circle)
            return this
        },
        serializeDocument: function () {
            return xmlSerializer.serializeToString(svg)
        },
        setSvg: function (svgDoc) {
            document = new DOMParser().parseFromString(svgDoc, "image/svg+xml")
            const errorNode = document.querySelector('parsererror')
            console.log(errorNode)
            // console.log(document)

            return this
        }
    }

    function mapPropertiesToAttributes(propertyMap, svgElement) {
        for (const prop in propertyMap)
            svgElement.setAttributeNS(null, prop, propertyMap[prop])
    }

    // function createDocument() {
    //     const doc = domImplementation.createDocument(namespace, 'svg:svg')
    //     document = doc
    // }

}

module.exports = SvgService