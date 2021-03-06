import { Request, Response } from 'express'
import { UserAuth } from '../users/types'

export interface Exercise {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  mobility: string;
  picture: string;
  bodypart: string;
  toJson: () => ExerciseJson;
  hash: string;
}

export interface MakeExerciseModel {
  createHash: (string) => string;
  createId: () => string;
  isUrl: (string) => boolean;
  validateId: (string) => boolean;
}

export interface ExerciseArgs {
  id?: string;
  name: string;
  type: string;
  difficulty?: string;
  mobility?: string;
  picture?: string;
  bodypart?: string;
}

export interface ExerciseController {
  getAll: () => Promise<ExerciseJson[]>;
  create: (args: ExerciseArgs) => Promise<ExerciseJson>;
  getById: (id: string) => Promise<ExerciseJson>;
  deleteById: (id: string, user: UserAuth) => Promise<ExerciseJson>;
}

export interface ExerciseHandler {
  getAll: (req: Request, res: Response) => Promise<Response>;
  createOne: (req: Request, res: Response) => Promise<Response>;
  getById: (req: Request, res: Response) => Promise<Response>;
  deleteById: (req: Request, res: Response) => Promise<Response | void>;
}

export interface ExerciseJson {
  id: string;
  name: string;
  type: string;
  picture: string;
  difficulty: string;
  mobility: string;
  bodypart: string;
}

export interface ExerciseDbEntity {
  _id: string;
  name: string;
  type: string;
  picture: string;
  difficulty: string;
  mobility: string;
  hash: string;
  bodypart: string;
}

export interface MakeCreateExercise {
  db: ExerciseDb;
  makeExercise: (ExerciseArgs) => Exercise;
}

export interface ExerciseDb {
  create: (ExerciseDbEntity) => Promise<ExerciseDbEntity>;
  findByHash: (string) => Promise<ExerciseDbEntity>;
  findAll: () => Promise<ExerciseDbEntity[]>;
  findById: (string) => Promise<ExerciseDbEntity>;
  deleteById: (string) => Promise<boolean>;
}
