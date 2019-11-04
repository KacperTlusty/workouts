import { makeCreate, makeFindAll } from './controller'
import { makeFakeWorkoutArgs } from '../../tests/workout'
import { fakeExercise } from '../../tests/exercise'

const mockWorkoutFactory = jest.fn((workoutArgs: MakeWorkoutArgs): Workout => {
  const exercises = workoutArgs.exercises.map(id => (fakeExercise({ id })))
  return {
    id: workoutArgs.id,
    name: workoutArgs.name,
    getExercises: (): Exercise[] => exercises,
    userId: workoutArgs.userId,
    addExercise: (): void => {}
  }
})
describe('Workout controller test suite', () => {
  let mockDb: WorkoutDb
  describe('getAll action', () => {
    beforeEach(() => {
      mockDb = {
        create: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn()
      }
    })
    test('should return all workouts', async (done) => {
      const workoutMocks = [
        {
          name: 'fake name 1',
          id: 'fake id 1',
          exercises: []
        },
        {
          name: 'fake name 2',
          id: 'fake id 2',
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
    beforeEach(() => {
      mockDb = {
        create: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn()
      }
    })
    test('should call db create', async (done) => {
      mockDb.create = jest.fn<any, any>(() => 'fake result')
      const createWorkout = makeCreate(
        mockDb,
        mockWorkoutFactory
      )
      const result = await createWorkout(workoutArgs)
      expect(mockDb.create).toHaveBeenCalledTimes(1)
      expect(mockDb.findById).toHaveBeenCalledTimes(1)
      expect(mockDb.create).toHaveBeenCalledWith({
        id: workoutArgs.id,
        name: workoutArgs.name,
        exercises: workoutArgs.exercises,
        userId: workoutArgs.userId
      })
      expect(result).toBe('fake result')
      done()
    })
    test('should return existing element if possible', async (done) => {
      mockDb.findById = jest.fn(() => Promise.resolve({
        id: 'fake id',
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
  })
})
