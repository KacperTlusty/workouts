import { Request, Response } from 'express'
import {
  ExerciseController,
  ExerciseHandler,
  ExerciseJson
} from './types'

export function makeExerciseHandlers ({
  deleteById,
  getAll,
  getById,
  create
}: ExerciseController): ExerciseHandler {
  async function getAllHandler (req: Request, res: Response): Promise<Response> {
    try {
      const exercises = await getAll()
      return res.status(200).json(exercises)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async function createOneHandler (req: Request, res: Response): Promise<Response> {
    try {
      const exercise: ExerciseJson = await create({
        name: req.body.name,
        type: req.body.type,
        difficulty: req.body.difficulty,
        mobility: req.body.mobility,
        picture: req.body.picture,
        bodypart: req.body.bodypart
      })
      return res.status(201).json(exercise)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async function getByIdHandler (req: Request, res: Response): Promise<Response> {
    try {
      const exercise = await getById(req.params.exerciseId)

      if (!exercise) {
        return res.status(404).json('Not found.')
      }

      return res.status(200).json(exercise)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async function deleteByIdHandler (req: Request, res: Response): Promise<Response | void> {
    try {
      const deleted = await deleteById(req.params.exerciseId)
      if (deleted) {
        return res.status(204).end()
      }
      throw new Error('not found')
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  return {
    getAll: getAllHandler,
    createOne: createOneHandler,
    getById: getByIdHandler,
    deleteById: deleteByIdHandler
  }
}
