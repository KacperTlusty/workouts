import {
  Exercise,
  MakeExerciseModel,
  ExerciseArgs,
  ExerciseJson
} from './types'

export default function makeModel ({
  createId,
  validateId,
  isUrl,
  createHash
}: MakeExerciseModel): (ExerciseArgs) => Exercise {
  return function ({
    name,
    type,
    duration = 0,
    breakDuration = 0,
    picture = '',
    mobility = '',
    difficulty = '',
    id = '',
    hash
  }: ExerciseArgs): Exercise {
    if (!id) {
      id = createId()
    }

    if (!name) {
      throw new Error('name is missing')
    }

    if (!type) {
      throw new Error('type is missing')
    }

    if (duration < 0) {
      throw new Error('duration cannot be negative number')
    }

    if (breakDuration < 0) {
      throw new Error('breakDuration cannot be negative number')
    }

    if (!validateId(id)) {
      throw new Error('invalid id')
    }

    if (picture && !isUrl(picture)) {
      throw new Error('picture is not valid url')
    }

    function toJson (): ExerciseJson {
      return {
        id,
        name,
        type,
        duration,
        breakDuration,
        picture,
        mobility,
        difficulty
      }
    }
    if (!hash) {
      hash = createHash(name + type)
    }

    return Object.freeze({
      id,
      hash,
      name,
      type,
      duration,
      breakDuration,
      picture,
      mobility,
      difficulty,
      toJson
    })
  }
}
