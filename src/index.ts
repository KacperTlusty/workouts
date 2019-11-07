import Express from 'express'
import bodyparser from 'body-parser'
import cors from 'cors'
import env from 'dotenv'
import { MongoClient } from 'mongodb'
import passport from 'passport'
import { makeExerciseRouter, makeWorkoutRouter } from './routes'
import { makeAuthStrategies } from './authentication'
import { createUser } from './users'
import { makeUsersRouter } from './routes/users'

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
  const authStrategies = makeAuthStrategies(client.db('workouts'), createUser)

  passport.use(authStrategies.jwt)
  passport.use(authStrategies.local)

  app.use(cors())
  app.use(bodyparser.json())

  app.get('/', (req, res) => res.send('dupa'))
  app.post('/api/login', passport.authenticate('local'))
  app.use('/api/exercise',
    passport.authenticate('jwt'),
    makeExerciseRouter(client))
  app.use('/api/workout',
    passport.authenticate('jwt'),
    makeWorkoutRouter(client))
  app.use('/api/users', makeUsersRouter(client, passport))

  app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
  })
})
