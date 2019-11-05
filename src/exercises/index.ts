import cuid, { isCuid } from 'cuid'
import { isHttpUri, isHttpsUri } from 'valid-url'
import crypto from 'crypto'
import { makeDbConnector } from './db'
import { MongoClient } from 'mongodb'
import { makeExerciseHandlers } from './handler'
import { ExerciseHandler, ExerciseController } from './types'
import {
  makeCreateExercise,
  makeDeleteById,
  makeFindAllExercises,
  makeFindById
} from './controller'
import makeExercise from './model'

const makeHash = crypto.createHash('md5')

const exercise = makeExercise({
  createId: cuid,
  validateId: isCuid,
  isUrl: (url) => isHttpUri(url) !== undefined || isHttpsUri(url) !== undefined,
  createHash: (text) => makeHash.update(text).digest('hex')
})

export function makeHandlers (client: MongoClient): ExerciseHandler {
  const db = makeDbConnector(client.db('workouts'))

  const controller: ExerciseController = {
    create: makeCreateExercise({
      db,
      makeExercise: exercise
    }),
    getAll: makeFindAllExercises({
      db,
      makeExercise: exercise
    }),
    getById: makeFindById({
      db,
      makeExercise: exercise
    }),
    deleteById: makeDeleteById({
      db,
      makeExercise: exercise
    })
  }

  return makeExerciseHandlers(controller)
}
