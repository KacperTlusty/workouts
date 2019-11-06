import { Db, Collection } from 'mongodb'
import { UserDb, UserDbEntity } from './types'

const COLLECTION_NAME = 'users'

export function makeUserDbConnector (db: Db): UserDb {
  const getCollection = (): Collection<UserDbEntity> => db.collection(COLLECTION_NAME)

  async function findByEmail (email: string): Promise<UserDbEntity> {
    return getCollection().findOne<UserDbEntity>({ email })
  }

  async function insertOne (user: UserDbEntity): Promise<UserDbEntity> {
    const result = await getCollection().insertOne(user)

    if (result.insertedCount === 1) {
      return user
    }
    return null
  }

  return {
    findByEmail,
    insertOne
  }
}
