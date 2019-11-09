import { makeUserController } from './controller'
import { UserController, CreateUserArgs, Privilage } from './types'
import { fakeCreateUserArgs } from '../../tests/user'

describe('User controller', () => {
  const makeUser: (args: CreateUserArgs) => any = arg => ({
    password: 'fake pass',
    id: arg.id,
    email: arg.email,
    firstName: arg.firstName,
    age: arg.age,
    privilage: arg.privilage || Privilage.User,
    lastName: arg.lastName,
    toJson: (): any => ({
      id: arg.id,
      email: arg.email,
      firstName: arg.firstName,
      age: arg.age,
      lastName: arg.lastName
    })
  })
  let makeMockDb: any
  let fakeUser: CreateUserArgs
  beforeEach(() => {
    makeMockDb = (args: any): any => ({
      insertOne: jest.fn(),
      findByEmail: jest.fn(),
      ...args
    })
    fakeUser = fakeCreateUserArgs({})
  })
  describe('create', () => {
    test('should try to find user by email first', async (done) => {
      const mockDb: any = makeMockDb({
        findByEmail: jest.fn((): any => ({
          firstName: fakeUser.firstName,
          lastName: fakeUser.lastName,
          age: fakeUser.age,
          email: fakeUser.email,
          _id: 'fake id'
        }))
      })
      const controller: UserController = makeUserController(
        mockDb,
        makeUser
      )
      const user = await controller.create(fakeUser)
      expect(mockDb.findByEmail).toHaveBeenCalledTimes(1)
      expect(mockDb.findByEmail).toHaveBeenCalledWith(fakeUser.email)
      expect(user).toEqual({
        id: 'fake id',
        email: fakeUser.email,
        age: fakeUser.age,
        firstName: fakeUser.firstName,
        lastName: fakeUser.lastName
      })
      done()
    })
    test('should create new one and return created object', async (done) => {
      const mockDb: any = makeMockDb({
        findByEmail: jest.fn(() => null),
        insertOne: jest.fn((obj: any): any => obj)
      })
      const controller = makeUserController(
        mockDb,
        makeUser
      )
      const user = await controller.create(fakeUser)
      expect(user).toEqual({
        id: fakeUser.id,
        email: fakeUser.email,
        lastName: fakeUser.lastName,
        firstName: fakeUser.firstName,
        age: fakeUser.age
      })
      expect(mockDb.insertOne).toHaveBeenCalledWith({
        _id: fakeUser.id,
        email: fakeUser.email,
        lastName: fakeUser.lastName,
        firstName: fakeUser.firstName,
        privilage: Privilage.User,
        age: fakeUser.age,
        password: makeUser(fakeUser).password
      })
      done()
    })
  })
  describe('findByEmail', () => {
    test('should call db and return null if not found', async (done) => {
      const findByEmailMock = jest.fn(() => null)
      const mockDb: any = makeMockDb({
        findByEmail: findByEmailMock
      })
      const controller = makeUserController(
        mockDb,
        makeUser
      )
      const user = await controller.findByEmail('fake email')

      expect(user).toBeNull()
      expect(findByEmailMock).toHaveBeenCalledTimes(1)
      expect(findByEmailMock).toHaveBeenCalledWith('fake email')
      done()
    })
    test('should return found object', async (done) => {
      const findByEmailMock = jest.fn(() => ({
        _id: 'fake id',
        firstName: 'fake first name',
        lastName: 'fake last name',
        email: 'fake@email.com',
        password: 'fake password',
        fake: 'prop',
        age: 20
      }))
      const mockDb: any = makeMockDb({
        findByEmail: findByEmailMock
      })
      const controller = makeUserController(
        mockDb,
        makeUser
      )

      const user = await controller.findByEmail('fake email')

      expect(user).toEqual({
        id: 'fake id',
        email: 'fake@email.com',
        age: 20,
        firstName: 'fake first name',
        lastName: 'fake last name'
      })
      expect(findByEmailMock).toHaveBeenCalledTimes(1)
      expect(findByEmailMock).toHaveBeenCalledWith('fake email')
      done()
    })
  })
})
