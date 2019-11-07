import { LocalAuthController, JwtAuthController, AuthDb } from './types'
import { UserAuth, User, CreateUserArgs } from '../users/types'

export function makeAuthController (
  db: AuthDb,
  makeUser: (args: CreateUserArgs) => User
): LocalAuthController & JwtAuthController {
  async function findById (id: string): Promise<UserAuth> {
    const foundUser = await db.findById(id)
    if (foundUser) {
      const user = makeUser({
        ...foundUser,
        id: foundUser._id
      })
      return {
        id: user.id,
        email: user.email
      }
    }
    return null
  }

  async function login (email: string, password: string): Promise<UserAuth> {
    const foundUser = await db.findByEmail(email)
    if (!foundUser) {
      return null
    }

    const user = makeUser({
      id: foundUser._id,
      email,
      password,
      age: foundUser.age
    })
    if (user.password === foundUser.password) {
      return {
        id: foundUser._id,
        email
      }
    }
    return null
  }

  return {
    findById,
    login
  }
}
