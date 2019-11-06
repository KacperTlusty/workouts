import {
  CreateMakeWorkoutArgs,
  MakeWorkoutArgs,
  WorkoutExercise,
  Workout
} from './types'

export default function createMakeWorkout ({
  makeId,
  validateId
}: CreateMakeWorkoutArgs): (args: MakeWorkoutArgs) => Workout {
  return function makeWorkout ({
    name,
    id,
    exercises = []
  }: MakeWorkoutArgs): Workout {
    if (!name) {
      throw new Error('name cannot be empty')
    }

    if (!id) {
      id = makeId()
    }

    if (!validateId(id)) {
      throw new Error('Given id is invalid.')
    }

    exercises.forEach(exercise => {
      validateExercise(exercise)
    })

    return Object.freeze<Workout>({
      name,
      id,
      addExercise,
      getExercises
    })

    function addExercise (exercise: WorkoutExercise): void {
      validateExercise(exercise)
      exercises.push(exercise)
    }

    function getExercises (): WorkoutExercise[] {
      return exercises
    }

    function validateExercise (exercise: WorkoutExercise): boolean {
      if (!exercise) {
        throw new Error('Cannot add null')
      }
      if (!validateId(exercise.exerciseId)) {
        throw new Error(`${exercise.exerciseId} is not valid exerciseId`)
      }
      if (exercise.duration < 0) {
        throw new Error('exercise duration cannot be negative integer')
      }
      if (exercise.breakDuration < 0) {
        throw new Error('exercise breakDuration cannot be negative integer')
      }

      return true
    }
  }
}
