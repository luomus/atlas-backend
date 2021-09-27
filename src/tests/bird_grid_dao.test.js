const BirdGridDao = require('../main/dao/bird_grid_dao')

jest.mock('../main/dao/querier_factory')
const querier = require('../main/dao/querier_factory')

beforeEach(() => {
    querier.mockClear()
})

test('', () => {
    
})