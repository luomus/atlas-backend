const { DOMImplementation, XMLSerializer } = require('xmldom')

function MapService() {
    const xmlSerializer = new XMLSerializer()

    const svgService = {
        namespace: 'http://www.w3.org/2000/svg',
        svg: null,
        document: null,
        initEmptyDocument: function (width, height) {
            const domImplementation = new DOMImplementation()
            const document = domImplementation.createDocument(this.namespace, 'svg:svg')
            document.documentElement.setAttribute('width', width)
            document.documentElement.setAttribute('height', height)
            this.document = document
            this.svg = document.createElementNS(this.namespace, 'svg')
            return this
        },
        setViewBox: function (width, height) {
            this.document.documentElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
            return this
        },
        addRectangle: function (id, x, y, width, height, fill) {
            const rect = this.document.createElementNS(this.namespace, 'rect')
            rect.setAttribute('x', x)
            rect.setAttribute('y', y)
            rect.setAttribute('width', width)
            rect.setAttribute('height', height)
            rect.setAttributeNS(null, 'fill', fill)
            this.svg.appendChild(rect)
            return this
        },
        serializeDocument: function () {
            return xmlSerializer.serializeToString(this.svg)
        },
    }

    return {
        "getGridOverlay": (gridArray) => {
            const minEastCoordinate = Math.min(...gridArray.map(grid => grid.e))
            const minNorthCoordinate = Math.min(...gridArray.map(grid => grid.n))
            const svgGridArray = gridArray.map(grid => ({"id": grid.id,
                "e": grid.e - minEastCoordinate, "n": grid.n - minNorthCoordinate }))
            svgService.initEmptyDocument(400, 400).setViewBox(400, 400)
            svgGridArray.forEach(grid => svgService.addRectangle(
                grid.id, grid.e, grid.n, 1, 1, "black"))
            return svgService.serializeDocument()
        }
    }

}

module.exports = MapService