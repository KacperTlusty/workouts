import cuid, { isCuid } from 'cuid'
import { createHash } from 'crypto'
import { makeCreateUser } from './model'
import { fakeCreateUserArgs } from '../../tests/user'
import { CreateUserArgs, User } from './types'

describe('User model', () => {
  let createUser: (user: CreateUserArgs) => User
  beforeEach(() => {
    createUser = makeCreateUser({
      validateId: isCuid,
      createId: cuid,
      hashPassword: (password) => createHash('sha256').update(password).digest('hex')
    })
  })
  describe('should validate input data', () => {
    test('should check for id', () => {
      expect(() => createUser(fakeCreateUserArgs({ id: 'invalid id' })))
        .toThrowError("'invalid id' is not valid cuid")
    })
    test('should check for email', () => {
      const args = fakeCreateUserArgs({ email: 'invalid email' })
      expect(() => createUser(args)).toThrowError("'invalid email' is not valid email")
    })
    test('should verify age', () => {
      const tooYoung = fakeCreateUserArgs({ age: 15 })
      const tooOld = fakeCreateUserArgs({ age: 101 })
      expect(() => createUser(tooYoung)).toThrowError('User must be atleast 18 years old')
      expect(() => createUser(tooOld)).toThrowError('User is too old to lift :)')
    })
  })
  describe('should create neccessary properties', () => {
    test('should create id', () => {
      const args = fakeCreateUserArgs({ id: undefined })
      const user = createUser(args)
      expect(isCuid(user.id)).toBe(true)
      expect(user.id.length).toBeGreaterThan(0)
    })
    test('should hash password', () => {
      const args = fakeCreateUserArgs({ password: 'somepass' })
      const user = createUser(args)
      expect(user.password).toBe(createHash('sha256').update('somepass').digest('hex'))
    })
  })
  describe('methods', () => {
    test('should return object as Json ready format', () => {
      const args = fakeCreateUserArgs({})
      const user = createUser(args)
      expect(user.toJson()).toEqual({
        id: args.id,
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        age: args.age
      })
    })
  })
})
