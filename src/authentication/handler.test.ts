import { makeAuthHandlers } from './handler'

describe('authorization handlers', () => {
  describe('returnJwt', () => {
    test('should set request and response with created jwt', () => {
      const makeJwt = jest.fn(() => 'fake jwt')
      const handler = makeAuthHandlers(makeJwt)
      const fakeRequest: any = {
        user: {
          id: 'fake id',
          email: 'fake email'
        }
      }
      const fakeResponse: any = {
        status: jest.fn(() => fakeResponse),
        json: jest.fn(() => fakeResponse)
      }

      handler.returnJwt(fakeRequest, fakeResponse)

      expect(fakeResponse.status).toHaveBeenCalledTimes(1)
      expect(fakeResponse.json).toHaveBeenCalledTimes(1)
      expect(fakeResponse.json).toHaveBeenCalledWith({
        token: 'fake jwt'
      })
      expect(fakeResponse.status).toHaveBeenCalledWith(200)
    })
  })
})
