import { Strategy, VerifiedCallback, ExtractJwt, VerifyCallbackWithRequest } from 'passport-jwt'
import { Request } from 'express'
import { JwtAuthController, JwtPayload } from '../types'

export function makeJwtStrategy (
  controller: JwtAuthController
): Strategy {
  const verifyFunction: VerifyCallbackWithRequest = async (req: Request, payload: JwtPayload, done: VerifiedCallback): Promise<void> => {
    try {
      const user = await controller.findById(payload.sub)
      if (user) {
        return Promise.resolve(done(null, user))
      }
    } catch (error) {
      return Promise.resolve(done(error, false))
    }
    return Promise.resolve(done(null, false, { message: 'user not found' }))
  }

  return new Strategy({
    secretOrKey: process.env.JWT_SECRET_KEY,
    jsonWebTokenOptions: {
      ignoreExpiration: false
    },
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, verifyFunction)
}
