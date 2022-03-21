const AtlasGridSpeciesDataDao = require('../main/dao/atlasGridSpeciesDataDao')

jest.mock('../main/dao/querier')
const querier = require('../main/dao/querier')

beforeEach(() => {
  querier.mockClear()
})
/**
test('getDataForGrid calls querier correctly', () => {
  const atlasGridSPeciesDataDao = new AtlasGridSpeciesDataDao(querier)
  atlasGridSPeciesDataDao.getDataForGrid(1)
  atlasGridSPeciesDataDao.getDataForGrid(2)

  expect(querier).toHaveBeenCalledTimes(2)
  expect(querier.mock.calls[0][1]).toContain('atlas')
  expect(querier.mock.calls[0][2]).toEqual([1])
  expect(querier.mock.calls[1][1]).toContain('atlas')
  expect(querier.mock.calls[1][2]).toEqual([2])
})

test('getAllAtlasData calls querier correctly', () => {
  const atlasGridSPeciesDataDao = new AtlasGridSPeciesDataDao(querier)
  atlasGridSPeciesDataDao.getAllData()
  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('bird_data')
})

test('getGridAndBreedingdataForSpecies calls querier correctly', () => {
  const atlasGridSPeciesDataDao = new AtlasGridSPeciesDataDao(querier)
  atlasGridSPeciesDataDao.getGridAndBreedingdataForSpecies(1)

  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('bird_data')
})

test('getDataForGrid calls querier correctly', () => {
  const atlasGridSPeciesDataDao = new AtlasGridSPeciesDataDao(querier)
  atlasGridSPeciesDataDao.getDataForGrid(1)

  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('atlas')
})

test('getBreedingCategorySumForSpecies calls querier correctly', () => {
  const atlasGridSPeciesDataDao = new AtlasGridSPeciesDataDao(querier)
  atlasGridSPeciesDataDao.getBreedingCategorySumForSpecies(25836)

  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('bird_data')
})

test('getListOfDistinctBirdsForGridAndAtlas calls querier correctly', () => {
  const atlasGridSPeciesDataDao = new AtlasGridSPeciesDataDao(querier)
  atlasGridSPeciesDataDao.getListOfDistinctBirdsForGridAndAtlas(664329)

  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('bird_data')
})

test('getNumOfBreedingCategoriesForGridAndAtlas calls querier correctly', () => {
  const atlasGridSPeciesDataDao = new AtlasGridSPeciesDataDao(querier)
  atlasGridSPeciesDataDao.getNumOfBreedingCategoriesForGridAndAtlas(664329)

  expect(querier).toHaveBeenCalledTimes(1)
  expect(querier.mock.calls[0][0]).toEqual('all')
  expect(querier.mock.calls[0][1]).toContain('bird_data')
})
*/
