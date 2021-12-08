const {createCanvas, Image} = require('canvas')
const svg64 = require('svg64')

/**
 * Provides an interface for map-related functionalities. When a ready-made atlas map is given as an argument, it is
 * used as it stands as an archetypal atlas map. Otherwise, grid data must be given as an argument for a base map and
 * grid overlay to be created during construction. The base map is created using specific GeoJSON files.
 * @param {Object} atlasMap - An archetypal atlas map that contains certain mandatory elements. It can be an
 *     SVG XMLDocument (https://developer.mozilla.org/en-US/docs/Web/API/XMLDocument) or an SVG string.
 * @param {Array} gridArray - An object array containing grid objects with an id as well
 *     as north and east coordinates in Finland Uniform Coordinate System (EPSG:2393).
 * @returns {MapService}
 * @constructor
 */
// eslint-disable-next-line max-lines-per-function
function MapService(atlasMap, config) {
  if (typeof atlasMap === 'undefined')
    return console.error('Wrong number of arguments: atlasMap should be defined')

  return {
    /**
         * Returns the SVGImage of species breeding map with given parameters.
         * @param {Object} data
         * @param {Object} species
         * @param {Object} callback
         * @param {string} type
         * @param {number} scaleFactor
         * @param {string} language
         * @param {number} atlas
         * @returns {SvgImage}
         */
    getSpeciesMap: function(data, species, callback, type = 'svg', scaleFactor = 4, language = 'fi', atlas) {
      const speciesMap = atlasMap.copy()
      data.forEach((datapoint) => {
        const colour = getColorForBreedingCategory(datapoint.breedingCategory)
        speciesMap.setAttributesOfElement(datapoint.id, {fill: colour, display: 'block'})
      })
      const width = speciesMap.getWidth() * scaleFactor
      const height = speciesMap.getHeight() * scaleFactor
      speciesMap.setDimensions(width, height)
      setLegend(speciesMap, species, language, atlas)
      if (type === 'png')
        convertToPng(speciesMap, callback, width, height)
      else
        return speciesMap.serialize()
    },
  }

  function convertToPng(svg, callback, width, height) {
    const image = new Image()
    const canvas = typeof createCanvas !== 'undefined' ?
            createCanvas(width, height) : document.createElement('canvas')
    const context = canvas.getContext('2d')
    image.onload = () => {
      context.drawImage(image, 0, 0, width, height)
      const png = canvas.toBuffer('image/png')
      callback(png)
    }
    image.onerror = (err) => {throw err}
    image.src = svg64(svg.serialize())
  }

  function setLegend(gridOverlay, species, language, atlas) {
    const lan = language.toUpperCase()
    setLegendTitle(gridOverlay, lan, atlas)
    const textName = 'text' + lan
    const speciesName = 'species' + lan
    gridOverlay.setText('speciesSCI', species.speciesSCI)
        .setAttributesOfElement('speciesSCI', {display: 'block'})
        .setText(speciesName, species[speciesName])
        .setAttributesOfElement(speciesName, {display: 'block'})
        .setText('breedingColourTitle', config.legend.breedingColourTitle[textName])
        .setText('colourTitle4', config.legend.colourTitle4[textName])
        .setText('colourTitle3', config.legend.colourTitle3[textName])
        .setText('colourTitle2', config.legend.colourTitle2[textName])
  }


  function setLegendTitle(gridOverlay, language, atlas) {
    const text = 'text' + language + 'Atlas' + atlas
    gridOverlay.setText('atlasTitle', config.legend.atlasTitle[text])
  }

  function getColorForBreedingCategory(breedingCategory) {
    let color = 'rgba(124,240,10,0.0)'
    if (breedingCategory === 4) color = '#228ae6'
    else if (breedingCategory === 3) color = '#66cc7a'
    else if (breedingCategory === 2) color = '#d6e573'
    return color
  }
}

module.exports = MapService
