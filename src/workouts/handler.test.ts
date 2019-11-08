import {
  makeGetById,
  makeGetAll,
  makeCreate,
  makeDeleteById
} from './handler'
import { WorkoutController } from './types'
import { Request, Response } from 'express'
import { makeFakeWorkoutExercise } from '../../tests/workout'

const controllerMock = (args: any): WorkoutController => Object.assign({
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn()
}, args)

describe('Workout request handlers', () => {
  let mockResponse: any
  beforeEach(() => {
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(() => mockResponse)
    }
  })
  describe('GET /', () => {
    let getAll: (req: Request, res: Response) => Promise<Response>
    let fakeWorkouts: any
    beforeEach(() => {
      fakeWorkouts = [{
        name: 'fake name',
        id: 'fake id',
        exercises: [
          'fake exercise id 1',
          'fake exercise id 2'
        ]
      }]
      getAll = makeGetAll(controllerMock({
        getAll: async () => {
          return fakeWorkouts
        }
      }))
    })
    test('should set status 200', async (done) => {
      await getAll(null, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      done()
    })
    test('should return list of all workouts', async (done) => {
      await getAll(null, mockResponse)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith(fakeWorkouts)
      done()
    })
    test('should throw 500 if controller throws', async (done) => {
      getAll = makeGetAll(controllerMock({
        getAll: jest.fn(() => {
          throw new Error('fake error')
        })
      }))
      await getAll(null, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'fake error' })
      done()
    })
  })
  describe('/POST', () => {
    let mockRequest: any
    beforeEach(() => {
      mockRequest = {
        body: {
          name: 'fake name',
          userId: 'fake user id',
          fake: 'prop'
        }
      }
    })
    test('should create workout', async (done) => {
      const fakeExercises = [
        makeFakeWorkoutExercise(),
        makeFakeWorkoutExercise()
      ]
      const controller = controllerMock({
        create: jest.fn(() => Promise.resolve({
          id: 'fake id 1',
          name: 'fake name 1',
          userId: 'fake user 1',
          exercises: fakeExercises
        }))
      })
      mockRequest.body.exercises = fakeExercises
      const create = makeCreate(controller)
      await create(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 'fake id 1',
        name: 'fake name 1',
        userId: 'fake user 1',
        exercises: fakeExercises
      })
      expect(controller.create).toHaveBeenCalledWith({
        name: 'fake name',
        userId: 'fake user id',
        exercises: fakeExercises
      })
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      done()
    })
    test('should return 500 and error message when controller throws', async (done) => {
      const create = makeCreate({
        getAll: jest.fn(),
        create: jest.fn(() => {
          throw new Error('fake error')
        }),
        getById: jest.fn(),
        deleteById: jest.fn()
      })
      await create(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'fake error' })
      done()
    })
  })
  describe('GET /:workoutId', () => {
    let mockRequest: any
    beforeEach(() => {
      mockRequest = {
        params: {
          workoutId: 'fake workout id'
        }
      }
    })
    test('should return found workout', async (done) => {
      const getByIdMock = jest.fn(() => 'fake workout')
      const getById = makeGetById(controllerMock({
        getById: getByIdMock
      }))
      await getById(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith('fake workout')
      expect(getByIdMock).toHaveBeenCalledWith('fake workout id')
      expect(getByIdMock).toHaveBeenCalledTimes(1)
      done()
    })
    test('should return 404 if object is not found', async (done) => {
      const getByIdMock = jest.fn(() => null)
      const getById = makeGetById(controllerMock({
        getById: getByIdMock
      }))

      await getById(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({})
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      done()
    })
    test('should handle error', async (done) => {
      const getByIdMock = jest.fn(() => {
        throw new Error('fake error')
      })
      const getById = makeGetById(controllerMock({
        getById: getByIdMock
      }))
      await getById(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'fake error' })
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      done()
    })
  })
  describe('DELETE /:workoutId', () => {
    let mockRequest
    beforeEach(() => {
      mockRequest = {
        params: {
          workoutId: 'fake workout id'
        }
      }
    })
    test('should return operation status', async (done) => {
      const removeByIdMock = jest.fn(() => 'Object removed.')
      const deleteById = makeDeleteById(controllerMock({
        deleteById: removeByIdMock
      }))
      await deleteById(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith('Object removed.')
      done()
    })
    test('should return 404 when null is returned', async (done) => {
      const removeByIdMock = jest.fn(() => null)
      const deleteById = makeDeleteById(controllerMock({
        deleteById: removeByIdMock
      }))
      await deleteById(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith('Not Found')
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      done()
    })
    test('should handle controller error', async (done) => {
      const removeByIdMock = jest.fn(() => {
        throw new Error('fake error')
      })
      const deleteById = makeDeleteById(controllerMock({
        deleteById: removeByIdMock
      }))

      await deleteById(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'fake error' })
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      done()
    })
  })
})
