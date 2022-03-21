const GridDao = require('../main/dao/gridDao')

jest.mock('../main/dao/querier')
const querier = require('../main/dao/querier')

beforeEach(() => {
  querier.mockClear()
})

test('getById calls querier correctly', () => {
  const gridDao = new GridDao(querier)
  gridDao.getById('http:tun.fi/YKJ.678:332')

  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('get')
  expect(querier.mock.calls[0][2]).toEqual(['http:tun.fi/YKJ.678:332'])
})

test('getAll calls querier correctly', () => {
  const gridDao = new GridDao(querier)
  gridDao.getAll()
  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('SELECT')
})
