import { dbClient } from './db'
import makeControllers from './controller'
import makeHandlers from './handler'
import makeWorkoutModel from './model'
import cuid, { isCuid } from 'cuid'

const db = dbClient()
const WorkoutModel = makeWorkoutModel({
  makeId: cuid,
  validateId: isCuid
})

const controller = {
  create: makeControllers.makeCreate(db, WorkoutModel),
  getAll: makeControllers.makeFindAll(db, WorkoutModel)
}

const handlers = {
  create: makeHandlers.makeCreate(controller),
  getAll: makeHandlers.makeGetAll(controller)
}

export default handlers
