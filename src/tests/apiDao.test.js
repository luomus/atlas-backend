const ApiDao = require('../main/dao/apiDao')

const mockValue = { value: 'value' }
const setCache = jest.fn()
const getCache = jest.fn()
const cache = {
  setCache,
  getCache
}
const axios = require('axios')
jest.mock('axios')

beforeEach(() => {
  setCache.mockClear()
  getCache.mockClear()
  axios.get.mockClear()
})

test('getListOfDistinctBirdsForGridAndActiveAtlas calls axios correctly', async () => {
  axios.get.mockImplementationOnce(() => ({ data: { results: mockValue }}))
  const apiDao = new ApiDao(axios, cache) 

  await apiDao.getListOfDistinctBirdsForGridAndActiveAtlas('667:337')

  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get.mock.calls[0][0]).toEqual('https://laji.fi/api/warehouse/query/unit/aggregate')
  expect(axios.get.mock.calls[0][1]['params']['ykj10kmCenter']).toEqual('667:337')
})

test('getGridAndBreedingdataForSpeciesAndActiveAtlas calls axios correctly', async () => {
  axios.get.mockImplementationOnce(() => ({ data: { results: mockValue }}))
  const apiDao = new ApiDao(axios, cache) 

  await apiDao.getGridAndBreedingdataForSpeciesAndActiveAtlas('MX.37580')

  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get.mock.calls[0][0]).toEqual('https://laji.fi/api/warehouse/query/unit/aggregate')
  expect(axios.get.mock.calls[0][1]['params']['taxonId']).toEqual('MX.37580')
})

test('getSpecies calls cache and axios correctly on cache hit', async () => {
  getCache.mockImplementationOnce(() => mockValue)

  const apiDao = new ApiDao(axios, cache) 

  await apiDao.getSpecies('MX.37580')

  expect(getCache).toHaveBeenCalledTimes(1)
  expect(getCache.mock.calls[0][0]).toEqual('MX.37580')
  expect(axios.get).toHaveBeenCalledTimes(0)
})

test('getSpecies calls cache and axios correctly on cache miss', async () => {
  axios.get.mockImplementationOnce(() => ({ data: mockValue }))

  const apiDao = new ApiDao(axios, cache) 

  await apiDao.getSpecies('MX.37580')

  expect(getCache).toHaveBeenCalledTimes(1)
  expect(getCache.mock.calls[0][0]).toEqual('MX.37580')
  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get.mock.calls[0][0]).toEqual('https://laji.fi/api/taxa/MX.37580')
  expect(setCache).toHaveBeenCalledTimes(1)
  expect(setCache.mock.calls[0][0]).toEqual('MX.37580')
  expect(setCache.mock.calls[0][1]).toEqual(mockValue)



})

test('getEnumRange calls cache and axios correctly on cache hit', async () => {
  cache.getCache.mockImplementationOnce(() => mockValue)

  const apiDao = new ApiDao(axios, cache) 

  await apiDao.getEnumRange('MY.atlasCodeEnum')

  expect(getCache).toHaveBeenCalledTimes(1)
  expect(getCache.mock.calls[0][0]).toEqual('MY.atlasCodeEnum')
  expect(axios.get).toHaveBeenCalledTimes(0)
})


test('getEnumRange calls cache and axios correctly on cache miss', async () => {
  axios.get.mockImplementationOnce(() => ({ data: mockValue }))

  const apiDao = new ApiDao(axios, cache) 

  await apiDao.getEnumRange('MY.atlasCodeEnum')

  expect(getCache).toHaveBeenCalledTimes(1)
  expect(getCache.mock.calls[0][0]).toEqual('MY.atlasCodeEnum')
  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(setCache).toHaveBeenCalledTimes(1)
})

test('getBirdAssociationAreas calls cache and axios correctly on cache hit', async () => {
  cache.getCache.mockImplementationOnce(() => mockValue)

  const apiDao = new ApiDao(axios, cache) 

  await apiDao.getBirdAssociationAreas()

  expect(getCache).toHaveBeenCalledTimes(1)
  expect(getCache.mock.calls[0][0]).toEqual('MNP.birdAssociationArea')
  expect(axios.get).toHaveBeenCalledTimes(0)
})