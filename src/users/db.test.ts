import { makeUserDbConnector } from './db'

describe('user db connector', () => {
  let db: any
  beforeEach(() => {
    db = (args: any): any => ({
      collection: (): any => ({
        findOne: jest.fn(),
        insertOne: jest.fn(),
        ...args
      })
    })
  })
  describe('find by email', () => {
    test('should call find one with query and return result', async (done) => {
      const findOneMock = jest.fn(() => 'fake response')
      const dbConnector = makeUserDbConnector(db({
        findOne: findOneMock
      }))

      const dbUser = await dbConnector.findByEmail('fake email')

      expect(dbUser).toEqual('fake response')
      expect(findOneMock).toHaveBeenCalledTimes(1)
      expect(findOneMock).toHaveBeenCalledWith({ email: 'fake email' })
      done()
    })
  })
  describe('insert one', () => {
    test('should call insert one and return null if not added', async (done) => {
      const insertOne = jest.fn(() => ({ insertedCount: 0 }))
      const dbConnector = makeUserDbConnector(db({
        insertOne
      }))
      const fakeUser: any = 'fake user'
      const dbUser = await dbConnector.insertOne(fakeUser)

      expect(dbUser).toBeNull()
      expect(insertOne).toHaveBeenCalledTimes(1)
      expect(insertOne).toHaveBeenCalledWith('fake user')
      done()
    })
    test('should call insert one and return inserted object', async (done) => {
      const insertOne = jest.fn(() => ({ insertedCount: 1 }))
      const dbConnector = makeUserDbConnector(db({
        insertOne
      }))
      const fakeUser: any = 'fake user'

      const dbUser = await dbConnector.insertOne(fakeUser)

      expect(dbUser).toBe('fake user')
      expect(insertOne).toHaveBeenCalledWith('fake user')
      expect(insertOne).toHaveBeenCalledTimes(1)
      done()
    })
  })
})
