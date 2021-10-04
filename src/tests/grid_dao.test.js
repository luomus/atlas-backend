const GridDao = require('../main/dao/grid_dao')

jest.mock('../main/dao/querier_factory')
const querier = require('../main/dao/querier_factory')

beforeEach(() => {
    querier.mockClear()
})

test('getById calls querier correctly', () => {
    const gridDao = new GridDao(querier)
    gridDao.getGridById(661312)

    expect(querier).toHaveBeenCalledTimes(1)
    expect(querier.mock.calls[0][0]).toEqual('get')
    expect(querier.mock.calls[0][2]).toEqual([661312])
})

test('getAll calls querier correctly', () => {
    const gridDao = new GridDao(querier)
    gridDao.getAllGrids()
    expect(querier).toHaveBeenCalledTimes(1)
    expect(querier.mock.calls[0][0]).toEqual('all')
    expect(querier.mock.calls[0][1]).toContain('SELECT * FROM')
})
