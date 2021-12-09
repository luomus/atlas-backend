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
    getSpeciesMap: function(data, grid, species, callback, type = 'svg', scaleFactor = 4, language = 'fi', atlas) {
      const speciesMap = atlasMap.copy()
      data.forEach((datapoint) => {
        const colour = getColourForBreedingCategory(datapoint.breedingCategory)
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
        .setText('breedingColourTitle4', config.legend.breedingColourTitle4[textName])
        .setText('breedingColourTitle3', config.legend.breedingColourTitle3[textName])
        .setText('breedingColourTitle2', config.legend.breedingColourTitle2[textName])
        .setText('activityColourTitle', config.legend.activityColourTitle[textName])
        .setText('activityColourTitle5', config.legend.activityColourTitle5[textName])
        .setText('activityColourTitle4', config.legend.activityColourTitle4[textName])
        .setText('activityColourTitle3', config.legend.activityColourTitle3[textName])
        .setText('activityColourTitle2', config.legend.activityColourTitle2[textName])
        .setText('activityColourTitle1', config.legend.activityColourTitle1[textName])
        .setText('activityColourTitle0', config.legend.activityColourTitle0[textName])
  }


  function setLegendTitle(gridOverlay, language, atlas) {
    const text = 'text' + language + 'Atlas' + atlas
    gridOverlay.setText('atlasTitle', config.legend.atlasTitle[text])
  }

  function getColourForBreedingCategory(breedingCategory) {
    const colour = breedingCategory === 4 ? config.breedingCategoryColour.category4
      : (breedingCategory === 3) ? config.breedingCategoryColour.category3
      : (breedingCategory === 2) ? config.breedingCategoryColour.category2
      : 'rgba(124,240,10,0.0)'
    return colour
  }

  function getColourForActivityCategory(activityCategory) {
    const colour = activityCategory === 5 ? config.activityCategoryColour.category5
      : activityCategory === 4 ? config.activityCategoryColour.category4
      : activityCategory === 3 ? config.activityCategoryColour.category3
      : activityCategory === 2 ? config.activityCategoryColour.category2
      : activityCategory === 1 ? config.activityCategoryColour.category1
      : config.activityCategoryColour.category0
    return colour
  }
}

module.exports = MapService
