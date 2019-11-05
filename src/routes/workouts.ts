import { Router } from 'express'
import { MongoClient } from 'mongodb'
import { makeWorkoutHandlers } from '../workouts'

export function makeWorkoutRouter (client: MongoClient): Router {
  const router = Router()
  const handlers = makeWorkoutHandlers(client)

  router.get('/', handlers.getAll)

  router.post('/', handlers.create)

  router.delete('/:workoutId', handlers.create)

  router.get('/:workoutId', handlers.getById)

  return router
}
