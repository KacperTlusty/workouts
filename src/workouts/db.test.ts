import { dbClient } from './db'

jest.mock('mongodb', () => {
  return {
    MongoClient: jest.fn(() => ({
      connect: jest.fn((cb) => {
        cb(null)
      }),
      isConnected: () => true,
      db: () => ({
        collection: () => ({
          insertOne: (async (val) => Promise.resolve({
            insertedCount: val ? 1 : 0
          })),
          findOne: (args) => Promise.resolve(args),
          find: () => Promise.resolve({
            toArray: () => ['fake 1', 'fake 2']
          }),
          deleteOne: (args) => Promise.resolve({
            result: {
              ok: args.id === 'fake id' ? 1 : 0,
            },
            deletedCount: args.id === 'fake id' ? 1 : 0
          })
        })
      })
    }))
  }
})

describe('Db connector', () => {
  let client: WorkoutDb
  beforeEach(() => {
    client = dbClient()
  })
  describe('create method', () => {
    test('should return inserted object', async (done) => {
      const fakeWorkout = {
        fake: 'property'
      }
      const result = await client.create(fakeWorkout)
      expect(result).toBe(fakeWorkout)
      done()
    })
    test('should return null when no object was inserted', async (done) => {
      const result = await client.create(null)
      expect(result).toBeNull()
      done()
    })
  })
  describe('findById', () => {
    test('should call find one and return its result', async (done) => {
      const result = await client.findById('fake id')
      expect(result).toEqual({ id: 'fake id' })
      done()
    })
  })
  describe('findAll', () => {
    test('should return found collection', async (done) => {
      const result = await client.findAll()
      expect(result).toEqual(['fake 1', 'fake 2'])
      done()
    })
  })
  describe('deleteById', () => {
    test('should delete and return confirmation', async (done) => {
      const result = await client.deleteById('fake id')
      expect(result).toEqual('Object removed')
      done()
    })
    test('should return info when not found', async (done) => {
      const result = await client.deleteById('not fake id')
      expect(result).toBe('Not found.')
      done()
    })
  })
})
