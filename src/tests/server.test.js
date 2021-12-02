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

describe('Bird species API', () => {
  test('GET /api/species responds with JSON', (done) => {
    request(app)
        .get('/api/species')
        .query({mxcode: '25836'})
        .expect(200, done)
        .expect('content-type', /application\/json/)
  })

  test('GET /api/species responds with correct data ', async () => {
    const res1 = await request(app).get('/api/species').query({id: '25836'})
    const res2 = await request(app).get('/api/species').query({id: '25837'})

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
