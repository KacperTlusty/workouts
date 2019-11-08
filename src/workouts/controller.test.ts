import { makeCreate, makeFindAll, makeFindById, makeDeleteById } from './controller'
import { makeFakeWorkoutArgs } from '../../tests/workout'
import { WorkoutDb, MakeWorkoutArgs, Workout, WorkoutExercise, WorkoutJson } from './types'

describe('Workout controller test suite', () => {
  let mockDb: WorkoutDb
  let mockWorkoutFactory: (MakeWorkoutArgs) => Workout
  beforeEach(() => {
    mockDb = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      deleteById: jest.fn()
    }
    mockWorkoutFactory = jest.fn((workoutArgs: MakeWorkoutArgs): Workout => {
      return {
        id: workoutArgs.id,
        name: workoutArgs.name,
        getExercises: (): WorkoutExercise[] => workoutArgs.exercises,
        userId: workoutArgs.userId,
        addExercise: (): void => {},
        day: workoutArgs.day,
        finished: workoutArgs.finished,
        toJson: (): WorkoutJson => ({
          id: workoutArgs.id,
          exercises: workoutArgs.exercises,
          name: workoutArgs.name,
          userId: workoutArgs.userId,
          day: workoutArgs.day,
          finished: workoutArgs.finished
        })
      }
    })
  })
  describe('getAll action', () => {
    test('should return all workouts', async (done) => {
      const workoutMocks = [
        {
          name: 'fake name 1',
          _id: 'fake id 1',
          exercises: [],
          day: 5,
          userId: 'fake user id 1'
        },
        {
          name: 'fake name 2',
          _id: 'fake id 2',
          exercises: [
            'fake exercise 1',
            'fake exercise 2'
          ],
          day: 15,
          userId: 'fake user id 2'
        }
      ]
      mockDb.findAll = jest.fn((): any => Promise.resolve(workoutMocks))
      const getAll = makeFindAll(
        mockDb,
        mockWorkoutFactory
      )
      const result = await getAll()
      expect(mockDb.findAll).toHaveBeenCalledTimes(1)
      expect(result).toEqual([
        {
          id: 'fake id 1',
          name: 'fake name 1',
          exercises: [],
          userId: 'fake user id 1',
          day: 5
        },
        {
          id: 'fake id 2',
          name: 'fake name 2',
          exercises: ['fake exercise 1', 'fake exercise 2'],
          userId: 'fake user id 2',
          day: 15
        }
      ])
      done()
    })
  })
  describe('create action', () => {
    let workoutArgs: MakeWorkoutArgs
    beforeEach(() => {
      workoutArgs = makeFakeWorkoutArgs()
    })
    test('should call db create', async (done) => {
      mockDb.create = jest.fn<any, any>((arg) => arg)
      const createWorkout = makeCreate(
        mockDb,
        mockWorkoutFactory
      )
      const result = await createWorkout(workoutArgs)
      expect(mockDb.create).toHaveBeenCalledTimes(1)
      expect(mockDb.findById).toHaveBeenCalledTimes(1)
      expect(mockDb.create).toHaveBeenCalledWith({
        _id: workoutArgs.id,
        name: workoutArgs.name,
        exercises: workoutArgs.exercises,
        userId: workoutArgs.userId,
        day: workoutArgs.day,
        finished: workoutArgs.finished
      })
      expect(result).toEqual({
        id: workoutArgs.id,
        userId: workoutArgs.userId,
        name: workoutArgs.name,
        exercises: workoutArgs.exercises,
        day: workoutArgs.day,
        finished: workoutArgs.finished
      })
      done()
    })
    test('should return existing element if possible', async (done) => {
      mockDb.findById = jest.fn(() => Promise.resolve({
        _id: 'fake id',
        name: 'fake name',
        exercises: [],
        userId: 'fake',
        day: 0,
        finished: true
      }))
      const createExercise = makeCreate(
        mockDb,
        mockWorkoutFactory
      )
      const result = await createExercise(workoutArgs)
      expect(mockDb.create).toHaveBeenCalledTimes(0)
      expect(mockDb.findById).toHaveBeenCalledTimes(1)
      expect(mockDb.findById).toHaveBeenCalledWith(workoutArgs.id)
      expect(result).toEqual({
        id: 'fake id',
        name: 'fake name',
        exercises: [],
        userId: 'fake',
        day: 0,
        finished: true
      })
      done()
    })
  })
  describe('getById', () => {
    test('should return found object and parse it', async (done) => {
      mockDb.findById = jest.fn(() => Promise.resolve({
        _id: 'fake id',
        name: 'fake name',
        exercises: [],
        userId: 'fake user id',
        day: 0,
        finished: true
      }))
      const getExerciseById = makeFindById(
        mockDb,
        mockWorkoutFactory
      )
      const result = await getExerciseById('fake id')
      expect(result).toEqual({
        id: 'fake id',
        name: 'fake name',
        exercises: [],
        userId: 'fake user id',
        day: 0,
        finished: true
      })
      expect(mockWorkoutFactory).toHaveBeenCalledTimes(1)
      done()
    })
    test('should return found object', async (done) => {
      mockDb.findById = jest.fn(() => Promise.resolve(null))
      const getExerciseById = makeFindById(
        mockDb,
        mockWorkoutFactory
      )
      const result = await getExerciseById('fake id')
      expect(result).toEqual(null)
      done()
    })
  })
  describe('deleteById', () => {
    test('should use mapper', async (done) => {
      mockDb.deleteById = jest.fn(async () => Promise.resolve('Object removed.'))
      mockDb.findById = jest.fn(async (): Promise<any> => ({
        finished: false
      }))
      const deleteById = makeDeleteById(mockDb, mockWorkoutFactory)

      expect(await deleteById('fake by id')).toEqual('Object removed.')
      expect(mockDb.deleteById).toHaveBeenCalledWith('fake by id')
      expect(mockDb.deleteById).toHaveBeenCalledTimes(1)
      done()
    })
    test('should not allow to delete finished workout', async (done) => {
      mockDb.deleteById = jest.fn()
      mockDb.findById = jest.fn((): any => ({
        finished: true
      }))
      const deleteById = makeDeleteById(mockDb, mockWorkoutFactory)

      let err: Error
      try {
        await deleteById('fake id')
      } catch (error) {
        err = error
      }

      expect(mockDb.deleteById).toHaveBeenCalledTimes(0)
      expect(err).toEqual(new Error('Cannot delete finished workout'))
      done()
    })
    test('should not call db to remove when object is not found', async (done) => {
      mockDb.deleteById = jest.fn()
      mockDb.findById = jest.fn(() => null)
      const deleteById = makeDeleteById(mockDb, mockWorkoutFactory)

      const result = await deleteById('fake id')

      expect(result).toBeNull()
      expect(mockDb.deleteById).toHaveBeenCalledTimes(0)
      done()
    })
  })
})
