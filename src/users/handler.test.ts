import { makeUserHandler } from './handler'

describe('User handler', () => {
  let mockResponse: any
  beforeEach(() => {
    mockResponse = {
      json: jest.fn(() => mockResponse),
      status: jest.fn(() => mockResponse)
    }
  })
  describe('POST /', () => {
    test('should handle controller throw and return response', async (done) => {
      const fakeController: any = {
        create: jest.fn(() => {
          throw new Error('fake error')
        })
      }
      const handler = makeUserHandler(fakeController)
      const mockRequest: any = {
        body: {}
      }
      handler.createUser(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'fake error'
      })
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      done()
    })
    test('should call controller and set response', async (done) => {
      const fakeController: any = {
        create: jest.fn(() => 'fake user')
      }
      const handler = makeUserHandler(fakeController)
      const mockRequest: any = {
        body: {
          email: 'fake email',
          fake: 'prop',
          id: 'fakeid',
          firstName: 'fake first name',
          lastName: 'fake last name',
          password: 'fake password',
          age: 20
        }
      }

      await handler.createUser(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith('fake user')
      expect(fakeController.create).toHaveBeenCalledWith({
        email: 'fake email',
        firstName: 'fake first name',
        lastName: 'fake last name',
        password: 'fake password',
        age: 20
      })
      expect(fakeController.create).toHaveBeenCalledTimes(1)
      done()
    })
  })
  describe('GET /:email', () => {
    test('should set 404 when object not found', async (done) => {
      const fakeController: any = {
        findByEmail: jest.fn(() => null)
      }
      const handler = makeUserHandler(fakeController)
      const mockRequest: any = {
        params: {
          email: 'fakeemail'
        }
      }
      await handler.getByEmail(mockRequest, mockResponse)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'not found'
      })
      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      done()
    })
    test('should send found object when found', async (done) => {
      const fakeController: any = {
        findByEmail: jest.fn(() => 'fake obj')
      }
      const handler = makeUserHandler(fakeController)
      const mockRequest: any = {
        params: {
          email: 'fake email'
        }
      }
      await handler.getByEmail(mockRequest, mockResponse)

      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith('fake obj')
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      done()
    })
    test('should handle controller throw', async (done) => {
      const fakeController: any = {
        findByEmail: jest.fn(() => {
          throw new Error('fake error')
        })
      }
      const handler = makeUserHandler(fakeController)
      const mockRequest: any = {
        params: {
          email: 'fake email'
        }
      }

      await handler.getByEmail(mockRequest, mockResponse)

      expect(mockResponse.json).toHaveBeenCalledTimes(1)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'fake error'
      })
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.status).toHaveBeenCalledTimes(1)
      done()
    })
  })
})
