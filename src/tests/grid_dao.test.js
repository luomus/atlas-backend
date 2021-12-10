const GridDao = require('../main/dao/grid_dao')

jest.mock('../main/dao/querier')
const querier = require('../main/dao/querier')

beforeEach(() => {
  querier.mockClear()
})

test('getById calls querier correctly', () => {
  const gridDao = new GridDao(querier)
  gridDao.getById(661312)

  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('get')
  expect(querier.mock.calls[0][2]).toEqual([661312])
})

test('getAll calls querier correctly', () => {
  const gridDao = new GridDao(querier)
  gridDao.getAll()
  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('SELECT')
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
