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
            this.svg.setAttribute('viewBox', `0 -150 ${width} ${height}`)
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

    const verticalFlipMatrix = [[-1, 0], [0, 1]]
    const rotate180ccwMatrix = [[-1, 0], [0, -1]]
    const vFlipRot180ccwMatrix = multiplyMatrices(verticalFlipMatrix, rotate180ccwMatrix)

    return {
        "getGridOverlay": (gridArray) => {
            const minEastCoordinate = Math.min(...gridArray.map(grid => grid.e))
            const minNorthCoordinate = Math.min(...gridArray.map(grid => grid.n))
            const svgGridArray = gridArray.map(grid => ({"id": grid.id,
                "e": grid.e - minEastCoordinate, "n": grid.n - minNorthCoordinate }))
            svgService.initEmptyDocument(400, 400).setViewBox(400, 400)
            svgGridArray.forEach(grid => {
                const flipped = multiplyMatrices([[grid.e, grid.n]], vFlipRot180ccwMatrix)
                return svgService.addRectangle(
                    grid.id, flipped[0][0], flipped[0][1], 1, 1, "black")
            })
            return svgService.serializeDocument()
        }
    }

    function multiplyMatrices(m1, m2) {
        const result = [];
        for (let i = 0; i < m1.length; i++) {
            result[i] = [];
            for (let j = 0; j < m2[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < m1[0].length; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

}

module.exports = MapService