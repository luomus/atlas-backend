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
function MapService(atlasMap, configObject) {
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
         * @returns {SvgImage}
         */
    getSpeciesMap: function(data, grid, species, callback, type = 'svg', scaleFactor = 4, language = 'fi') {
      const speciesMap = atlasMap.copy()
      data.forEach((datapoint) => {
        const colour = getColorForBreedingCategory(datapoint.breedingCategory)
        speciesMap.setAttributesOfElement(datapoint.id, {fill: colour, display: 'block'})
      })
      grid.forEach((datapoint) => {
        const colour = getColourForActivityCategory(datapoint.activityCategory)
        const id = `${datapoint.grid_id}bg`
        speciesMap.setAttributesOfElement(id, {fill: colour})
      })
      const width = speciesMap.getWidth() * scaleFactor
      const height = speciesMap.getHeight() * scaleFactor
      speciesMap.setDimensions(width, height)
      setLegend(speciesMap, species, language)
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

  function setLegend(gridOverlay, species, language) {
    gridOverlay.setText('speciesSCI', species.speciesSCI)
        .setAttributesOfElement('speciesSCI', {display: 'block'})
    if (language === 'fi')
      gridOverlay.setText('speciesFI', species.speciesFI)
          .setAttributesOfElement('speciesFI', {display: 'block'})
          .setText('atlasTitle', configObject.legend.atlasTitle.textFI)
          .setText('breedingColourTitle', configObject.legend.breedingColourTitle.textFI)
          .setText('colourTitle4', configObject.legend.colourTitle4.textFI)
          .setText('colourTitle3', configObject.legend.colourTitle3.textFI)
          .setText('colourTitle2', configObject.legend.colourTitle2.textFI)
    else if (language === 'sv')
      gridOverlay.setText('speciesSV', species.speciesSV)
          .setAttributesOfElement('speciesSV', {display: 'block'})
          .setText('atlasTitle', configObject.legend.atlasTitle.textSV)
          .setText('breedingColourTitle', configObject.legend.breedingColourTitle.textSV)
          .setText('colourTitle4', configObject.legend.colourTitle4.textSV)
          .setText('colourTitle3', configObject.legend.colourTitle3.textSV)
          .setText('colourTitle2', configObject.legend.colourTitle2.textSV)
    else if (language === 'en')
      gridOverlay.setText('speciesEN', species.speciesEN)
          .setAttributesOfElement('speciesEN', {display: 'block'})
          .setText('atlasTitle', configObject.legend.atlasTitle.textEN)
          .setText('breedingColourTitle', configObject.legend.breedingColourTitle.textEN)
          .setText('colourTitle4', configObject.legend.colourTitle4.textEN)
          .setText('colourTitle3', configObject.legend.colourTitle3.textEN)
          .setText('colourTitle2', configObject.legend.colourTitle2.textEN)
  }

  function getColorForBreedingCategory(breedingCategory) {
    let color = 'rgba(124,240,10,0.0)'
    if (breedingCategory === 4) color = '#228ae6'
    else if (breedingCategory === 3) color = '#66cc7a'
    else if (breedingCategory === 2) color = '#d6e573'
    return color
  }

  function getColourForActivityCategory(activityCategory) {
    const colour = activityCategory === 5 ? '#63748f'
      : activityCategory === 4 ? '#7e8fab'
      : activityCategory === 3 ? '#99a9c4 '
      : activityCategory === 2 ? '#b2c1db'
      : activityCategory === 1 ? '#cedbf2'
      : 'white'
    return colour
  }

}

module.exports = MapService
