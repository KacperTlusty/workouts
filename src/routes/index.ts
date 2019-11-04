import { Router } from 'express'
import workoutHandlers from '../workouts'

const workoutRouter = Router()

workoutRouter.get('/', (req, res) => {
  return workoutHandlers.getAll(req, res)
})

workoutRouter.post('/', (request, response) => {
  return workoutHandlers.create(request, response)
})

export default workoutRouter
