import cuid, { isCuid } from 'cuid'
import createMakeWorkout from './model'
import { MakeWorkoutArgs } from './types'
import { makeFakeWorkoutArgs, makeFakeWorkoutExercise } from '../../tests/workout'

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
    test('should yield error when one of the initial exercises are invalid', () => {
      const workoutArgs = makeFakeWorkoutArgs()
      const fakeExercise = makeFakeWorkoutExercise({ exerciseId: 'invalid id' })
      workoutArgs.exercises = [fakeExercise]
      expect(() => workoutFactory(workoutArgs))
        .toThrowError('invalid id is not valid exerciseId')
    })
    test('should yield error when user id is not valid cuid', () => {
      const workoutArgs = makeFakeWorkoutArgs({ userId: 'not valid user Id' })
      expect(() => workoutFactory(workoutArgs)).toThrowError('userId is not valid cuid')
    })
    test('should yield error when date is not positive integer', () => {
      const workoutArgs = makeFakeWorkoutArgs({ day: -1 })
      expect(() => workoutFactory(workoutArgs)).toThrowError('day must be positive integer.')
    })
  })
  describe('exercise', () => {
    let fakeWorkoutArgs: MakeWorkoutArgs
    beforeEach(() => {
      fakeWorkoutArgs = makeFakeWorkoutArgs({ exercises: [] })
    })
    test('should allow to add exercise', () => {
      const exercise = makeFakeWorkoutExercise()
      const fakeWorkout = workoutFactory(fakeWorkoutArgs)

      fakeWorkout.addExercise(exercise)

      expect(fakeWorkout.getExercises().length).toBe(1)
      expect(fakeWorkout.getExercises()[0]).toEqual(exercise)
    })
    test('should validate new exercise', () => {
      const fakeWorkout = workoutFactory(fakeWorkoutArgs)

      expect(() => fakeWorkout.addExercise(null)).toThrowError('Cannot add null')
      expect(() => fakeWorkout.addExercise(makeFakeWorkoutExercise({ exerciseId: 'not cuid' })))
        .toThrowError('not cuid is not valid exerciseId')
      expect(() => fakeWorkout.addExercise(makeFakeWorkoutExercise({ duration: -1 })))
        .toThrowError('exercise duration cannot be negative integer')
      expect(() => fakeWorkout.addExercise(makeFakeWorkoutExercise({ breakDuration: -1 })))
        .toThrowError('exercise breakDuration cannot be negative integer')
    })
    test('should return current obj as Json', () => {
      const fakeWorkout = workoutFactory(fakeWorkoutArgs)
      const json = fakeWorkout.toJson()

      expect(json.id).toBe(fakeWorkout.id)
      expect(json.name).toBe(fakeWorkout.name)
      expect(json.userId).toBe(fakeWorkout.userId)
      expect(json.day).toBe(fakeWorkout.day)
      expect(json.finished).toBe(fakeWorkout.finished)
    })
  })
})
