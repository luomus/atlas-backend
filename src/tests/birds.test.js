const supertest = require('supertest')
const Birds = require('../main/domain/routes/birds')

const BirdDao = require('../main/dao/bird_dao')
jest.mock('../main/dao/bird_dao')

jest.mock('../main/dao/querier_factory')
const querier = require('../main/dao/querier_factory')

const request = supertest(Birds)

test('', async () => {
    
})
