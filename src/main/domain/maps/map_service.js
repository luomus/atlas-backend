const SvgService = require(__rootdir + "/domain/maps/svg_service.js")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

function MapService(overlayURL, gridArray) {
    const svgService = SvgService()
    if (typeof overlayURL === "undefined") createGridOverlay(gridArray)
    else makeXmlHttpGetRequest(overlayURL, res => svgService.setSvg(res))

    return {
        getMap: (type) => type === "svg" ? svgService.serializeDocument() : null
    }

    function makeXmlHttpGetRequest(URL, callbackFunction) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', URL)
        xhr.onload = function () {
            if (xhr.status === 200) callbackFunction(xhr.responseText)
            else alert('Request to ' + URL + ' failed.  Returned status of ' + xhr.status)
        }
        xhr.send()
    }

    function createGridOverlay(gridArray) {
        console.log("createGridOverlay")
        const verticalFlipMatrix = [[-1, 0], [0, 1]]
        const rotate180ccwMatrix = [[-1, 0], [0, -1]]
        const transformationMatrix = multiplyMatrices(verticalFlipMatrix, rotate180ccwMatrix)
        const minMaxValues = transformCoordsByMatrix(gridArray, transformationMatrix)
        const shiftCoordsToStartFromZero = (rect) => ({"id": rect.id,
            "e": rect.e - minMaxValues.minE, "n": rect.n - minMaxValues.minN })
        const svgGridArray = gridArray.map(shiftCoordsToStartFromZero)
        const width = Math.abs(minMaxValues.maxE - minMaxValues.minE)
        const height = Math.abs(minMaxValues.maxN - minMaxValues.minN)
        svgService.initEmptyDocument(width, height)
            .setViewBox(0, 0, width, height)
        svgGridArray.forEach(rect => {
            const propertyMap = {id: rect.id, cx: rect.e, cy: rect.n, fill: "black", r: 0.5}
            return svgService.addCircle(propertyMap)
        })
        return svgService.serializeDocument()
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