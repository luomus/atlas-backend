const request = require('supertest')
const app = require('../main/server')
jest.mock('../main/dao/bird_dao')
jest.mock('../main/dao/bird_grid_dao')
jest.mock('../main/dao/grid_dao')

describe('Bird API', () => {

    test('GET /api/birds responds with JSON', () => {
        return request(app)
            .get('/api/birds')
            .expect(200)
            .expect('content-type', /application\/json/)
    })

    test('GET /api/birds responds with data of all birds', async () => {
        return request(app)
            .get('/api/birds')
            .then((response) => {
                expect(response.text).toContain('Kaakkuri')
                expect(response.text).toContain('Kuikka')
                expect(response.text).toContain('Pikku-uikku')
                expect(response.text).toContain('Härkälintu')
                expect(response.text).toContain('Silkkiuikku')
            })
    })

})

describe('Grid API', () => {

    test('GET /api/grid responds with JSON', () => {
        return request(app)
            .get('/api/grid')
            .expect(200)
            .expect('content-type', /application\/json/)
    })

    test('GET /api/grid responds with all grid data', async () => {
        return request(app)
            .get('/api/grid')
            .then((response) => {
                expect(response.text).toContain('661312')
                expect(response.text).toContain('663318')
                expect(response.text).toContain('663319')
                expect(response.text).toContain('663320')
                expect(response.text).toContain('663321')
            })
    })

})

describe('Map API', () => {

    test('GET /api/grid/map responds with SVG', () => {
        return request(app)
            .get('/api/grid/map')
            .expect(200)
            .expect('content-type', /svg/)
    })

})

describe('Bird species API', () => {

    test('GET /api/species responds with JSON', (done) => {
        request(app)
            .get('/api/species')
            .query({ mxcode: '25836' })
            .expect(200, done)
            .expect('content-type', /application\/json/)
    })

    test('GET /api/species responds with correct data ', async () => {
        const res1 = await request(app).get('/api/species').query({ id: '25836' })
        const res2 = await request(app).get('/api/species').query({ id: '25837' })

        expect(res1.text).toContain('725693')
        expect(res1.text).toContain('725694')
        expect(res1.text).toContain('725695')
        expect(res1.text).toEqual(expect.not.stringContaining('25837'))
        expect(res1.text).toEqual(expect.not.stringContaining('25844'))
        
        expect(res2.text).toContain('726848')
        expect(res2.text).toContain('726849')
        expect(res2.text).toContain('726850')
        expect(res2.text).toEqual(expect.not.stringContaining('25836'))
        expect(res2.text).toEqual(expect.not.stringContaining('25844'))
    })

})

describe('Map service compiles correctly', () => {
    let server

    beforeAll(async () => {
        server = app.listen(3000)
        await page.goto('http://localhost:3000/bird_atlas')
    })

    afterEach(() => server.close())

    it('should be titled "Bird Atlas Example"', async () => {
        await expect(page.title()).resolves.toMatch('Bird Atlas Example');
    })

})
