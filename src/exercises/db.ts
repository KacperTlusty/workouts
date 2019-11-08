import { Db } from 'mongodb'
import { ExerciseDb, ExerciseDbEntity } from './types'

export function makeDbConnector (db: Db): ExerciseDb {
  const collection = db.collection('exercise')

  async function create (exercise: ExerciseDbEntity): Promise<ExerciseDbEntity> {
    const result = await collection.insertOne(exercise)
    if (result.insertedCount) {
      return exercise
    }
    return null
  }

  async function findAll (): Promise<ExerciseDbEntity[]> {
    const result = await collection.find<ExerciseDbEntity>()
    return result.toArray()
  }

  async function findByHash (hash: string): Promise<ExerciseDbEntity> {
    return collection.findOne<ExerciseDbEntity>({ hash })
  }

  async function findById (id: string): Promise<ExerciseDbEntity> {
    return collection.findOne<ExerciseDbEntity>({ _id: id })
  }

  async function deleteById (id: string): Promise<boolean> {
    const result = await collection.deleteOne({ _id: id })
    return result.deletedCount > 0
  }

  return {
    create,
    findAll,
    findByHash,
    findById,
    deleteById
  }
}
