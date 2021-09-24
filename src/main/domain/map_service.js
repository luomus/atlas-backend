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
        addRectangle: function (x, y, width, height, fill) {
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
        "getGridOverlay": () => {
            const rectColor1 = '#' + Math.floor(Math.random()*16777215).toString(16)
            const rectColor2 = '#' + Math.floor(Math.random()*16777215).toString(16)
            return svgService.initEmptyDocument(400, 400)
                .setViewBox(400, 400)
                .addRectangle(0, 0, 100, 100, rectColor1)
                .addRectangle(100, 0, 100, 100, rectColor2)
                .addRectangle(200, 0, 100, 100, rectColor1)
                .addRectangle(300, 0, 100, 100, rectColor2)
                .addRectangle(0, 100, 100, 100, rectColor2)
                .addRectangle(100, 100, 100, 100, rectColor1)
                .addRectangle(200, 100, 100, 100, rectColor2)
                .addRectangle(300, 100, 100, 100, rectColor1)
                .addRectangle(0, 200, 100, 100, rectColor1)
                .addRectangle(100, 200, 100, 100, rectColor2)
                .addRectangle(200, 200, 100, 100, rectColor1)
                .addRectangle(300, 200, 100, 100, rectColor2)
                .addRectangle(0, 300, 100, 100, rectColor2)
                .addRectangle(100, 300, 100, 100, rectColor1)
                .addRectangle(200, 300, 100, 100, rectColor2)
                .addRectangle(300, 300, 100, 100, rectColor1)
                .serializeDocument()
        }
    }

}

module.exports = MapService