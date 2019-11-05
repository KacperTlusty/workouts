import {
  CreateMakeWorkoutArgs,
  MakeWorkoutArgs,
  Workout
} from './types'
import { Exercise } from '../exercises/types'

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

    function addExercise (exercise: Exercise): void {
      if (!exercise) {
        throw new Error('Cannot add null')
      }
      exercises.push(exercise)
    }

    function getExercises (): Exercise[] {
      return exercises
    }
    return Object.freeze<Workout>({
      name,
      id,
      addExercise,
      getExercises
    })
  }
}
