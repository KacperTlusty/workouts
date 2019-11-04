export function makeCreate (
  db: WorkoutDb,
  makeWorkout: (MakeWorkoutArgs) => Workout
) {
  return async function create (workoutArgs: MakeWorkoutArgs): Promise<WorkoutDbEntity> {
    const workout = makeWorkout(workoutArgs)

    const existingWorkout = await db.findById(workout.id)
    if (existingWorkout) {
      return existingWorkout
    }

    return db.create({
      id: workout.id,
      userId: workout.userId,
      exercises: workout.getExercises().map(exercise => exercise.id),
      name: workout.name
    })
  }
}

export function makeFindAll (
  db: WorkoutDb,
  makeWorkout: (MakeWorkoutArgs) => Workout
): () => Promise<WorkoutJson[]> {
  return async function findAll (): Promise<WorkoutJson[]> {
    const dbWorkouts = await db.findAll()
    return dbWorkouts
      .map(dbWorkout => makeWorkout(dbWorkout))
      .map(workout => ({
        id: workout.id,
        userId: workout.userId,
        exercises: workout.getExercises().map(exercise => exercise.id),
        name: workout.name
      }))
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

    const workout = makeWorkout(row)
    
    return Promise.resolve({
      id: workout.id,
      name: workout.name,
      exercises: workout.getExercises().map(exercise => exercise.id),
      userId: workout.userId
    })
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
