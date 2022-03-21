const ApiDao = require('../main/dao/apiDao')

const cachedAxios = jest.fn()

const axios = require('axios')
jest.mock('axios')


beforeEach(() => {
  cachedAxios.mockClear()
  axios.get.mockClear()
})

test('getListOfDistinctBirdsForGridAndActiveAtlas calls axios correctly', () => {
  const apiDao = new ApiDao(axios, cachedAxios) 

  apiDao.getListOfDistinctBirdsForGridAndActiveAtlas('667:337')

  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get.mock.calls[0][0]).toEqual('https://laji.fi/api/warehouse/query/unit/aggregate')
  expect(axios.get.mock.calls[0][1]['params']['ykj10kmCenter']).toEqual('667:337')
})

test('getGridAndBreedingdataForSpeciesAndActiveAtlas calls axios correctly', () => {
  const apiDao = new ApiDao(axios, cachedAxios) 

  apiDao.getGridAndBreedingdataForSpeciesAndActiveAtlas('MX.37580')

  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get.mock.calls[0][0]).toEqual('https://laji.fi/api/warehouse/query/unit/aggregate')
  expect(axios.get.mock.calls[0][1]['params']['taxonId']).toEqual('MX.37580')
})

test('getSpecies calls cachedAxios correctly', () => {
  const apiDao = new ApiDao(axios, cachedAxios) 

  apiDao.getSpecies('MX.37580')

  expect(cachedAxios).toHaveBeenCalledTimes(1)
  expect(cachedAxios.mock.calls[0][0]).toEqual('https://laji.fi/api/taxa/MX.37580')
})

test('getEnumRange calls cachedAxios correctly', () => {
  const apiDao = new ApiDao(axios, cachedAxios) 

  apiDao.getEnumRange('MY.atlasCodeEnum')

  expect(cachedAxios).toHaveBeenCalledTimes(1)
  expect(cachedAxios.mock.calls[0][0]).toEqual('https://laji.fi/api/metadata/ranges/MY.atlasCodeEnum')
})