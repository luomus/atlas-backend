const Cache = require('../main/dao/cache')
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time))
let cache = new Cache()

beforeEach(() => {
  cache.flushAll()
})

const mockValue1 = { value: 'value1' }
const mockValue2 = { value: 'value2' }

test('setCache results in correct data being returned by getCache', () => {
  cache.setCache('key', mockValue1)
  const data = cache.getCache('key')

  expect(data).toEqual(mockValue1)
})

test('calling a function with cache wrapper with uninitialized value results in value producing function being called and cache being set', async () => {
  const innerFunct = jest.fn(() => mockValue1)
  const outerFunct = async () => await cache.wrapper('key', innerFunct)

  const data = await outerFunct()
  const cachedValue = cache.getCache('key')

  expect(innerFunct).toHaveBeenCalledTimes(1)
  expect(data).toEqual(mockValue1)
  expect(cachedValue).toEqual(mockValue1)
})

test('calling a function with cache wrapper with initialized value results in value producing function not being called and cache being set', async () => {
  cache.setCache('key', mockValue1)

  const innerFunct = jest.fn(() => mockValue2)
  const outerFunct = async () => await cache.wrapper('key', innerFunct)

  const data = await outerFunct()

  expect(innerFunct).toHaveBeenCalledTimes(0)
  expect(data).toEqual(mockValue1)
})

test('calling a function with cache wrapper and expired cache results in inner function being called with timeout value and cache being set', async () => {
  cache.setCache('expired_key', mockValue1)

  const innerFunct = jest.fn(async (timout) => {
    await wait(500)
    return mockValue2
  })
  const outerFunct = async () => await cache.wrapper('key', innerFunct)

  const data = await outerFunct()

  await wait(1000)

  const cachedValue = cache.getCache('key')

  expect(innerFunct).toHaveBeenCalledTimes(1)
  expect(innerFunct.mock.calls[0][0]).toEqual(10000)
  expect(data).toEqual(mockValue2)
  expect(cachedValue).toEqual(mockValue2)
})

test('calling a function with cache wrapper and expired cache results in inner function being called, if it times out old value is returned, and cache is eventually set to new value in async function call', async () => {
  cache.setCache('expired_key', mockValue1)
  const innerFunct = jest.fn(async (timeout = 0) => {
    if (timeout === 0) {
      return mockValue2
    }

    throw {code: 'ECONNABORTED'}
  })
  const outerFunct = async () => await cache.wrapper('key', innerFunct)

  const data = await outerFunct()

  await wait(500)

  const cachedValue = cache.getCache('key')

  expect(innerFunct).toHaveBeenCalledTimes(2)
  expect(innerFunct.mock.calls[0][0]).toEqual(10000)
  expect(innerFunct.mock.calls[1][0]).toEqual(undefined)
  expect(data).toEqual(mockValue1)
  expect(cachedValue).toEqual(mockValue2)
})

test('calling a function with cache wrapper and expired cache twice in quick succession results in inner function not being called and old value being returned, and cache is eventually set to new value in async function call, but the async funct is called only once', async () => {
  cache.setCache('expired_key', mockValue1)
  const innerFunct = jest.fn(async (timeout = 0) => {
    if (timeout === 0) {
      await wait(500)
      return mockValue2
    }

    throw {code: 'ECONNABORTED'}
  })
  const outerFunct = async () => await cache.wrapper('key', innerFunct)

  const data1 = await outerFunct()
  const data2 = await outerFunct()
  await wait(1000)

  const cachedValue = cache.getCache('key')

  expect(innerFunct).toHaveBeenCalledTimes(2)
  expect(innerFunct.mock.calls[0][0]).toEqual(10000)
  expect(innerFunct.mock.calls[1][0]).toEqual(undefined)
  expect(data1).toEqual(mockValue1)
  expect(data1).toEqual(data2)
  expect(cachedValue).toEqual(mockValue2)
})

test('Calling a wrapped function twice with enough time inbetween with expired value and error on initial awaited inner function call results in the inner function being called only twice, and new value being returned on second call', async () => {
  cache.setCache('expired_key', mockValue1)
  const innerFunct = jest.fn(async (timeout = 0) => {
    if (timeout === 0) {
      await wait(500)
      return mockValue2
    }

    throw {code: 'ECONNABORTED'}
  })

  const outerFunct = async () => await cache.wrapper('key', innerFunct)

  const data1 = await outerFunct()

  await wait(1000)

  const data2 = await outerFunct()

  const cachedValue = cache.getCache('key')

  expect(innerFunct).toHaveBeenCalledTimes(2)
  expect(data1).toEqual(mockValue1)
  expect(data2).toEqual(mockValue2)
  expect(cachedValue).toEqual(mockValue2)
})

test('Calling a wrapped function with expired value and timeout error on initial awaited inner function call and error on seccond call results in old vaue returned and no new cache set', async () => {
  cache.setCache('expired_key', mockValue1)
  const innerFunct = jest.fn(async (timeout = 0) => {
    if (timeout === 0) {
      throw new Error('Error!')
    }

    throw {code: 'ECONNABORTED'}
  })

  const outerFunct = async () => await cache.wrapper('key', innerFunct)

  const data = await outerFunct()
  await wait(500)

  const cachedValue = cache.getCache('key')

  expect(innerFunct).toHaveBeenCalledTimes(2)
  expect(data).toEqual(mockValue1)
  expect(cachedValue).toEqual(undefined)
})

test('Calling a wrapped function with no cache values and error during the inner function call results in error being thrown and no value in cache', async () => {
  const innerFunct = jest.fn(async (timeout = 0) => {
    if (timeout === 0) {
      throw 'Error!'
    }

    throw {code: 'ECONNABORTED'}
  })

  const outerFunct = async () => await cache.wrapper('key', innerFunct)

  await expect(outerFunct()).rejects.toEqual('Error!')

  const cachedValue = cache.getCache('key')
  expect(cachedValue).toEqual(undefined)
})