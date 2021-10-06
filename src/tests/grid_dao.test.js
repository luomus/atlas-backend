const GridDao = require('../main/dao/grid_dao')

jest.mock('../main/dao/querier_factory')
const querier = require('../main/dao/querier_factory')

beforeEach(() => {
    querier.mockClear()
})

test('getGridById calls querier correctly', () => {
    const gridDao = new GridDao(querier)
    gridDao.getGridById(661312)

    expect(querier).toHaveBeenCalledTimes(1)
    expect(querier.mock.calls[0][0]).toEqual('get')
    expect(querier.mock.calls[0][2]).toEqual([661312])
})

test('getAllGrids calls querier correctly', () => {
    const gridDao = new GridDao(querier)
    gridDao.getAllGrids()
    expect(querier).toHaveBeenCalledTimes(1)
    expect(querier.mock.calls[0][0]).toEqual('all')
    expect(querier.mock.calls[0][1]).toContain('SELECT * FROM')
})

test('getMunicipalityById calls querier correctly', () => {
    const gridDao = new GridDao(querier)
    gridDao.getMunicipalityById(39)

    expect(querier).toHaveBeenCalledTimes(1)
    expect(querier.mock.calls[0][0]).toEqual('get')
    expect(querier.mock.calls[0][2]).toEqual([39])
})

test('getAllMunicipalities calls querier correctly', () => {
    const gridDao = new GridDao(querier)
    gridDao.getAllMunicipalities()
    expect(querier).toHaveBeenCalledTimes(1)
    expect(querier.mock.calls[0][0]).toEqual('all')
    expect(querier.mock.calls[0][1]).toContain('SELECT * FROM')
})