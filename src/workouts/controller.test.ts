import { makeCreate, makeFindAll, makeFindById, makeDeleteById } from './controller'
import { makeFakeWorkoutArgs } from '../../tests/workout'
import { fakeExercise } from '../../tests/exercise'
import { Workout } from './model'

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
      const exercises = workoutArgs.exercises.map(id => (fakeExercise({ id })))
      return {
        id: workoutArgs.id,
        name: workoutArgs.name,
        getExercises: (): Exercise[] => exercises,
        userId: workoutArgs.userId,
        addExercise: (): void => {}
      }
    })
  })
  describe('getAll action', () => {
    test('should return all workouts', async (done) => {
      const workoutMocks = [
        {
          name: 'fake name 1',
          _id: 'fake id 1',
          exercises: []
        },
        {
          name: 'fake name 2',
          _id: 'fake id 2',
          exercises: [
            'fake exercise 1',
            'fake exercise 2'
          ]
        }
      ]
      mockDb.findAll = jest.fn(() => Promise.resolve(workoutMocks))
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
          userId: undefined
        },
        {
          id: 'fake id 2',
          name: 'fake name 2',
          exercises: ['fake exercise 1', 'fake exercise 2'],
          userId: undefined
        }
      ])
      done()
    })
  })
  describe('create action', () => {
    const workoutArgs = makeFakeWorkoutArgs()
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
        userId: workoutArgs.userId
      })
      expect(result).toEqual({
        id: workoutArgs.id,
        userId: workoutArgs.userId,
        name: workoutArgs.name,
        exercises: workoutArgs.exercises
      })
      done()
    })
    test('should return existing element if possible', async (done) => {
      mockDb.findById = jest.fn(() => Promise.resolve({
        _id: 'fake id',
        name: 'fake name',
        exercises: [],
        userId: 'fake'
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
        userId: 'fake'
      })
      done()
    })
  }),
  describe('getById', () => {
    test('should return found object and parse it', async (done) => {
      mockDb.findById = jest.fn(() => Promise.resolve({
        _id: 'fake id',
        name: 'fake name',
        exercises: ['1', '2'],
        userId: 'fake user id'
      }))
      const getExerciseById = makeFindById(
        mockDb,
        mockWorkoutFactory
      )
      const result = await getExerciseById('fake id')
      expect(result).toEqual({
        id: 'fake id',
        name: 'fake name',
        exercises: ['1', '2'],
        userId: 'fake user id'
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
      const deleteById = makeDeleteById(mockDb, mockWorkoutFactory)
      expect(await deleteById('fake by id')).toEqual('Object removed.')
      expect(mockDb.deleteById).toHaveBeenCalledWith('fake by id')
      expect(mockDb.deleteById).toHaveBeenCalledTimes(1)
      done()
    })
  })
})
