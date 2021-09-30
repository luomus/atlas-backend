const BirdGridDao = require('../main/dao/bird_grid_dao')

jest.mock('../main/dao/querier_factory')
const querier = require('../main/dao/querier_factory')

beforeEach(() => {
    querier.mockClear()
})

test('getGridByIdAtlas3 calls querier correctly', () => {
    const birdGridDao = new BirdGridDao(querier)
    birdGridDao.getGridByIdAtlas3(1)
    birdGridDao.getGridByIdAtlas3(2)

    expect(querier).toHaveBeenCalledTimes(2)
    expect(querier.mock.calls[0][0]).toEqual('get')
    expect(querier.mock.calls[0][1]).toContain('atlas3')
    expect(querier.mock.calls[0][2]).toEqual([1])
    expect(querier.mock.calls[1][0]).toEqual('get')
    expect(querier.mock.calls[1][1]).toContain('atlas3')
    expect(querier.mock.calls[1][2]).toEqual([2])
})

test('getAllGridsAtlas3 calls querier correctly', () => {
    const birdGridDao = new BirdGridDao(querier)
    birdGridDao.getAllGridsAtlas3()
    expect(querier).toHaveBeenCalledTimes(1)
    expect(querier.mock.calls[0][0]).toEqual('all')
    expect(querier.mock.calls[0][1]).toContain('atlas3')
})
