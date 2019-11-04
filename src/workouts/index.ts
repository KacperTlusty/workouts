import { dbClient } from './db'
import makeControllers from './controller'
import makeHandlers, { WorkoutController } from './handler'
import makeWorkoutModel from './model'
import cuid, { isCuid } from 'cuid'

const db = dbClient()
const WorkoutModel = makeWorkoutModel({
  makeId: cuid,
  validateId: isCuid
})

const controller: WorkoutController = {
  create: makeControllers.makeCreate(db, WorkoutModel),
  getAll: makeControllers.makeFindAll(db, WorkoutModel),
  getById: makeControllers.makeFindById(db, WorkoutModel),
  deleteById: makeControllers.makeDeleteById(db, WorkoutModel)
}

const handlers = {
  create: makeHandlers.makeCreate(controller),
  getAll: makeHandlers.makeGetAll(controller),
  getById: makeHandlers.makeGetById(controller),
  deleteById: makeHandlers.makeDeleteById(controller)
}

export default handlers
