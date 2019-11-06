import { MongoClient } from 'mongodb'
import cuid, { isCuid } from 'cuid'
import { createHash } from 'crypto'
import { UserHandler, UserController } from './types'
import { makeCreateUser } from './model'
import { makeUserDbConnector } from './db'
import { makeUserController } from './controller'
import { makeUserHandler } from './handler'

export function makeUserHandlers (client: MongoClient): UserHandler {
  const createUser = makeCreateUser({
    createId: cuid,
    validateId: isCuid,
    hashPassword: (password) => createHash('sha256').update(password).digest('hex')
  })

  const userDb = makeUserDbConnector(client.db('workouts'))

  const controller: UserController = makeUserController(userDb, createUser)
  return makeUserHandler(controller)
}
