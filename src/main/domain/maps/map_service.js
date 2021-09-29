const SvgService = require(__rootdir + "/domain/maps/svg_service.js")

function MapService() {
    const svgService = SvgService()
    const verticalFlipMatrix = [[-1, 0], [0, 1]]
    const rotate180ccwMatrix = [[-1, 0], [0, -1]]
    const vFlipRot180ccwMatrix = multiplyMatrices(verticalFlipMatrix, rotate180ccwMatrix)

    return {
        getGridOverlay: (gridArray) => {
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