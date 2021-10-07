const SvgService = require('../main/domain/maps/svg_service')
const { DOMImplementation, XMLSerializer, DOMParser } = require('xmldom')

test('initEmptyDocument creates svg with correct width & height', () => {
    const svgService = new SvgService()
    svgService.initEmptyDocument(200, 300)
    const svg = svgService.serializeDocument()
    console.log(svg)
    expect(svg).toMatch(/^<svg.+\/>$/)
    expect(svg).toContain('width="200"')
    expect(svg).toContain('height="300"')
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
})