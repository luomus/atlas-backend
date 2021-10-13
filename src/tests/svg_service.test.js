const SvgService = require('../main/domain/maps/svg_image')
const { DOMImplementation, XMLSerializer, DOMParser } = require('xmldom')

const svgService = new SvgService()

beforeEach(() => {
    svgService.initEmptyImage(10, 20)
})

test('initEmptyDocument creates svg with correct width & height', () => {
    svgService.initEmptyImage(200, 300)
    const svg1 = svgService.serializeImage()
    svgService.initEmptyImage(10, 10)
    const svg2 = svgService.serializeImage()

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
    svgService.setViewBox(0, 0, 10, 20)
    const svg1 = svgService.serializeImage()
    svgService.setViewBox(1, 2, 3, 4)
    const svg2 = svgService.serializeImage()

    expect(svg1).toMatch(/^<svg.+\/>$/)
    expect(svg1).toContain('viewBox="0 0 10 20"')

    expect(svg2).toMatch(/^<svg.+\/>$/)
    expect(svg2).toContain('viewBox="1 2 3 4"')
})

test('addCircle adds circle element with correct attributes', () => {
    const propertyMap1 = {id: 1, cx: 1, cy: 1, fill: "black", r: 0.5}
    const propertyMap2 = {id: 2, cx: 5, cy: 10, fill: "red", r: 1}
    svgService.addCircle(propertyMap1)
    svgService.addCircle(propertyMap2)
    const svg = svgService.serializeImage()

    expect(svg).toMatch(/^<svg.+\>.+<\/svg>$/)
    expect(svg).toContain('<circle id="1" cx="1" cy="1" fill="black" r="0.5"/>')
    expect(svg).toContain('<circle id="2" cx="5" cy="10" fill="red" r="1"/>')
})

test('addCircle adds no extra attributes to circle', () => {
    const propertyMap = {testProperty: 1}
    svgService.addCircle(propertyMap)
    const svg = svgService.serializeImage()

    expect(svg).toMatch(/^<svg.+\>.+<\/svg>$/)
    expect(svg).toContain('<circle testProperty="1"/>')
    expect(svg).not.toContain('fill')
})
