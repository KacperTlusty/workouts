import { makeAuthController } from './controller'

describe('auth controller test suite', () => {
  describe('findById', () => {
    test('should return null if find by id returns null', async (done) => {
      const db: any = {
        findById: jest.fn(() => null)
      }
      const makeUser: any = jest.fn(() => ({
        id: 'fake id',
        name: 'fake name'
      }))
      const controller = makeAuthController(db, makeUser)

      const result = await controller.findById('fake id')
      expect(result).toBeNull()
      expect(db.findById).toHaveBeenCalledTimes(1)
      expect(db.findById).toHaveBeenCalledWith('fake id')
      expect(makeUser).toHaveBeenCalledTimes(0)
      done()
    })
    test('should return found user id and email', async (done) => {
      const db: any = {
        findById: jest.fn(() => ({
          _id: 'fake id',
          email: 'fake email'
        }))
      }
      const makeUser: any = jest.fn(() => ({
        id: 'fake id',
        email: 'fake email'
      }))
      const controller = await makeAuthController(db, makeUser)

      const result = await controller.findById('fake id')

      expect(result).toEqual({
        id: 'fake id',
        email: 'fake email'
      })
      expect(db.findById).toHaveBeenCalledTimes(1)
      expect(db.findById).toHaveBeenCalledWith('fake id')
      done()
    })
  })
  describe('login', () => {
    test('should return null if user is not found', async (done) => {
      const db: any = {
        findByEmail: jest.fn(() => null)
      }
      const controller = makeAuthController(db, null)

      const result = await controller.login('fake email', 'fake password')

      expect(result).toBeNull()
      expect(db.findByEmail).toHaveBeenCalledWith('fake email')
      expect(db.findByEmail).toHaveBeenCalledTimes(1)
      done()
    })
    test('should return user id and email when logged', async (done) => {
      const db: any = {
        findByEmail: jest.fn(() => ({
          _id: 'fake id',
          password: 'fake password',
          age: 25
        }))
      }
      const makeUser = jest.fn((arg: any): any => arg)
      const controller = makeAuthController(db, makeUser)

      const result = await controller.login('fake email', 'fake password')

      expect(result).toEqual({
        id: 'fake id',
        email: 'fake email'
      })
      done()
    })
    test('should return null if authentication fails', async (done) => {
      const db: any = {
        findByEmail: jest.fn(() => ({
          _id: 'fake id',
          password: 'password',
          age: 25
        }))
      }
      const makeUser = jest.fn((arg: any): any => arg)
      const controller = makeAuthController(db, makeUser)

      const result = await controller.login('fake email', 'fake password')

      expect(result).toBeNull()
      done()
    })
  })
})
