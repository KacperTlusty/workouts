import Express from 'express'
import bodyparser from 'body-parser'
import cors from 'cors'
import { makeExerciseRouter, makeWorkoutRouter } from './routes'
import env from 'dotenv'
import { MongoClient } from 'mongodb'

env.config()

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST
} = process.env

const uri = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}/test?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

client.connect((error) => {
  if (process.env.NODE_ENV !== 'test' && error) {
    console.error(error)
    return
  }
  const app = Express()
  const port = process.env.PORT

  app.use(cors())
  app.use(bodyparser.json())

  app.get('/', (req, res) => res.send('dupa'))
  app.use('/api/exercise', makeExerciseRouter(client))
  app.use('/api/workout', makeWorkoutRouter(client))
  app.use('/api/users', makeWorkoutRouter(client))

  app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
  })
})
