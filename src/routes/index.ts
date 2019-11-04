import { Router } from 'express'
import workoutHandlers from '../workouts'

const workoutRouter = Router()

workoutRouter.get('/', (req, res) => {
  return workoutHandlers.getAll(req, res)
})

workoutRouter.post('/', (request, response) => {
  return workoutHandlers.create(request, response)
})

workoutRouter.get('/:workoutId', (request, response) => {
  return workoutHandlers.getById(request, response)
})

workoutRouter.delete('/:workoutId', (request, response) => {
  return workoutHandlers.deleteById(request, response)
})

export default workoutRouter
