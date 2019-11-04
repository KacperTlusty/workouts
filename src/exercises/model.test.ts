import cuid, { isCuid } from 'cuid'
import { fakeExercise } from '../../tests/exercise'
import makeModel, { ExerciseArgs } from './model'

describe('Exercise model', () => {
  describe('validate properties', () => {
    let model: (ExerciseArgs) => Exercise
    beforeEach(() => {
      model = makeModel({
        createId: cuid,
        validateId: isCuid
      })
    })
    test('should throw error when name is missing', () => {
      expect(() => model(fakeExercise({ name: null }))).toThrowError('name is missing')
    })
    test('should throw error when type is missing', () => {
      expect(() => model(fakeExercise({ type: null }))).toThrowError('type is missing')
    })
    test('duration cannot be negative', () => {
      expect(() => model(fakeExercise({ duration: -1 })))
        .toThrowError('duration cannot be negative number')
    })
    test('breakDuration cannot be negative', () => {
      
    })
  })
})