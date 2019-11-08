import { Request, Response } from 'express'
import { UserAuth } from '../users/types'

interface AuthHandler {
  returnJwt: (req: Request, res: Response) => Response;
}

export function makeAuthHandlers (
  createJwt: (user: UserAuth) => string
): AuthHandler {
  function returnJwt (req: Request, res: Response): Response {
    return res.status(200).json({
      token: createJwt(req.user)
    })
  }
  return {
    returnJwt
  }
}
