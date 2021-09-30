const request = require('supertest')
const response = require('supertest')
const BirdDao = require('../main/dao/bird_dao')
const birds = require('../main/domain/routes/birds')
jest.mock('../main/dao/bird_dao')

describe('Birds', () => {

    test('getAll', () => {
        
    })

})