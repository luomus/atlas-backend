const AtlasDao = require('../main/dao/atlasDao')

jest.mock('../main/dao/querier')
const querier = require('../main/dao/querier')

beforeEach(() => {
  querier.execute.mockClear()
  querier.executeMany.mockClear()
})

test('getById calls querier correctly', async () => {
  const atlasDao = new AtlasDao(querier)
  await atlasDao.getById('http:tun.fi/YKJ.678:332')

  expect(querier.execute).toHaveBeenCalledTimes(1)
  expect(querier.execute.mock.calls[0][0]).toContain('SELECT')
  expect(querier.execute.mock.calls[0][1]).toEqual(['http:tun.fi/YKJ.678:332'])
})

test('getAll calls querier correctly', async () => {
  const atlasDao = new AtlasDao(querier)
  await atlasDao.getAll()
  expect(querier.execute).toHaveBeenCalledTimes(1)
  expect(querier.execute.mock.calls[0][0]).toContain('SELECT')
})