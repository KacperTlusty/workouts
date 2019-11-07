import { UserAuth, UserDbEntity } from '../users/types'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

export interface JwtAuthController {
  findById: (id: string) => Promise<UserAuth>;
}

export interface JwtPayload {
  sub: string;
}

export interface LocalAuthController {
  login: (email: string, password: string) => Promise<UserAuth>;
}

export interface AuthDb {
  findById: (id: string) => Promise<UserDbEntity>;
  findByEmail: (email: string) => Promise<UserDbEntity>;
}

export interface AuthStratiegies {
  jwt: JwtStrategy;
  local: LocalStrategy;
}
