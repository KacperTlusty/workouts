import { random, internet } from 'faker'

export function fakeExercise (args: any = {}): Exercise {
  return Object.assign({
    id: random.uuid(),
    name: random.word(),
    type: random.word(),
    duration: random.number({ min: 1, max: 1000 * 60 * 60 * 23 }),
    breakDuration: random.number({ min: 0, max: 1000 * 60 * 60 * 23 }),
    difficulty: random.word(),
    mobility: random.word(),
    picture: internet.url()
  }, args)
}
