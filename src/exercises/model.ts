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
    picture = '',
    mobility = '',
    difficulty = '',
    id = '',
    bodypart = ''
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
        picture,
        mobility,
        difficulty,
        bodypart
      }
    }
    const hash = createHash(name + type)

    return Object.freeze({
      id,
      hash,
      name,
      type,
      picture,
      bodypart,
      mobility,
      difficulty,
      toJson
    })
  }
}
