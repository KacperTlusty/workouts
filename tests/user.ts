import { random, name, internet } from 'faker'
import { CreateUserArgs } from '../src/users/types'
import cuid = require('cuid')

export function fakeCreateUserArgs (args: any): CreateUserArgs {
  return Object.assign({}, {
    email: internet.email(),
    age: random.number({ min: 18, max: 80 }),
    firstName: name.firstName(),
    lastName: name.lastName(),
    password: internet.password(12),
    id: cuid()
  }, args)
}
