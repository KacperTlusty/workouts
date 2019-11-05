import { dbClient } from './db'
import { makeController } from './controller'
import { makeHandlers } from './handler'
import { WorkoutHandler, WorkoutController } from './types'
import makeWorkoutModel from './model'
import cuid, { isCuid } from 'cuid'
import { MongoClient } from 'mongodb'

export function makeWorkoutHandlers (client: MongoClient): WorkoutHandler {
  const db = dbClient(client)
  const WorkoutModel = makeWorkoutModel({
    makeId: cuid,
    validateId: isCuid
  })

  const controller: WorkoutController = makeController(db, WorkoutModel)

  return makeHandlers(controller)
}
