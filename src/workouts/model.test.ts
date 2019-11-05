import cuid, { isCuid } from 'cuid'
import createMakeWorkout from './model'
import { MakeWorkoutArgs } from './types'
import { makeFakeWorkoutArgs } from '../../tests/workout'
import { fakeExercise } from '../../tests/exercise'

describe('Workout model', () => {
  let workoutFactory: any
  beforeEach(() => {
    workoutFactory = createMakeWorkout({
      makeId: () => cuid(),
      validateId: (id) => isCuid(id)
    })
  })
  describe('data validation', () => {
    test('should require name', () => {
      expect(() => workoutFactory(makeFakeWorkoutArgs({ name: null })))
        .toThrowError('name cannot be empty')
    })
    test('should create id if not present', () => {
      const workoutArgs = makeFakeWorkoutArgs({ id: null })
      const workout = workoutFactory(workoutArgs)
      expect(isCuid(workout.id)).toBe(true)
    })
    test('should yield error if current id is not valid cuid', () => {
      const workoutArgs = makeFakeWorkoutArgs({ id: 'not cuid' })
      expect(() => workoutFactory(workoutArgs))
        .toThrowError('Given id is invalid.')
    })
  })
  describe('exercise', () => {
    let fakeWorkoutArgs: MakeWorkoutArgs
    beforeEach(() => {
      fakeWorkoutArgs = makeFakeWorkoutArgs({ exercises: [] })
    })
    test('should allow to add exercise', () => {
      const exercise = fakeExercise()
      const fakeWorkout = workoutFactory(fakeWorkoutArgs)

      fakeWorkout.addExercise(exercise)

      expect(fakeWorkout.getExercises().length).toBe(1)
      expect(fakeWorkout.getExercises()[0]).toEqual(exercise)
    })
    test('should validate new exercise', () => {
      const fakeWorkout = workoutFactory(fakeWorkoutArgs)

      expect(() => fakeWorkout.addExercise(null)).toThrowError('Cannot add null')
    })
  })
})
