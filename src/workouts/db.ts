import { MongoClient, Db } from 'mongodb'
import env from 'dotenv'

env.config()

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME
} = process.env

const uri = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}/test?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let db: Db

client.connect((error) => {
  if (process.env.NODE_ENV !== 'test' && error) {
    console.error(error)
  }
  db = client.db(DB_NAME)
})

export function dbClient (): WorkoutDb {
  if (!client.isConnected()) {
    client.connect()
  }
  const getCollection = () => {
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
    return getCollection().findOne<WorkoutDbEntity>({ id })
  }

  async function findAll (): Promise<WorkoutDbEntity[]> {
    const result = await getCollection().find<WorkoutDbEntity>()
    if (!result) {
      return []
    }
    return result.toArray()
  }

  async function deleteById (id: string): Promise<string> {
    const { result, deletedCount } = await getCollection().deleteOne({ id })
    if (!result.ok || deletedCount === 0) {
      return 'Not found.'
    }
    return 'Object removed'
  }

  return {
    create,
    findById,
    findAll,
    deleteById,
  }
}
