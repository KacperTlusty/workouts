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
})
