import {
  WorkoutController,
  WorkoutJson,
  Workout,
  MakeWorkoutArgs,
  WorkoutDb
} from './types'

export function makeCreate (
  db: WorkoutDb,
  makeWorkout: (MakeWorkoutArgs) => Workout
) {
  return async function create (workoutArgs: MakeWorkoutArgs): Promise<WorkoutJson> {
    const workout = makeWorkout(workoutArgs)

    const existingWorkout = await db.findById(workout.id)
    if (existingWorkout) {
      return makeWorkout({
        id: existingWorkout._id,
        name: existingWorkout.name,
        exercises: existingWorkout.exercises,
        userId: existingWorkout.userId,
        day: existingWorkout.day,
        finished: existingWorkout.finished
      }).toJson()
    }

    const created = await db.create({
      _id: workout.id,
      userId: workout.userId,
      exercises: workout.getExercises(),
      name: workout.name,
      day: workout.day,
      finished: workout.finished
    })

    return makeWorkout({ ...created, id: created._id }).toJson()
  }
}

export function makeFindAll (
  db: WorkoutDb,
  makeWorkout: (MakeWorkoutArgs) => Workout
): () => Promise<WorkoutJson[]> {
  return async function findAll (): Promise<WorkoutJson[]> {
    const dbWorkouts = await db.findAll()
    return dbWorkouts
      .map(row => makeWorkout({
        ...row,
        id: row._id
      }).toJson())
  }
}

export function makeFindById (
  db: WorkoutDb,
  makeWorkout: (MakeWorkoutArgs) => Workout
): (string) => Promise<WorkoutJson> {
  return async function findById (id: string): Promise<WorkoutJson> {
    const row = await db.findById(id)

    if (!row) {
      return Promise.resolve(null)
    }

    return makeWorkout({
      id: row._id,
      name: row.name,
      exercises: row.exercises,
      userId: row.userId,
      day: row.day,
      finished: row.finished
    }).toJson()
  }
}

export function makeDeleteById (
  db: WorkoutDb,
  makeWorkout: (args: MakeWorkoutArgs) => Workout
): (string) => Promise<string> {
  return async function deleteById (id: string): Promise<string> {
    const found = await db.findById(id)
    if (!found) {
      return null
    }
    if (makeWorkout({
      ...found,
      id: found._id
    }).finished) {
      throw new Error('Cannot delete finished workout')
    }
    return db.deleteById(id)
  }
}

export function makeController (
  db: WorkoutDb,
  makeWorkout: (MakeWorkoutArgs) => Workout
): WorkoutController {
  return {
    create: makeCreate(db, makeWorkout),
    getAll: makeFindAll(db, makeWorkout),
    getById: makeFindById(db, makeWorkout),
    deleteById: makeDeleteById(db, makeWorkout)
  }
}

export default {
  makeCreate,
  makeFindAll,
  makeFindById,
  makeDeleteById
}
