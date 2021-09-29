const SvgService = require(__rootdir + "/domain/maps/svg_service.js")

function MapService() {
    const svgService = SvgService()

    return {
        getGridOverlay: (gridArray) => {
            const verticalFlipMatrix = [[-1, 0], [0, 1]]
            const rotate180ccwMatrix = [[-1, 0], [0, -1]]
            const transformationMatrix = multiplyMatrices(verticalFlipMatrix, rotate180ccwMatrix)
            const minMaxValues = transformCoordsByMatrix(gridArray, transformationMatrix)
            const svgGridArray = gridArray.map(rect => ({"id": rect.id,
                "e": rect.e - minMaxValues.minX, "n": rect.n - minMaxValues.minY }))
            const width = Math.abs(minMaxValues.maxX - minMaxValues.minX)
            const height = Math.abs(minMaxValues.maxY - minMaxValues.minY)
            svgService.initEmptyDocument(width, height).setViewBox(width, height)
            svgGridArray.forEach(rect => svgService.addRectangle({
                id: rect.id, x: rect.e, y: rect.n, width: 1, height: 1, fill: "black"} ))
            return svgService.serializeDocument()
        }
    }

    function transformCoordsByMatrix(coordArray, matrix) {
        let [minX, minY] = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
        let [maxX, maxY] = [0, 0]
        for (let i = 0; i < coordArray.length; i++) {
            const coordMatrix = [[coordArray[i].e, coordArray[i].n]]
            const transformedCoords = multiplyMatrices(coordMatrix, matrix)
            coordArray[i].e = transformedCoords[0][0]
            coordArray[i].n = transformedCoords[0][1]
            if (coordArray[i].e < minX) minX = coordArray[i].e
            if (coordArray[i].n < minY) minY = coordArray[i].n
            if (coordArray[i].e > maxX) maxX = coordArray[i].e
            if (coordArray[i].n > maxY) maxY = coordArray[i].n
        }
        return {minX, minY, maxX, maxY}
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