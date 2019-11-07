import { Strategy, VerifyFunctionWithRequest, IStrategyOptionsWithRequest } from 'passport-local'
import { Request } from 'express'
import { LocalAuthController } from '../types'

export function makeLocalStrategy (
  authController: LocalAuthController
): Strategy {
  const verify: VerifyFunctionWithRequest = async (req: Request, email: string, password: string, done): Promise<void> => {
    try {
      const user = await authController.login(email, password)
      if (user) {
        done(null, user)
      }
    } catch (error) {
      done(error, null)
    }
    return done(null, false)
  }

  const opts: IStrategyOptionsWithRequest = {
    passReqToCallback: true,
    passwordField: 'password',
    usernameField: 'user'
  }

  return new Strategy(opts, verify)
}
