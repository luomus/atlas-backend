const request = require('supertest')
const app = require('../main/server')
jest.mock('../main/dao/species_dao')
jest.mock('../main/dao/atlas_data_dao')
jest.mock('../main/dao/atlas_grid_dao')
jest.mock('../main/dao/atlas_dao')
jest.mock('../main/dao/grid_dao')


// eslint-disable-next-line max-lines-per-function
describe('Collection SPECIES', () => {

  describe('Get species list from API', () => {
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

  describe('Get species info from API', () => {
    test('GET /api/v1/taxon/:speciesId responds with JSON', (done) => {
      request(app)
          .get('/api/v1/taxon/MX.25836')
          .expect(200, done)
          .expect('content-type', /application\/json/)
    })

    test('GET /api/v1/taxon/:speciesId responds with correct data ', async () => {
      const res1 = await request(app).get('/api/v1/taxon/MX.25836')
      expect(res1.text).toContain('MX.25836')
    })   
  })
  
  // describe('Get species statistics for all atlases from API', () => {
  //   test('GET /api/v1/taxon/:speciesId/atlas responds with JSON', (done) => {
  //     request(app)
  //         .get('/api/v1/taxon/MX.25836/atlas')
  //         .expect(200, done)
  //         .expect('content-type', /application\/json/)
  //   })
  
  //   test('GET /api/v1/taxon/:speciesId/atlas responds with correct data ', async () => {
  //     const res1 = await request(app).get('/api/v1/taxon/MX.25836/atlas')
  //     expect(res1.text).toContain('MX.25836')
  //     expect(res1.text).not.toContain('MX.25844')
  //   })
  // })

  //  describe('Get species statistics for one atlas from API', () => {
  //   test('GET /api/v1/taxon/:speciesId/atlas/:atlasId responds with JSON', (done) => {
  //     request(app)
  //         .get('/api/v1/taxon/MX.25836/atlas/3')
  //         .expect(200, done)
  //         .expect('content-type', /application\/json/)
  //   })
  
    // test('GET /api/v1/taxon/:speciesId/atlas/:atlasId responds with correct data ', async () => {
    //   const res1 = await request(app).get('/api/v1/taxon/MX.25836/atlas/3')
    //   const res2 = await request(app).get('/api/v1/taxon/MX.25837/atlas/3')
    //   expect(res1.text).toContain('MX.25836')
    //   expect(res1.text).toContain('statistics')
    //   expect(res1.text).not.toContain('MX.25844')
    //   expect(res2.text).toContain('MX.25837')
    //   expect(res2.text).not.toContain('MX.25844')
    // })
  // })
})


// eslint-disable-next-line max-lines-per-function
describe('Collection AREA', () => {

  describe('Get area information from API', () => {
    test('GET /api/v1/area/:areaId responds with JSON', (done) => {
      request(app)
          .get('/api/v1/area/664329')
          .expect(200, done)
          .expect('content-type', /application\/json/)
    })
  
    test('GET /api/v1/area/:areaId responds with correct data ', async () => {
      const res1 = await request(app).get('/api/v1/area/664329')
      expect(res1.text).toContain('Älgö')
    })
  })
  
  describe('Get statistics for one area and atlas from API', () => {
    test('GET /api/v1/area/:areaId/atlas/:atlasId responds with JSON', (done) => {
      request(app)
          .get('/api/v1/area/664329/atlas/3')
          .expect(200, done)
          .expect('content-type', /application\/json/)
    })
  
    test('GET /api/v1/area/:areaId/atlas/:atlasId responds with correct data ', async () => {
      const res1 = await request(app).get('/api/v1/area/664329/atlas/3')
      expect(res1.text).toContain('categoryNumber')
      expect(res1.text).toContain('3')
    })
  })
})


// eslint-disable-next-line max-lines-per-function
describe('Collection MAP', () => {

  describe('Get atlas maps for species from API', () => {
    test('GET /api/v1/map/:speciesId/atlas/:atlasId responds with svg', (done) => {
      request(app)
          .get('/api/v1/map/MX.27697/atlas/3')
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
