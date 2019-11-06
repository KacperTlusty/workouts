import { Request, Response } from 'express'

export interface MakeCreateUserArgs {
  validateId: (id: string) => boolean;
  hashPassword: (password: string) => string;
  validateEmail?: (email: string) => boolean;
  createId: () => string;
}

export interface User {
  email: string;
  age: number;
  id: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  toJson: () => UserJson;
}

export interface CreateUserArgs {
  email: string;
  age: number;
  firstName?: string;
  lastName?: string;
  password?: string;
  id?: string;
}

export interface UserController {
  create: (args: CreateUserArgs) => Promise<UserJson>;
  findByEmail: (email: string) => Promise<UserJson>;
}

export interface UserJson {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  id: string;
}

export interface UserDb {
  insertOne: (args: UserDbEntity) => Promise<UserDbEntity>;
  findByEmail: (email: string) => Promise<UserDbEntity>;
}

export interface UserDbEntity {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  age: number;
}

export interface UserHandler {
  createUser: (req: Request, res: Response) => Promise<Response>;
  getByEmail: (req: Request, res: Response) => Promise<Response>;
}
