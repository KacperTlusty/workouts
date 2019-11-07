import { Collection } from 'mongodb'
import { AuthDb } from './types'
import { UserDbEntity } from '../users/types'

export function makeAuthDb (collection: Collection<UserDbEntity>): AuthDb {
  async function findById (id: string): Promise<UserDbEntity> {
    return collection.findOne({ id })
  }

  async function findByEmail (email: string): Promise<UserDbEntity> {
    return collection.findOne({ email })
  }

  return {
    findById,
    findByEmail
  }
}
