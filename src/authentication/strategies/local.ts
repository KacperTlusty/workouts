import { Strategy, VerifyFunction, IStrategyOptions } from 'passport-local'
import { LocalAuthController } from '../types'

export function makeLocalStrategy (
  authController: LocalAuthController
): Strategy {
  const verify: VerifyFunction = async (email: string, password: string, done): Promise<void> => {
    try {
      const user = await authController.login(email, password)
      if (user) {
        done(null, user)
      }
    } catch (error) {
      done(error, false)
    }
    return done(null, false)
  }

  const opts: IStrategyOptions = {
    passReqToCallback: false,
    passwordField: 'password',
    usernameField: 'email',
    session: false
  }
  return new Strategy(opts, verify)
}
