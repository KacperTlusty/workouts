import { name, random } from 'faker'
import cuid from 'cuid'
import { MakeWorkoutArgs, WorkoutExercise } from '../src/workouts/types'

export function makeFakeWorkoutArgs (args: any = {}): MakeWorkoutArgs {
  return Object.assign({
    name: name.firstName(),
    exercises: [],
    id: cuid(),
    userId: cuid()
  }, args)
}

export function makeFakeWorkoutExercise (args: any = {}): WorkoutExercise {
  return Object.assign({},
    {
      name: name.firstName(),
      order: random.number({ min: 0 }),
      duration: random.number({ min: 0, max: 1000 }),
      breakDuration: random.number({ min: 0, max: 60 }),
      repetition: random.number({ min: 0, max: 20 }),
      weights: random.number({ min: 0, max: 250 }),
      exerciseId: cuid()
    }, args)
}
