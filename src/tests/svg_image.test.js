const SvgImage = require('../main/domain/maps/svg_image')
const { DOMImplementation, XMLSerializer, DOMParser } = require('xmldom')

let svgImage

beforeEach(() => {
    svgImage = new SvgImage()
    svgImage.setDimensions(10, 20)
})

test('An empty svg image is created', () => new SvgImage())

test('initEmptyDocument creates svg with correct width & height', () => {
    svgImage.setDimensions(200, 300)
    const svg1 = svgImage.serialize()
    svgImage.setDimensions(10, 10)
    const svg2 = svgImage.serialize()

    expect(svg1).toMatch(/^<svg.+\/>$/)
    expect(svg1).toContain('width="200"')
    expect(svg1).toContain('height="300"')
    expect(svg1).toContain('xmlns="http://www.w3.org/2000/svg"')

    expect(svg2).toMatch(/^<svg.+\/>$/)
    expect(svg2).toContain('width="10"')
    expect(svg2).toContain('height="10"')
    expect(svg2).toContain('xmlns="http://www.w3.org/2000/svg"')
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

test('addCircle adds circle element with correct attributes', () => {
    const propertyMap1 = {id: 1, cx: 1, cy: 1, fill: "black", r: 0.5}
    const propertyMap2 = {id: 2, cx: 5, cy: 10, fill: "red", r: 1}
    svgImage.addCircle(propertyMap1)
    svgImage.addCircle(propertyMap2)
    const svg = svgImage.serialize()

    expect(svg).toMatch(/^<svg.+\>.+<\/svg>$/)
    expect(svg).toContain('<circle id="1" cx="1" cy="1" fill="black" r="0.5"/>')
    expect(svg).toContain('<circle id="2" cx="5" cy="10" fill="red" r="1"/>')
})

test('addCircle adds no extra attributes to circle', () => {
    const propertyMap = {testProperty: 1}
    svgImage.addCircle(propertyMap)
    const svg = svgImage.serialize()

    expect(svg).toMatch(/^<svg.+\>.+<\/svg>$/)
    expect(svg).toContain('<circle testProperty="1"/>')
    expect(svg).not.toContain('fill')
})

test('copy works correctly', () => {
    svgImage.addCircle({testProperty: 1})
    const copy = svgImage.copy()
    copy.setDimensions(1, 1)
    const svg = copy.serialize()

    expect(svg).toContain('<circle testProperty="1"/>')
    expect(svg).not.toContain('width="10"')
    expect(svg).not.toContain('height="20"')
})

test('changeDisplayForAll changes display to block', () => {
    svgImage.addCircle({testProperty: 1})
    svgImage.changeDisplayForAll(display = true)
    const svg = svgImage.serialize()

    expect(svg).toContain('display=\"block\"')
})

test('changeDisplayForAll changes display to none', () => {
    svgImage.addCircle({testProperty: 1})
    svgImage.changeDisplayForAll(display = false)
    const svg = svgImage.serialize()

    expect(svg).toContain('display=\"none\"')
})

test('setAtrribute changes the color of a circle', () => {
    svgImage.addCircle({testProperty: 1, id: 1})
    svgImage.setAttribute(1, {fill: 'red'})
    const svg = svgImage.serialize()

    expect(svg).toContain('fill=\"red\"')
})