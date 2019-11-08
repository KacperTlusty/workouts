import { makeCreateExercise, makeFindAllExercises, makeFindById, makeDeleteById } from './controller'
import { fakeExercise } from '../../tests/exercise'
import {
  ExerciseJson,
  ExerciseDb,
  ExerciseDbEntity,
  Exercise
} from './types'
import cuid = require('cuid')

describe('Exercise controller', () => {
  let mockDb: ExerciseDb
  let makeExerciseMock: (ExerciseArgs) => Exercise
  beforeEach(() => {
    mockDb = {
      create: jest.fn(),
      findByHash: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      deleteById: jest.fn()
    }
    makeExerciseMock = jest.fn((arg) => ({
      id: arg.id || cuid(),
      name: arg.name,
      type: arg.type,
      difficulty: arg.difficulty,
      picture: arg.picture,
      mobility: arg.mobility,
      hash: 'fake hash',
      toJson: function (): ExerciseJson {
        return {
          id: this.id,
          name: this.name,
          difficulty: this.difficulty,
          type: this.type,
          picture: this.picture,
          mobility: this.mobility
        }
      }
    }))
  })
  describe('create', () => {
    test('should call db and return created object', async (done) => {
      mockDb.create = jest.fn((arg) => arg)
      mockDb.findByHash = jest.fn(() => null)
      const createExercise = makeCreateExercise({
        db: mockDb,
        makeExercise: makeExerciseMock
      })
      const exerciseMock = fakeExercise()
      const exerciseJson = await createExercise(exerciseMock)
      expect(exerciseJson.id).toBeTruthy()
      expect(exerciseJson.name).toBe(exerciseMock.name)
      expect(exerciseJson.type).toBe(exerciseMock.type)
      expect(exerciseJson.picture).toBe(exerciseMock.picture)
      expect(exerciseJson.difficulty).toBe(exerciseMock.difficulty)
      expect(mockDb.create).toHaveBeenCalledTimes(1)
      expect(mockDb.create).toHaveBeenCalledWith({
        _id: exerciseMock.id,
        name: exerciseMock.name,
        hash: 'fake hash',
        type: exerciseMock.type,
        picture: exerciseMock.picture,
        difficulty: exerciseMock.difficulty,
        mobility: exerciseMock.mobility
      })
      done()
    })
    test('should return existing object if found', async (done) => {
      const mockExercise = fakeExercise()
      const dbExercise: ExerciseDbEntity = {
        _id: mockExercise.id,
        hash: 'some hash',
        ...mockExercise
      }
      mockDb.findByHash = jest.fn(async () => dbExercise)
      const createExercise = makeCreateExercise({
        db: mockDb,
        makeExercise: makeExerciseMock
      })
      const result = await createExercise(mockExercise)
      expect(mockDb.findByHash).toHaveBeenCalledTimes(1)
      expect(mockDb.create).toHaveBeenCalledTimes(0)
      expect(mockDb.findByHash).toHaveBeenCalledWith('fake hash')
      expect(result).toEqual(mockExercise)
      done()
    })
  })
  describe('findAll', () => {
    test('should call db and return all exercises', async (done) => {
      const fakeFirstExercise = fakeExercise()
      const fakeSecondExercise = fakeExercise()
      mockDb.findAll = jest.fn(async () => [
        { ...fakeFirstExercise, _id: 'fake id 1', hash: 'fake hash' },
        { ...fakeSecondExercise, _id: 'fake id 2', hash: 'fake hash' }
      ])
      const getExercises = makeFindAllExercises({
        db: mockDb,
        makeExercise: makeExerciseMock
      })
      const results = await getExercises()
      expect(results).toEqual([
        {
          ...fakeFirstExercise,
          id: 'fake id 1'
        },
        {
          ...fakeSecondExercise,
          id: 'fake id 2'
        }
      ])
      done()
    })
  })
  describe('findById', () => {
    test('should return null if not found', async (done) => {
      mockDb.findById = jest.fn(() => null)
      const findById = makeFindById({
        db: mockDb,
        makeExercise: makeExerciseMock
      })
      const foundExercise = await findById('fake id')
      expect(mockDb.findById).toHaveBeenCalledWith('fake id')
      expect(mockDb.findById).toHaveBeenCalledTimes(1)
      expect(foundExercise).toBeNull()
      done()
    })
    test('should return found object as json', async (done) => {
      const fakeObject = fakeExercise()
      mockDb.findById = jest.fn(async () => ({
        _id: fakeObject.id,
        hash: 'fake hash',
        ...fakeObject
      }))
      const findById = makeFindById({
        db: mockDb,
        makeExercise: makeExerciseMock
      })
      const foundExercise = await findById('fake id')
      expect(foundExercise).toEqual(fakeObject)
      done()
    })
  })
  describe('deleteById', () => {
    let fakeObject: ExerciseJson
    beforeEach(() => {
      fakeObject = fakeExercise()
    })
    test('should return deleted object', async (done) => {
      mockDb.findById = jest.fn(async () => ({
        _id: fakeObject.id,
        hash: 'fake hash',
        ...fakeObject
      }))
      mockDb.deleteById = jest.fn(async () => true)
      const deleteById = makeDeleteById({
        db: mockDb,
        makeExercise: makeExerciseMock
      })

      const result = await deleteById('fake id')

      expect(mockDb.deleteById).toHaveBeenCalledTimes(1)
      expect(mockDb.deleteById).toHaveBeenCalledWith(fakeObject.id)
      expect(result).toEqual(fakeObject)
      done()
    })
    test('should return null if object was not deleted', async (done) => {
      mockDb.findById = jest.fn(async () => ({
        _id: fakeObject.id,
        hash: 'fake hash',
        ...fakeObject
      }))
      mockDb.deleteById = jest.fn(async () => false)
      const deleteById = makeDeleteById({
        db: mockDb,
        makeExercise: makeExerciseMock
      })

      const result = await deleteById('fake id')

      expect(mockDb.deleteById).toHaveBeenCalledTimes(1)
      expect(mockDb.deleteById).toHaveBeenCalledWith(fakeObject.id)
      expect(result).toBeNull()
      done()
    })
    test('should return null if object was not found', async (done) => {
      mockDb.findById = jest.fn(async () => null)
      const deleteById = makeDeleteById({
        db: mockDb,
        makeExercise: makeExerciseMock
      })

      const result = await deleteById('fake id')

      expect(mockDb.findById).toHaveBeenCalledWith('fake id')
      expect(result).toBeNull()
      done()
    })
  })
})
