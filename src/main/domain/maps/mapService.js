const {createCanvas, Image} = require('canvas')
const svg64 = require('svg64')
const urlRemover = require('../../helpers/urlRemover')

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
function MapService(atlasMap, config) {
  if (typeof atlasMap === 'undefined')
    return console.error('Wrong number of arguments: atlasMap should be defined')

  return {
    /**
     * Returns the SVGImage of species breeding map with given parameters.
     * @param {Object} data
     * @param {Object} grid
     * @param {Object} species
     * @param {Object} callback
     * @param {string} type
     * @param {number} scaleFactor
     * @param {string} language
     * @param {number} atlas
     * @param {boolean} showActivity
     * @returns {SvgImage}
     */
    getSpeciesMap: function(data, grid = [], species, callback, type = 'svg', scaleFactor = 4, language = 'fi', atlas, showActivity) {
      const speciesMap = atlasMap.copy()
      const atlasClassLookup = {}
      const counts = {
        'MY.atlasClassEnumD': 0,
        'MY.atlasClassEnumC': 0,
        'MY.atlasClassEnumB': 0,
        'total': 0
      }
      for (let i = 0; i < data.length; i++) {
        const cssClass = getClassForAtlasClass(data[i].atlasClass)
        speciesMap.setAttributesOfElement(data[i].grid, {class: `cir ${cssClass}`})

        atlasClassLookup[data[i].grid] = urlRemover(data[i].atlasClass)
      }

      for (let i = 0; i < grid.length; i++) {
        const coords = grid[i].grid
        const atlasClass = atlasClassLookup[coords]

        if (atlasClass !== undefined && atlasClass.slice(-1) !== 'A') {
          counts[atlasClass] += 1
          counts['total'] += 1
        }
        if (showActivity) {
          const cssClass = getClassForActivityCategory(grid[i].activityCategory)
          const id = `${grid[i].grid}bg`
          speciesMap.setAttributesOfElement(id, {class: cssClass})
        } else {
          speciesMap.removeElementById('activityLegend')
        }
      }

      let width = speciesMap.getWidth()
      let height = speciesMap.getHeight()
      
      if (scaleFactor > 0) {
        width = width * scaleFactor
        height = height * scaleFactor
        speciesMap.setDimensions(width, height)
      } else {
        speciesMap.setDimensions('100%', '100%')
      }
  
      setLegend(speciesMap, species, language, atlas, showActivity, counts)
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

  function capitalizeFirst(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  function setLegend(gridOverlay, species, language, atlas, showActivity, counts) {
    const lan = language.toUpperCase()
    const speciesName = 'species' + lan
    setLegendTitle(gridOverlay, lan, atlas)
    const textName = 'text' + lan
    gridOverlay.setText('speciesSCI', species.scientificName)
      .setAttributesOfElement('speciesSCI', {display: 'block'})
      .setText(speciesName, capitalizeFirst(species.vernacularName[language]))
      .setAttributesOfElement(speciesName, {display: 'block'})
      .setText('breedingColourTitle', config.legend.breedingColourTitle[textName])
      .setText('breedingColourTitle4', config.legend.breedingColourTitle4[textName])
      .setText('breedingColourTitle3', config.legend.breedingColourTitle3[textName])
      .setText('breedingColourTitle2', config.legend.breedingColourTitle2[textName])
      .setText('breedingCountTotalTitle', config.legend.breedingCountTotalTitle[textName])
      .setText('breedingCountTitle', config.legend.breedingCountTitle[textName])
      .setText('breedingCountClassD', counts['MY.atlasClassEnumD'])
      .setText('breedingCountClassC', counts['MY.atlasClassEnumC'])
      .setText('breedingCountClassB', counts['MY.atlasClassEnumB'])
      .setText('breedingCountTotal', counts['total'])

    if (showActivity) {
      gridOverlay.setText('activityColourTitle', config.legend.activityColourTitle[textName])
      .setText('activityColourTitle5', config.legend.activityColourTitle5[textName])
      .setText('activityColourTitle4', config.legend.activityColourTitle4[textName])
      .setText('activityColourTitle3', config.legend.activityColourTitle3[textName])
      .setText('activityColourTitle2', config.legend.activityColourTitle2[textName])
      .setText('activityColourTitle1', config.legend.activityColourTitle1[textName])
      .setText('activityColourTitle0', config.legend.activityColourTitle0[textName])
    }
  }


  function setLegendTitle(gridOverlay, language, atlas) {
    const text = 'text' + language + 'Atlas' + atlas
    gridOverlay.setText('atlasTitle', config.legend.atlasTitle[text])
  }

  function getClassForAtlasClass(atlasClass) {
    const atlasClassLetter = atlasClass.slice(-1)
    const cssClass = atlasClassLetter === 'D' ? 'classD' :
      (atlasClassLetter === 'C') ? 'classC':
      (atlasClassLetter === 'B') ? 'classB' :
      'classA'
    return cssClass
  }

  function getClassForActivityCategory(activityCategory) {
    const cssClass = activityCategory === 'MY.atlasActivityCategoryEnum5' ? 'category5' :
      activityCategory === 'MY.atlasActivityCategoryEnum4' ? 'category4' :
      activityCategory === 'MY.atlasActivityCategoryEnum3' ? 'category3' :
      activityCategory === 'MY.atlasActivityCategoryEnum2' ? 'category2' :
      activityCategory === 'MY.atlasActivityCategoryEnum1' ? 'category1' :
      'category0'
    return cssClass
  }
}

module.exports = MapService