const SvgImage = require('../main/domain/maps/svg_image')
const { DOMImplementation, XMLSerializer, DOMParser } = require('xmldom')

let svgImage

beforeEach(() => {
    svgImage = new SvgImage()
    svgImage.setDimensions(10, 20)
})

test('An empty svg image is created', () => {
    const svg = new SvgImage()
    expect(svg.serialize()).toEqual('<svg xmlns="http://www.w3.org/2000/svg"/>')
})

test('setDimensions sets correct width', () => {
    svgImage.setDimensions(200, 300)
    const svg = svgImage.serialize()
    expect(svg).toMatch(/^<svg.+\/>$/)
    expect(svg).toContain('width="200"')
})

test('setDimensions sets correct height', () => {
    svgImage.setDimensions(200, 300)
    const svg = svgImage.serialize()
    expect(svg).toMatch(/^<svg.+\/>$/)
    expect(svg).toContain('height="300"')
})

test('setViewBox sets correct attributes', () => {
    svgImage.setViewBox(0, 0, 10, 20)
    const svg1 = svgImage.serialize()
    svgImage.setViewBox(1, 2, 3, 4)
    const svg2 = svgImage.serialize()

    expect(svg1).toMatch(/^<svg.+\/>$/)
    expect(svg1).toContain('viewBox="0 0 10 20"')

    expect(svg2).toMatch(/^<svg.+\/>$/)
    expect(svg2).toContain('viewBox="1 2 3 4"')
})

test('addElement adds element with correct attributes', () => {
    const propertyMap1 = {id: 1, cx: 1, cy: 1, fill: "black", r: 0.5}
    const propertyMap2 = {id: 2, cx: 5, cy: 10, fill: "red", r: 1}
    svgImage.addElement('circle', propertyMap1)
    svgImage.addElement('circle', propertyMap2)
    const svg = svgImage.serialize()

    expect(svg).toMatch(/^<svg.+\>.+<\/svg>$/)
    expect(svg).toContain('<circle id="1" cx="1" cy="1" fill="black" r="0.5"/>')
    expect(svg).toContain('<circle id="2" cx="5" cy="10" fill="red" r="1"/>')
})

test('copy works correctly', () => {
    svgImage.addElement('circle', {testProperty: 1})
    const copy = svgImage.copy()
    copy.setDimensions(1, 1)
    const svg = copy.serialize()

    expect(svg).toContain('<circle testProperty="1"/>')
    expect(svg).not.toContain('width="10"')
    expect(svg).not.toContain('height="20"')
})

test('setAttributesOfElement sets a new attribute', () => {
    svgImage.addElement('circle', {testProperty: 1, id: 1})
    svgImage.setAttributesOfElement(1, {fill: 'red'})
    const svg = svgImage.serialize()

    expect(svg).toContain('fill=\"red\"')
})

test('setAttributesOfElement updates an existing attribute', () => {
    svgImage.addElement('circle', {id: 1, testProperty: 1, fill: 'red'})
    svgImage.setAttributesOfElement(1, {fill: 'black'})
    const svg = svgImage.serialize()

    expect(svg).not.toContain('fill=\"red\"')
    expect(svg).toContain('fill=\"black\"')
})

test('setAttributesForAllElements sets a new attribute for all elements', () => {
    svgImage.addElement('circle', {id: 1, class: 'testClass'})
    svgImage.addElement('circle', {id: 2, class: 'testClass'})
    svgImage.setAttributesForAllElements('testClass', {fill: 'red'})
    const svg = svgImage.serialize()
    
    expect(svg).toContain('id="1" class="testClass" fill="red"')
    expect(svg).toContain('id="2" class="testClass" fill="red"')
})

test('setAttributesForAllElements updates an existing attribute for all elements', () => {
    svgImage.addElement('circle', {id: 1, class: 'testClass', display: 'block'})
    svgImage.addElement('circle', {id: 2, class: 'testClass', display: 'block'})
    svgImage.setAttributesForAllElements('testClass', {display: 'none'})
    const svg = svgImage.serialize()

    expect(svg).not.toContain('display="block')
    expect(svg).toContain('id="1" class="testClass" display="none')
    expect(svg).toContain('id="2" class="testClass" display="none')
})
