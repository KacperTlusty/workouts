import { makeExerciseHandlers } from './handler'
import { ExerciseHandler } from './types'
import { fakeExercise } from '../../tests/exercise'

describe('exercise handlers test', () => {
  let mockResponse
  let makeHandlers: (args: any) => ExerciseHandler
  beforeEach(() => {
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(() => mockResponse)
    }

    makeHandlers = (args: any): ExerciseHandler => {
      return makeExerciseHandlers({
        getAll: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        ...args
      })
    }
  })
  describe('GET /', () => {
    test('should set response with given results', async (done) => {
      const handlers = makeHandlers({
        getAll: jest.fn(async (): Promise<any> => ['fake 1', 'fake 2'])
      })
      await handlers.getAll(null, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith(['fake 1', 'fake 2'])
      done()
    })
    test('should set response when controller throws', async (done) => {
      const handlers = makeHandlers({
        getAll: jest.fn(() => {
          throw new Error('fake error')
        })
      })
      await handlers.getAll(null, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'fake error' })
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      done()
    })
  })
  describe('POST /', () => {
    test('should return created object in response', async (done) => {
      const exerciseJson = fakeExercise()
      const createMock = jest.fn(async () => exerciseJson)
      const handlers = makeHandlers({
        create: createMock
      })
      const mockRequest: any = {
        body: {
          name: 'fake name',
          type: 'fake type',
          difficulty: 'fake difficulty',
          fake: 'prop',
          mobility: 'fake mobility',
          id: 'fake id',
          picture: 'fake picture'
        }
      }
      await handlers.createOne(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith(exerciseJson)
      expect(createMock).toHaveBeenCalledTimes(1)
      expect(createMock).toHaveBeenCalledWith({
        name: 'fake name',
        type: 'fake type',
        difficulty: 'fake difficulty',
        mobility: 'fake mobility',
        picture: 'fake picture'
      })
      done()
    })
    test('should set response when controller throws', async (done) => {
      const handlers = makeHandlers({
        create: jest.fn(() => {
          throw new Error('fake error')
        })
      })
      const mockRequest: any = {
        body: {}
      }
      await handlers.createOne(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'fake error'
      })
      done()
    })
  })
  describe('GET /:exerciseId', () => {
    let mockRequest: any
    beforeEach(() => {
      mockRequest = {
        params: {
          exerciseId: 'fake id'
        }
      }
    })
    test('should set response with found exercise', async (done) => {
      const exercise = fakeExercise()
      const handlers = makeHandlers({
        getById: jest.fn(async () => exercise)
      })

      await handlers.getById(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith(exercise)
      done()
    })
    test('should set response when controller returns null', async (done) => {
      const handlers = makeHandlers({
        getById: jest.fn(() => null)
      })

      await handlers.getById(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith('Not found.')
      done()
    })
    test('should set response when controller throws', async (done) => {
      const handlers = makeHandlers({
        getById: jest.fn(() => {
          throw new Error('fake error')
        })
      })

      await handlers.getById(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'fake error' })
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      done()
    })
  })
  describe('DELETE /:exerciseId', () => {
    let mockRequest: any
    beforeEach(() => {
      mockRequest = {
        params: {
          exerciseId: 'fake exercise id'
        }
      }
    })
    test('should set response when controller returns value', async (done) => {
      const handlers = makeHandlers({
        deleteById: jest.fn(() => fakeExercise())
      })
      mockResponse.end = jest.fn(() => mockResponse)
      await handlers.deleteById(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(204)
      expect(mockResponse.end).toHaveBeenCalledTimes(1)
      done()
    })
    test('should return bad request when no object was deleted', async (done) => {
      const handlers = makeHandlers({
        deleteById: jest.fn(() => null)
      })

      await handlers.deleteById(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenLastCalledWith({ error: 'not found' })
      done()
    })
  })
})
