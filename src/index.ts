import Express from 'express'
import evn from 'dotenv'
import bodyparser from 'body-parser'
import cors from 'cors'
import WorkoutRouter from './routes'

evn.config()

const app = Express()
const port = process.env.PORT

app.options('*', cors())
app.use(bodyparser.json())

app.get('/', (req, res) => res.send('dupa'))
app.use('/api/workout', WorkoutRouter)

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
