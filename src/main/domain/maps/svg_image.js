const {DOMImplementation, XMLSerializer, DOMParser} = require('xmldom')

/**
 * Represents an SVG image with methods to manipulate the image and get information about it. Uses DOM interface
 * internally, hiding it from the user of the SVG image.
 * @param {Object} svgDocument - Either an SVG XMLDocument
 *     (https://developer.mozilla.org/en-US/docs/Web/API/XMLDocument) or an SVG string.
 * @returns {SvgImage}
 * @constructor
 */
function SvgImage(svgDocument) {
  const xmlSerializer = new XMLSerializer()
  const namespace = 'http://www.w3.org/2000/svg'
  let doc

  const docType = typeof svgDocument
  if (docType === 'undefined') doc = createEmptyDocument()
  else if (docType === 'string') doc = parseDocument(svgDocument)
  else doc = svgDocument
  const svg = doc.documentElement

  function parseDocument(svgDoc) {
    const domParser = new DOMParser()
    return domParser.parseFromString(svgDoc, 'image/svg+xml')
  }

  function createEmptyDocument() {
    const domImplementation = typeof document === 'undefined' ?
            new DOMImplementation() : document.implementation
    return domImplementation.createDocument(namespace, 'svg')
  }

  return {
    /**
     * 
     * @param {string} id 
     * @returns {SvgImage}
     */
    removeElementById(id) {
      const element = doc.getElementById(id)
      doc.removeChild(element)
      return this
    },
    /**
     * 
     * @param {string} style 
     * @returns {SvgImage}
     */
    addGlobalStyle(cssStyle) {
      const style = new DOMParser().parseFromString(`<style>${cssStyle}</style>`, 'text/css')
      svg.appendChild(style)
      return this
    },
    /**
     * Sets dimensions of this svg-image.
     * @param {number} width
     * @param {number} height
     * @returns {SvgImage}
     */
    setDimensions: function(width, height) {
      svg.setAttribute('width', width)
      svg.setAttribute('height', height)
      return this
    },
    /**
     * Returns the width of this svg-image.
     * @returns {number}
     */
    getWidth: () => parseInt(svg.getAttribute('width')),
    /**
     * Returns the height of this svg-image.
     * @returns {number}
     */
    getHeight: () => parseInt(svg.getAttribute('height')),
    setViewBox: function(minX, minY, width, height) {
      svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`)
      return this
    },
    /**
     * Sets background colour of this svg-image.
     * @param {Object} propertyMap
     * @returns {SvgImage}
     */
    setBackgroundColour: function(propertyMap) {
      this.addElement('g', {id: 'backgroundColour'}, undefined)
      const properties = {...propertyMap, width: '100%', height: '100%'}
      this.addElement('rect', properties, 'backgroundColour')
      return this
    },
    /**
     * Adds new svg-element with given tag name and given properties inside given parent element.
     * @param {string} tagName
     * @param {Object} propertyMap
     * @param {string} parentId
     * @returns {SvgImage}
     */
    addElement: function(tagName, propertyMap, parentId) {
      const element = doc.createElementNS(namespace, tagName)
      const parent = typeof parentId !== 'undefined' ?
                doc.getElementById(parentId) : svg
      if (typeof propertyMap !== 'undefined')
        mapPropertiesToAttributes(propertyMap, element)
      parent.appendChild(element)
      return this
    },
    /**
     * Adds new svg-element from string inside given parent element.
     * @param {string} svgString
     * @param {string} parentId
     * @returns {SvgImage}
     */
    addElementFromString: function(svgString, parentId) {
      const element = parseDocument(svgString)
      const parent = typeof parentId !== 'undefined' ?
                doc.getElementById(parentId) : svg
      parent.appendChild(element)
      return this
    },
    /**
     * Sets attributes of the svg-element with given id.
     * @param {string} id
     * @param {Object} propertyMap
     * @returns {SvgImage}
     */
    setAttributesOfElement: function(id, propertyMap) {
      const element = doc.getElementById(id)
      //if element does not exist ignore it
      if (!element) return this 
      mapPropertiesToAttributes(propertyMap, element)
      return this
    },
    /**
     * Sets attributes of the svg-elements within given class.
     * @param {string} className
     * @param {Object} propertyMap
     * @returns {SvgImage}
     */
    setAttributesForAllElements: function(className, propertyMap) {
      const allElements = doc.getElementsByClassName(className)
      for (let i = 0; i < allElements.length; i++)
        mapPropertiesToAttributes(propertyMap, allElements[i])

      return this
    },
    /**
     * Sets given text to svg-text-element with given id.
     * @param {string} id
     * @param {string} text
     * @returns {SvgImage}
     */
    setText: function(id, text) {
      doc.getElementById(id).textContent = text
      return this
    },
    /**
     * Returns svg-element with given id.
     * @param {string} id
     * @returns {svgElement}
     */
    returnElementById: function(id) {
      return doc.getElementById(id)
    },
    /**
     * Returns copy of this svg-image.
     * @returns {SvgImage}
     */
    copy: function() {
      return SvgImage(doc.cloneNode(true))
    },
    getSvgElement: () => svg,
    serialize: function() {
      return xmlSerializer.serializeToString(svg)
    },
    /**
     * Returns the min and max coordinates of all path elements.
     * @returns {Array}
     */
    getMinMaxCoords: function() {
      const xArray = []
      const yArray = []
      const allPaths = doc.getElementsByTagName('path')
      for (let i = 0; i < allPaths.length; i++) {
        const coords = getElementCoords(allPaths[i])
        xArray.push(coords.x)
        yArray.push(coords.y)
      }
      return coords = {
        minX: Math.min.apply(null, xArray),
        minY: Math.min.apply(null, yArray),
        maxX: Math.max.apply(null, xArray),
        maxY: Math.max.apply(null, yArray),
      }
    },
    /**
     * Returns svg-coordinates of the svg-element with given id.
     * @param {string} id
     * @returns {Array}
     */
    getElementCoordsById: function(id) {
      const element = doc.getElementById(id)
      if (element === null)
        return console.error('Element not found')
      return getElementCoords(element)
    },
    mergeSvg: function(otherSvg, scaleFactor) {
      const children = otherSvg.getSvgElement().childNodes
      for (let i = 0; i < children.length; i++) {
        const newNode = children[i].cloneNode(true)
        const transform = newNode.getAttribute('transform')
        const scale = `scale\(${scaleFactor}\)`
        const delimiter = transform === '' ? '' : ' '
        const newTransform = scale.concat(delimiter, transform)
        newNode.setAttribute('transform', newTransform)
        svg.appendChild(newNode)
      }
      return this
    },
  }

  function mapPropertiesToAttributes(propertyMap, svgElement) {
    // console.log("mapPropertiesin elementti: ", svgElement)
    // eslint-disable-next-line guard-for-in
    for (const prop in propertyMap)
      svgElement.setAttributeNS(null, prop, propertyMap[prop])
  }

  function getElementCoords(element) {
    let x; let y
    if (element.tagName === 'circle') {
      x = element.getAttribute('cx')
      y = element.getAttribute('cy')
    } else if (element.tagName === 'path') {
      const d = element.getAttribute('d')
      const coordString = d.replace(/[a-zA-Z]/g, '')
      x = coordString.split(',')[0]
      y = coordString.split(',')[1]
    } else {
      x = element.getAttribute('x')
      y = element.getAttribute('y')
    }
    return {x: parseFloat(x), y: parseFloat(y)}
  }
}

module.exports = SvgImage
