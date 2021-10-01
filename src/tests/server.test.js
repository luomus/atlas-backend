const request = require('supertest')
const app = require('../main/server')
jest.mock('../main/dao/bird_dao')
jest.mock('../main/dao/grid_dao')

describe('Bird API', () => {

    test('GET /api/birds responds with JSON', () => {
        return request(app)
            .get('/api/birds')
            .expect(200)
            // .expect('content-type', /application\/json/)
    })

    test('GET /api/birds responds with data of all birds', () => {
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

describe('Bird atlas grid API', () => {

    test('GET /api/grids responds with JSON', () => {
        return request(app)
            .get('/api/grid')
            .expect(200)
            // .expect('content-type', /application\/json/)
    })

    test('GET /api/grids responds with all grid data', () => {
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

    describe('Map API', () => {

        test('GET /api/grid/map responds', () => {
            return request(app)
                .get('/api/grid/map')
                .expect(200)
        })
    
    })

})
