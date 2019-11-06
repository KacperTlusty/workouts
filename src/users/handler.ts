import { Request, Response } from 'express'
import { UserController, UserHandler } from './types'

export function makeUserHandler (controller: UserController): UserHandler {
  async function createUser (req: Request, res: Response): Promise<Response> {
    try {
      const user = await controller.create({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        age: req.body.age
      })
      return res.status(201).json(user)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async function getByEmail (req: Request, res: Response): Promise<Response> {
    try {
      const user = await controller.findByEmail(req.params.email)
      if (!user) {
        return res.status(404).json({
          message: 'not found'
        })
      }
      return res.status(200).json(user)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  return {
    createUser,
    getByEmail
  }
}
