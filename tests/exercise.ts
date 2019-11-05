import { random, internet } from 'faker'
import cuid from 'cuid'
import { ExerciseJson } from '../src/exercises/types'

export function fakeExercise (args: any = {}): ExerciseJson {
  return Object.assign({}, {
    id: cuid(),
    name: random.word(),
    type: random.word(),
    difficulty: random.word(),
    mobility: random.word(),
    picture: internet.url()
  }, args)
}
