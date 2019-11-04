import { makeGetAll, makeCreate } from './handler'
import { Request, Response } from 'express'

describe('Workout request handlers', () => {
  describe('GET /', () => {
    let getAll: (req: Request, res: Response) => Promise<Response>
    let mockResponse: any
    let fakeWorkouts: WorkoutJson[]
    beforeEach(() => {
      fakeWorkouts = [{
        name: 'fake name',
        id: 'fake id',
        exercises: [
          'fake exercise id 1',
          'fake exercise id 2'
        ]
      }]
      getAll = makeGetAll({
        getAll: async () => {
          return fakeWorkouts
        },
        create: async () => fakeWorkouts[0]
      })
      mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn(() => mockResponse)
      }
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
      getAll = makeGetAll({
        getAll: jest.fn(() => {
          throw new Error('fake error')
        }),
        create: jest.fn()
      })
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
    let mockResponse: any
    beforeEach(() => {
      mockRequest = {
        body: {
          name: 'fake name',
          userId: 'fake user id'
        }
      }
      mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn(() => mockResponse)
      }
    })
    test('should create workout', async (done) => {
      const create = makeCreate({
        getAll: jest.fn(),
        create: jest.fn(() => Promise.resolve({
          id: 'fake id 1',
          name: 'fake name 1',
          userId: 'fake user 1',
          exercises: []
        }))
      })
      await create(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 'fake id 1',
        name: 'fake name 1',
        userId: 'fake user 1',
        exercises: []
      })
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      done()
    })
    test('should return 500 and error message when controller throws', async (done) => {
      const create = makeCreate({
        getAll: jest.fn(),
        create: jest.fn(() => {
          throw new Error('fake error')
        })
      })
      await create(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'fake error' })
      done()
    })
  })
})
