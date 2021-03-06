import { Request, Response } from 'express'
import { WorkoutController, WorkoutHandler } from './types'

export function makeGetAll ({
  getAll
}: WorkoutController): (Request, Response) => Promise<Response> {
  return async function getAllWorkouts (_: Request, response: Response): Promise<Response> {
    try {
      const workouts = await getAll()
      return response.status(200).json(workouts)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}

export function makeCreate ({
  create
}: WorkoutController): (Request, Response) => Promise<Response> {
  return async function createWorkout (req: Request, res: Response): Promise<Response> {
    try {
      const created = await create({
        name: req.body.name,
        userId: req.user.id,
        exercises: req.body.exercises,
        day: req.body.day,
        finished: req.body.finished
      })
      return Promise.resolve(res.status(201).json(created))
    } catch (error) {
      return Promise.resolve(res.status(400).json({ error: error.message }))
    }
  }
}

export function makeGetById ({
  getById
}: WorkoutController): (Request, Response) => Promise<Response> {
  return async function getWorkoutById (req: Request, res: Response): Promise<Response> {
    try {
      const result = await getById(req.params.workoutId)
      if (!result) {
        return res.status(404).json({})
      }
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export function makeDeleteById ({
  deleteById
}: WorkoutController): (Request, Response) => Promise<Response> {
  return async function deleteWorkoutById (req: Request, res: Response): Promise<Response> {
    try {
      const result = await deleteById(req.params.workoutId, req.user)
      if (!result) {
        return res.status(404).json('Not Found')
      }
      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export function makeHandlers (controller: WorkoutController): WorkoutHandler {
  return {
    create: makeCreate(controller),
    deleteById: makeDeleteById(controller),
    getAll: makeGetAll(controller),
    getById: makeGetById(controller)
  }
}

export default {
  makeCreate,
  makeGetAll,
  makeGetById,
  makeDeleteById
}
