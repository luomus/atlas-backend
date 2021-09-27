const app = require('../main/server')
const supertest = require('supertest')
const request = supertest(app)

test('', async () => {
    await request
        .get('/api/birds')
        .expect(200)
        // .expect('content-type', /application\/json/)
})
