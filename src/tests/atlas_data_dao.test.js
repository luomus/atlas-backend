const AtlasDataDao = require('../main/dao/atlas_data_dao')

jest.mock('../main/dao/querier')
const querier = require('../main/dao/querier')

beforeEach(() => {
  querier.mockClear()
})

test('getDataForGrid calls querier correctly', () => {
  const atlasDataDao = new AtlasDataDao(querier)
  atlasDataDao.getDataForGrid(1)
  atlasDataDao.getDataForGrid(2)

  expect(querier).toHaveBeenCalledTimes(2)
  expect(querier.mock.calls[0][0]).toEqual('get')
  expect(querier.mock.calls[0][1]).toContain('atlas3')
  expect(querier.mock.calls[0][2]).toEqual([1])
  expect(querier.mock.calls[1][0]).toEqual('get')
  expect(querier.mock.calls[1][1]).toContain('atlas3')
  expect(querier.mock.calls[1][2]).toEqual([2])
})

test('getAllAtlasData calls querier correctly', () => {
  const atlasDataDao = new atlasDataDao(querier)
  atlasDataDao.getAllAtlasData()
  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('atlas3')
})

test('getGridAndBreedingdataForSpecies calls querier correctly', () => {
  const atlasDataDao = new atlasDataDao(querier)
  atlasDataDao.getGridAndBreedingdataForSpecies(1)

  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('atlas3')
})

test('getDataForGrid calls querier correctly', () => {
  const atlasDataDao = new atlasDataDao(querier)
  atlasDataDao.getDataForGrid(1)

  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('atlas3')
})
