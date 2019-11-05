import cuid, { isCuid } from 'cuid'
import { isHttpUri, isHttpsUri } from 'valid-url'
import { fakeExercise } from '../../tests/exercise'
import makeModel from './model'
import {
  Exercise
} from './types'
import crypto = require('crypto')

describe('Exercise model', () => {
  let model: (ExerciseArgs) => Exercise
  beforeEach(() => {
    model = makeModel({
      createId: cuid,
      validateId: isCuid,
      createHash: (text): string => crypto.createHash('md5').update(text).digest('hex'),
      isUrl: (url) => isHttpUri(url) !== undefined || isHttpsUri(url) !== undefined
    })
  })
  describe('validate properties', () => {
    test('should throw error when name is missing', () => {
      expect(() => model(fakeExercise({ name: null }))).toThrowError('name is missing')
    })
    test('should throw error when type is missing', () => {
      expect(() => model(fakeExercise({ type: null }))).toThrowError('type is missing')
    })
    test('duration cannot be negative', () => {
      expect(() => model(fakeExercise({ duration: -1 })))
        .toThrowError('duration cannot be negative number')
      expect(() => model(fakeExercise({ duration: 0 })))
        .not.toThrowError()
    })
    test('breakDuration cannot be negative', () => {
      expect(() => model(fakeExercise({ breakDuration: -1 })))
        .toThrowError('breakDuration cannot be negative number')
      expect(() => model(fakeExercise({ breakDuration: 0 })))
        .not.toThrowError()
    })
    test('should throw if invalid id is given', () => {
      expect(() => model(fakeExercise({ id: 'invalid' })))
        .toThrowError('invalid id')
    })
    test('should throw if picture is not valid url', () => {
      expect(() => model(fakeExercise({ picture: 'not valid url' })))
        .toThrowError('picture is not valid url')
    })
    test('should create id if not given', () => {
      const exercise = model(fakeExercise({ id: undefined }))
      expect(exercise.id).toBeDefined()
      expect(isCuid(exercise.id)).toBe(true)
    })
  })
  describe('methods', () => {
    test('toJson should return json representation', () => {
      const mockExercise = fakeExercise()
      const exercise = model(mockExercise)
      expect(exercise.toJson()).toEqual({
        id: mockExercise.id,
        name: mockExercise.name,
        type: mockExercise.type,
        difficulty: mockExercise.difficulty,
        duration: mockExercise.duration,
        breakDuration: mockExercise.breakDuration,
        picture: mockExercise.picture,
        mobility: mockExercise.mobility
      })
    })
    test('should return hash from name and type', () => {
      const mockExercise = fakeExercise()
      const exercise = model(mockExercise)
      const expectedHash = crypto
        .createHash('md5')
        .update(mockExercise.name + mockExercise.type)
        .digest('hex')
      expect(exercise.hash).toBe(expectedHash)
    })
  })
})
