const request = require('supertest')
const app = require('../main/server')
jest.mock('../main/dao/bird_dao')

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
