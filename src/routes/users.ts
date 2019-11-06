import { Router } from 'express'
import { MongoClient } from 'mongodb'
import { makeUserHandlers } from '../users'

export function makeUsersRouter (client: MongoClient): Router {
  const router = Router()
  const handlers = makeUserHandlers(client)

  router.post('/', handlers.createUser)

  router.get('/:email', handlers.getByEmail)

  return router
}
