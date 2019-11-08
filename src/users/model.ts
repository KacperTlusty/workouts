import {
  MakeCreateUserArgs,
  CreateUserArgs,
  User,
  UserJson
} from './types'

const MAX_USER_AGE = 100
const MIN_USER_AGE = 18

export function makeCreateUser ({
  createId,
  hashPassword,
  validateId,
  validateEmail = (email: string): boolean => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(email)
}: MakeCreateUserArgs) {
  return function createUser ({
    id,
    email,
    age,
    password,
    firstName,
    lastName
  }: CreateUserArgs): User {
    if (!id) {
      id = createId()
    }

    if (!validateId(id)) {
      throw new Error(`'${id}' is not valid cuid`)
    }
    if (!validateEmail(email)) {
      throw new Error(`'${email}' is not valid email`)
    }
    if (!age) {
      throw new Error('User must have age property')
    }
    if (age < MIN_USER_AGE) {
      throw new Error('User must be atleast 18 years old')
    }
    if (age > MAX_USER_AGE) {
      throw new Error('User is too old to lift :)')
    }

    if (password) {
      password = hashPassword(password)
    }

    return Object.freeze({
      id,
      email,
      age,
      hash: '',
      password,
      firstName,
      lastName,
      toJson
    })

    function toJson (): UserJson {
      return {
        id,
        email,
        age,
        firstName,
        lastName
      }
    }
  }
}
