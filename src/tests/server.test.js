const request = require('supertest')
const app = require('../main/server')
jest.mock('../main/dao/species_dao')
jest.mock('../main/dao/atlas_data_dao')
jest.mock('../main/dao/grid_dao')

describe('species list from API', () => {
  test('GET /api/v1/taxon responds with JSON', () => {
    return request(app)
        .get('/api/v1/taxon')
        .expect(200)
        .expect('content-type', /application\/json/)
  })

  test('GET /api/v1/taxon responds with data of all species', async () => {
    return request(app)
        .get('/api/v1/taxon')
        .then((response) => {
          expect(response.text).toContain('Kaakkuri')
          expect(response.text).toContain('Kuikka')
          expect(response.text).toContain('Pikku-uikku')
          expect(response.text).toContain('Härkälintu')
          expect(response.text).toContain('Silkkiuikku')
        })
  })
})

describe('species info from API', () => {
  test('GET /api/v1/taxon/:id/atlas/3 responds with JSON', (done) => {
    request(app)
        .get('/api/v1/taxon/25836/atlas/3')
        .query({mxcode: '25836'})
        .expect(200, done)
        .expect('content-type', /application\/json/)
  })

  test('GET /api/v1/taxon/:id/atlas/3 responds with correct data ', async () => {
    const res1 = await request(app).get('/api/v1/taxon/25836/atlas/3')
    const res2 = await request(app).get('/api/v1/taxon/25837/atlas/3')

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

describe('grid data from API', () => {
  test('GET /api/v1/grid/:id/atlas/3 responds with JSON', (done) => {
    request(app)
      .get('/api/v1/grid/664329/atlas/3')
      .expect(200, done)
      .expect('content-type', /application\/json/)
  })

  test('GET /api/v1/grid/:id/atlas/3 responds with correct data ', async () => {
    const res1 = await request(app).get('/api/v1/grid/664329/atlas/3')

    expect(res1.text).toContain('10')

  })
})

describe('species stats from API', () => {
  test('GET /api/v1/taxon/:id/stats/3 responds with JSON', (done) => {
    request(app)
      .get('/api/v1/taxon/27850/stats/3')
      .expect(200, done)
      .expect('content-type', /application\/json/)
  })

  test('GET /api/v1/taxon/:id/stats/3 responds with correct data ', async () => {
    const res1 = await request(app).get('/api/v1/taxon/27697/stats/3')

    expect(res1.text).toContain('19')
    expect(res1.text).toContain('767780')

  })
})

describe('grid stats from API', () => {
  test('GET /api/v1/grid/:speciesId/stats/:atlasId responds with JSON', (done) => {
    request(app)
      .get('/api/v1/grid/664329/stats/3')
      .expect(200, done)
      .expect('content-type', /application\/json/)
  })

  test('GET /api/v1/grid/:speciesId/stats/:atlasId responds with correct data ', async () => {
    const res1 = await request(app).get('/api/v1/grid/664329/stats/3')

    expect(res1.text).toContain('categoryNumber')
    expect(res1.text).toContain('3')

  })
})