import { name } from 'faker'
import cuid from 'cuid'
import { MakeWorkoutArgs } from '../src/workouts/types'

export function makeFakeWorkoutArgs (args: any = {}): MakeWorkoutArgs {
  return Object.assign({
    name: name.firstName(),
    exercises: [],
    id: cuid(),
    userId: cuid()
  }, args)
}
