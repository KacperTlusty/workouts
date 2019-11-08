import { MongoClient, Collection } from 'mongodb'
import { WorkoutDb, WorkoutDbEntity } from './types'

export function dbClient (client: MongoClient): WorkoutDb {
  if (!client.isConnected()) {
    client.connect()
  }
  const db = client.db('workouts')

  const getCollection: () => Collection<WorkoutDbEntity> = () => {
    return db.collection('workout')
  }

  async function create (workout: WorkoutDbEntity): Promise<WorkoutDbEntity> {
    const result = await getCollection().insertOne(workout)
    if (result.insertedCount) {
      return workout
    }
    return null
  }

  async function findById (id: string): Promise<WorkoutDbEntity> {
    return getCollection().findOne<WorkoutDbEntity>({ _id: id })
  }

  async function findAll (): Promise<WorkoutDbEntity[]> {
    const result = await getCollection().find<WorkoutDbEntity>()
    if (!result) {
      return []
    }
    return result.toArray()
  }

  async function deleteById (id: string): Promise<string> {
    const { result, deletedCount } = await getCollection().deleteOne({ _id: id })
    if (!result.ok || deletedCount === 0) {
      return 'Not found.'
    }
    return 'Object removed'
  }

  return {
    create,
    findById,
    findAll,
    deleteById
  }
}
