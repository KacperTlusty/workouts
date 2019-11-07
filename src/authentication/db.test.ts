import { makeAuthDb } from './db'

describe('AuthDb', () => {
  let collection: any
  describe('findById', () => {
    test('call db and return it', async (done) => {
      collection = {
        findOne: jest.fn(() => 'fake found')
      }
      const authDb = makeAuthDb(collection)
      expect(await authDb.findById('fake id')).toEqual('fake found')
      expect(collection.findOne).toHaveBeenCalledTimes(1)
      expect(collection.findOne).toHaveBeenCalledWith({ id: 'fake id' })
      done()
    })
  })
  describe('findByEmail', () => {
    test('should call db and return result', async (done) => {
      collection = {
        findOne: jest.fn(() => 'fake found')
      }
      const authDb = makeAuthDb(collection)
      expect(await authDb.findByEmail('fake@email.com')).toEqual('fake found')
      expect(collection.findOne).toHaveBeenCalledWith({ email: 'fake@email.com' })
      expect(collection.findOne).toHaveBeenCalledTimes(1)
      done()
    })
  })
})
