function toJson (entity: Workout): WorkoutJson {
  return {
    id: entity.id,
    name: entity.name,
    exercises: entity.getExercises().map(exercise => exercise.id),
    userId: entity.userId
  }
}

export function makeCreate (
  db: WorkoutDb,
  makeWorkout: (MakeWorkoutArgs) => Workout
) {
  return async function create (workoutArgs: MakeWorkoutArgs): Promise<WorkoutJson> {
    const workout = makeWorkout(workoutArgs)

    const existingWorkout = await db.findById(workout.id)
    if (existingWorkout) {
      return toJson(makeWorkout({
        id: existingWorkout._id,
        name: existingWorkout.name,
        exercises: existingWorkout.exercises,
        userId: existingWorkout.userId
      }))
    }

    const created = await db.create({
      _id: workout.id,
      userId: workout.userId,
      exercises: workout.getExercises().map(exercise => exercise.id),
      name: workout.name
    })
    
    return toJson(makeWorkout({ ...created, id: created._id }))
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
        id: row._id,
        name: row.name,
        exercises: row.exercises,
        userId: row.userId
      }))
      .map(toJson)
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

    const workout = makeWorkout({
      id: row._id,
      name: row.name,
      exercises: row.exercises,
      userId: row.userId
    })
    
    return Promise.resolve(toJson(workout))
  }
}

export function makeDeleteById (
  db: WorkoutDb,
  makeWorkout: (MakeWorkoutArgs) => Workout
): (string) => Promise<string> {
  return async function deleteById(id: string): Promise<string> {
    return db.deleteById(id)
  }
}

export default {
  makeCreate,
  makeFindAll,
  makeFindById,
  makeDeleteById
}
