import Express from 'express'
import evn from 'dotenv'
import WorkoutRouter from './routes'

evn.config()

const app = Express()
const port = process.env.PORT

app.get('/api/workout', WorkoutRouter)

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
