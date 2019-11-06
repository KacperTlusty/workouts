import { dbClient } from './db'
import { WorkoutDb } from './types'

describe('Db connector', () => {
  let client: WorkoutDb
  beforeEach(() => {
    const mockClient: any = {
      connect: jest.fn((cb) => {
        cb(null)
      }),
      isConnected: () => true,
      db: () => ({
        collection: (): any => ({
          insertOne: async (val): Promise<any> => Promise.resolve({
            insertedCount: val ? 1 : 0
          }),
          findOne: async (args): Promise<any> => Promise.resolve(args),
          find: async (): Promise<any> => Promise.resolve({
            toArray: () => ['fake 1', 'fake 2']
          }),
          deleteOne: async (args): Promise<any> => Promise.resolve({
            result: {
              ok: args.id === 'fake id' ? 1 : 0
            },
            deletedCount: args.id === 'fake id' ? 1 : 0
          })
        })
      })
    }
    client = dbClient(mockClient)
  })
  describe('create method', () => {
    test('should return inserted object', async (done) => {
      const fakeWorkout: any = {
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
