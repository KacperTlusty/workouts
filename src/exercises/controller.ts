import {
  ExerciseJson,
  MakeCreateExercise,
  ExerciseArgs
} from './types'

export function makeCreateExercise ({
  db,
  makeExercise
}: MakeCreateExercise): (MakeExerciseArgs) => Promise<ExerciseJson> {
  return async function (args: ExerciseArgs): Promise<ExerciseJson> {
    const exercise = makeExercise(args)

    const found = await db.findByHash(exercise.hash)
    if (found) {
      return makeExercise({
        ...found,
        id: found._id
      }).toJson()
    }

    const created = await db.create({
      _id: exercise.id,
      name: exercise.name,
      type: exercise.type,
      mobility: exercise.mobility,
      picture: exercise.picture,
      difficulty: exercise.difficulty,
      hash: exercise.hash,
      bodypart: exercise.bodypart
    })

    return makeExercise({
      ...created,
      id: created._id
    }).toJson()
  }
}

export function makeFindAllExercises ({
  db,
  makeExercise
}: MakeCreateExercise): () => Promise<ExerciseJson[]> {
  return async function findAll (): Promise<ExerciseJson[]> {
    const results = await db.findAll()
    return results
      .map(dbEntity => makeExercise(
        { ...dbEntity, id: dbEntity._id }
      ).toJson())
  }
}

export function makeFindById ({
  db,
  makeExercise
}: MakeCreateExercise): (string) => Promise<ExerciseJson> {
  return async function findById (id: string): Promise<ExerciseJson> {
    const dbExercise = await db.findById(id)
    if (!dbExercise) {
      return null
    }
    return makeExercise(dbExercise).toJson()
  }
}

export function makeDeleteById ({
  db,
  makeExercise
}: MakeCreateExercise): (string) => Promise<ExerciseJson> {
  return async function deleteById (id: string): Promise<ExerciseJson> {
    const foundExercise = await db.findById(id)

    if (!foundExercise) {
      return null
    }

    const exercise = makeExercise({
      ...foundExercise, id: foundExercise._id
    })

    const result = await db.deleteById(exercise.id)

    if (!result) {
      return null
    }

    return exercise.toJson()
  }
}
