import { Db, Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { makeJwtStrategy, makeLocalStrategy } from './strategies'
import { AuthStratiegies, AuthDb } from './types'
import { UserDbEntity, CreateUserArgs, User, UserAuth } from '../users/types'
import { makeAuthDb } from './db'
import { makeAuthController } from './controller'
import { makeAuthHandlers } from './handler'

export function makeAuthStrategies (
  db: Db,
  makeUser: (args: CreateUserArgs) => User
): AuthStratiegies {
  const collection: Collection<UserDbEntity> = db.collection('users')
  const authDb: AuthDb = makeAuthDb(collection)
  const controller = makeAuthController(authDb, makeUser)
  return {
    jwt: makeJwtStrategy(controller),
    local: makeLocalStrategy(controller)
  }
}

export const authHandler = makeAuthHandlers(
  (user: UserAuth) => sign(user, process.env.JWT_SECRET_KEY)
)
