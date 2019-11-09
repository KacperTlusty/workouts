import {
  CreateUserArgs,
  UserController,
  UserJson,
  UserDb,
  User,
  UserDbEntity
} from './types'

function dbToArg (userDb: UserDbEntity): CreateUserArgs {
  return {
    id: userDb._id,
    firstName: userDb.firstName,
    lastName: userDb.lastName,
    email: userDb.email,
    age: userDb.age,
    privilage: userDb.privilage
  }
}

function userToDbEntity (user: User): UserDbEntity {
  return {
    _id: user.id,
    email: user.email,
    privilage: user.privilage,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age
  }
}

export function makeUserController (
  db: UserDb,
  makeUser: (arg: CreateUserArgs) => User
): UserController {
  async function createUser (args: CreateUserArgs): Promise<UserJson> {
    const user = makeUser(args)

    const foundUser = await db.findByEmail(user.email)
    if (foundUser) {
      return makeUser(dbToArg(foundUser)).toJson()
    }

    await db.insertOne(userToDbEntity(user))

    return user.toJson()
  }

  async function findByEmail (email: string): Promise<UserJson> {
    const user = await db.findByEmail(email)
    if (!user) {
      return null
    }

    return makeUser(dbToArg(user)).toJson()
  }

  return {
    create: createUser,
    findByEmail
  }
}
