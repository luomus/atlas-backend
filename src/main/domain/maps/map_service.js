const SvgService = require(__rootdir + "/domain/maps/svg_service.js")

function MapService(gridOverlay, gridArray) {
    const svgService = SvgService()
    if (typeof gridOverlay !== "undefined") svgService.setSvg(gridOverlay)
    else if (typeof gridArray !== "undefined") createGridOverlay(gridArray)
    else console.error("Wrong number of arguments: either gridOverlay or gridArray should be defined")

    return {
        getMap: (type) => type === "svg" ? svgService.serializeDocument() : null,
        speciesMap: function (data) {
            data.forEach(datapoint => {
                const color = setColorByBreedingCategory(datapoint.breedingCategory)
                const propertyMap = { cx: datapoint.coordinateE, cy: datapoint.coordinateN, fill: color, r: 0.5 }
                svgService.setAttribute(datapoint.id, propertyMap, color)
            })
            return this
        }
    }

    function createGridOverlay(gridArray) {
        const verticalFlipMatrix = [[-1, 0], [0, 1]]
        const rotate180ccwMatrix = [[-1, 0], [0, -1]]
        const transformationMatrix = multiplyMatrices(verticalFlipMatrix, rotate180ccwMatrix)
        const minMaxValues = transformCoordsByMatrix(gridArray, transformationMatrix)
        const shiftCoordsToStartFromZero = (rect) => ({"id": rect.id,
            "e": rect.e - minMaxValues.minE, "n": rect.n - minMaxValues.minN})
        const svgGridArray = gridArray.map(shiftCoordsToStartFromZero)
        const width = Math.abs(minMaxValues.maxE - minMaxValues.minE)
        const height = Math.abs(minMaxValues.maxN - minMaxValues.minN)
        svgService.initEmptyDocument(width, height).setViewBox(0, 0, width, height)
        svgGridArray.forEach(rect => {
            const propertyMap = { id: rect.id, cx: rect.e, cy: rect.n, fill: "rgba(124,240,10,0.0)", r: 0.5 }
            return svgService.addCircle(propertyMap)
        })
    }

    function setColorByBreedingCategory(breedingCategory) {
        let color = "rgba(124,240,10,0.0)"
        if (breedingCategory === 4) color = "cornflowerblue"
        else if (breedingCategory === 3) color = "yellowgreen"
        else if (breedingCategory === 2) color = "gold"
        return color
    }

    function transformCoordsByMatrix(coordArray, matrix) {
        let [minE, minN] = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
        let [maxE, maxN] = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
        for (let i = 0; i < coordArray.length; i++) {
            const coordMatrix = [[coordArray[i].e, coordArray[i].n]]
            const transformedCoords = multiplyMatrices(coordMatrix, matrix)
            coordArray[i].e = transformedCoords[0][0]
            coordArray[i].n = transformedCoords[0][1]
            if (coordArray[i].e < minE) minE = coordArray[i].e
            if (coordArray[i].n < minN) minN = coordArray[i].n
            if (coordArray[i].e > maxE) maxE = coordArray[i].e
            if (coordArray[i].n > maxN) maxN = coordArray[i].n
        }
        return {minE, minN, maxE, maxN}
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