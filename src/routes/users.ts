import { Router } from 'express'
import { MongoClient } from 'mongodb'
import { makeUserHandlers } from '../users'
import { PassportStatic } from 'passport'

export function makeUsersRouter (
  client: MongoClient,
  passport: PassportStatic
): Router {
  const router = Router()
  const handlers = makeUserHandlers(client)

  router.post('/', handlers.createUser)

  router.get('/:email',
    passport.authenticate('jwt', { session: false }),
    handlers.getByEmail
  )

  return router
}
