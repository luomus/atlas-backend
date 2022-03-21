const request = require('supertest')
const app = require('../main/server')
jest.mock('../main/dao/atlasGridSpeciesDataDao')
jest.mock('../main/dao/atlasGridDao')
jest.mock('../main/dao/atlasDao')
jest.mock('../main/dao/gridDao')
jest.mock('../main/dao/apiDao')

// eslint-disable-next-line max-lines-per-function
describe('Collection GRID', () => {
  describe('Get grid information from API', () => {
    test('GET /api/v1/grid/:gridId responds with JSON', (done) => {
      request(app)
          .get('/api/v1/grid/690:330')
          .expect(200, done)
          .expect('content-type', /application\/json/)
    })

    test('GET /api/v1/grid/:gridId responds with correct data ', async () => {
      const res1 = await request(app).get('/api/v1/grid/690:330')
      expect(res1.text).toContain('Kihniö, Kihniön keskusta')
    })
  })

  describe('Get statistics for one area and atlas from API', () => {
    test('GET /api/v1/grid/:gridId/atlas responds with JSON', (done) => {
      request(app)
          .get('/api/v1/grid/667:337/atlas/')
          .expect(200, done)
          .expect('content-type', /application\/json/)
    })

    /** 
    test('GET /api/v1/drid/:gridId/atlas/:atlasId responds with JSON', (done) => {
      request(app)
          .get('/api/v1/grid/667:337/atlas/4')
          .expect(200, done)
          .expect('content-type', /application\/json/)
    })

    test('GET /api/v1/grid/:gridId/atlas/:atlasId responds with correct data ', async () => {
      const res1 = await request(app).get('/api/v1/grid/667:337/atlas/4')
      console.group(res1)
      expect(res1.text).toContain('categoryNumber')
      expect(res1.text).toContain('3')
    })
    */
  })
})


// eslint-disable-next-line max-lines-per-function
describe('Collection MAP', () => {
  describe('Get atlas maps for species from API', () => {
    test('GET /api/v1/map/:speciesId/atlas/:atlasId responds with svg', (done) => {
      request(app)
          .get('/api/v1/map/MX.27697/atlas')
          .expect(200, done)
          .expect('content-type', /image\/svg/)
    })

  //   test('GET /api/v1/map/:speciesId/atlas/:atlasId responds with correct data ', async () => {
  //     const res1 = await request(app).get('/api/v1/map/MX.27697/atlas/3')
  //     expect(res1.text).toContain('767780')
  //   })
  })


  // describe('Get atlas data for one atlas and species from API', () => {
  //   test('GET /api/v1/taxon/:speciesId/atlas/:atlasId responds with JSON', (done) => {
  //     request(app)
  //         .get('/api/v1/taxon/:speciesId/atlas/3')
  //         .query({speciesId: 'MX.25836'})
  //         .expect(200, done)
  //         .expect('content-type', /application\/json/)
  //   })

  //   test('GET /api/v1/taxon/:speciesId/atlas/:atlasId responds with correct data ', async () => {
  //     const res1 = await request(app).get('/api/v1/taxon/MX.25836/atlas/3')
  //     const res2 = await request(app).get('/api/v1/taxon/MX.25837/atlas/3')

  //     expect(res1.text).toContain('725693')
  //     expect(res1.text).toContain('725694')
  //     expect(res1.text).toContain('725695')
  //     expect(res1.text).toEqual(expect.not.stringContaining('MX.25837'))
  //     expect(res1.text).toEqual(expect.not.stringContaining('MX.25844'))

  //     expect(res2.text).toContain('726848')
  //     expect(res2.text).toContain('726849')
  //     expect(res2.text).toContain('726850')
  //     expect(res2.text).toEqual(expect.not.stringContaining('MX.25836'))
  //     expect(res2.text).toEqual(expect.not.stringContaining('MX.25844'))
  //   })
  // })
})
