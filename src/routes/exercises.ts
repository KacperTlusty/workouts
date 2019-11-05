import { Router } from 'express'
import { MongoClient } from 'mongodb'
import { makeHandlers } from '../exercises'

export function makeExerciseRouter (client: MongoClient): Router {
  const router = Router()
  const handlers = makeHandlers(client)

  router.get('/', handlers.getAll)

  router.post('/', handlers.createOne)

  router.get('/:exerciseId', handlers.getById)

  router.delete('/:exerciseId', handlers.deleteById)

  return router
}
