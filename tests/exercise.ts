import { random, internet } from 'faker'
import cuid from 'cuid'

export function fakeExercise (args: any = {}): ExerciseJson {
  return Object.assign({}, {
    id: cuid(),
    name: random.word(),
    type: random.word(),
    duration: random.number({ min: 1, max: 1000 * 60 * 60 * 23 }),
    breakDuration: random.number({ min: 0, max: 1000 * 60 * 60 * 23 }),
    difficulty: random.word(),
    mobility: random.word(),
    picture: internet.url()
  }, args)
}
