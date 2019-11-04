import { Request, Response } from 'express'

interface WorkoutController {
  getAll: () => Promise<WorkoutJson[]>;
  create: (MakeWorkoutArgs) => Promise<WorkoutJson>;
}

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
        userId: req.body.userId
      })
      return Promise.resolve(res.status(200).json(created))
    } catch (error) {
      return Promise.resolve(res.status(500).json({ error: error.message }))
    }
  }
}

export default {
  makeCreate,
  makeGetAll
}
