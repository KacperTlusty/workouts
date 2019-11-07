import { makeJwtStrategy, makeLocalStrategy } from './strategies'
import { Db, Collection } from 'mongodb'
import { AuthStratiegies, AuthDb } from './types'
import { UserDbEntity, CreateUserArgs, User } from '../users/types'
import { makeAuthDb } from './db'
import { makeAuthController } from './controller'

export function makeAuthStrategies (
  db: Db,
  makeUser: (args: CreateUserArgs) => User
): AuthStratiegies {
  const collection: Collection<UserDbEntity> = db.collection('user')

  const authDb: AuthDb = makeAuthDb(collection)
  const controller = makeAuthController(authDb, makeUser)
  return {
    jwt: makeJwtStrategy(controller),
    local: makeLocalStrategy(controller)
  }
}
