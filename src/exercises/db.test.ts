import { makeDbConnector } from './db'
import { fakeExercise } from '../../tests/exercise'
import { ExerciseDbEntity } from './types'

describe('Exercise db connector', () => {
  let mockDb: any
  let exerciseFromDb: ExerciseDbEntity
  beforeEach(() => {
    exerciseFromDb = { ...fakeExercise(), _id: 'fake id', hash: 'fake hash' }
  })
  describe('create', () => {
    test('should return inserted exercise', async (done) => {
      mockDb = {
        collection: (): any => ({
          insertOne: (): any => ({
            insertedCount: 1
          })
        })
      }
      const dbConnector = makeDbConnector(mockDb)
      const result = await dbConnector.create(exerciseFromDb)
      expect(result).toEqual(exerciseFromDb)
      done()
    })
    test('should return null if no object was inserted', async (done) => {
      mockDb = {
        collection: (): any => ({
          insertOne: (): any => ({
            insertedCount: 0
          })
        })
      }
      const dbConnector = makeDbConnector(mockDb)
      const result = await dbConnector.create(exerciseFromDb)
      expect(result).toBeNull()
      done()
    })
  })
  describe('findAll', () => {
    test('should return list of exercises', async (done) => {
      mockDb = {
        collection: (): any => ({
          find: (): any => ({
            toArray: (): any[] => [
              'fake 1',
              'fake 2'
            ]
          })
        })
      }
      const dbConnector = makeDbConnector(mockDb)
      const result = await dbConnector.findAll()
      expect(result).toEqual(['fake 1', 'fake 2'])
      done()
    })
  })
  describe('findByHash', () => {
    test('should query collection by hash and return found obj', async (done) => {
      mockDb = {
        collection: (): any => ({
          findOne: (query: any): ExerciseDbEntity => {
            expect(query).toEqual({ hash: 'fake hash' })
            return exerciseFromDb
          }
        })
      }
      const dbConnector = makeDbConnector(mockDb)
      const result = await dbConnector.findByHash('fake hash')
      expect(result).toBe(exerciseFromDb)
      done()
    })
  })
  describe('findById', () => {
    test('should query collection by id and return found obj', async (done) => {
      mockDb = {
        collection: (): any => ({
          findOne: (query: any): ExerciseDbEntity => {
            expect(query).toEqual({ id: 'fake id' })
            return exerciseFromDb
          }
        })
      }
      const dbConnector = makeDbConnector(mockDb)
      const result = await dbConnector.findById('fake id')
      expect(result).toBe(exerciseFromDb)
      done()
    })
  })
  describe('deleteById', () => {
    test('should delete object and return true if deleted', async (done) => {
      mockDb = {
        collection: (): any => ({
          deleteOne: (query: any): any => {
            expect(query).toEqual({ id: 'fake id delete' })
            return { deletedCount: 1 }
          }
        })
      }
      const dbConnector = makeDbConnector(mockDb)
      const result = await dbConnector.deleteById('fake id delete')
      expect(result).toBe(true)
      done()
    })
    test('should return false if no row was deleted', async (done) => {
      mockDb = {
        collection: (): any => ({
          deleteOne: (query: any): any => {
            expect(query).toEqual({ id: 'fake id delete' })
            return { deletedCount: 0 }
          }
        })
      }
      const dbConnector = makeDbConnector(mockDb)
      const result = await dbConnector.deleteById('fake id delete')
      expect(result).toBe(false)
      done()
    })
  })
})
