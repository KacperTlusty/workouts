export function makeCreate (
  db: WorkoutDb,
  makeWorkout: (MakeWorkoutArgs) => Workout
) {
  return async function create (workoutArgs: MakeWorkoutArgs): Promise<WorkoutDbEntity> {
    const workout = makeWorkout(workoutArgs)

    const existingWorkout = db.findById(workout.id)
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
    const result = dbWorkouts
      .map(dbWorkout => makeWorkout(dbWorkout))
      .map(workout => ({
        id: workout.id,
        userId: workout.userId,
        exercises: workout.getExercises().map(exercise => exercise.id),
        name: workout.name
      }))
    return Promise.resolve(result)
  }
}

export default {
  makeCreate,
  makeFindAll
}
