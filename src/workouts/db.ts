import { MongoClient, Db } from 'mongodb'

const client = new MongoClient(`mongodb+srv://api:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/test?retryWrites=true&w=majority`)

let db: Db

client.connect((error) => {
  console.error(error)
  db = client.db(process.env.DB_NAME)
})

export function dbClient (): WorkoutDb {
  const collection = db.collection('')

  async function create (workout: WorkoutDbEntity): Promise<WorkoutDbEntity> {
    const result = await collection.insertOne(workout)
    if (result.insertedCount) {
      return workout
    }
    return null
  }

  async function findById (id: string): Promise<WorkoutDbEntity> {
    const result = await collection.findOne<WorkoutDbEntity>({ id })
    if (!result) {
      throw new Error('not found.')
    }
    return result
  }

  async function findAll (): Promise<WorkoutDbEntity[]> {
    const result = await collection.find<WorkoutDbEntity>()
    if (!result) {
      return []
    }
    return result.toArray()
  }

  return {
    create,
    findById,
    findAll
  }
}
