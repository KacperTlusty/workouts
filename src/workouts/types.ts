import { Request, Response } from 'express'
import { UserAuth } from '../users/types'

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  order: number;
  duration?: number;
  breakDuration?: number;
  repetition?: number;
  weights?: number;
}

export interface WorkoutHandler {
  create: (req: Request, res: Response) => Promise<Response>;
  getAll: (req: Request, res: Response) => Promise<Response>;
  getById: (req: Request, res: Response) => Promise<Response>;
  deleteById: (req: Request, res: Response) => Promise<Response>;
}

export interface WorkoutController {
  getAll: () => Promise<WorkoutJson[]>;
  create: (args: MakeWorkoutArgs) => Promise<WorkoutJson>;
  getById: (id: string) => Promise<WorkoutJson>;
  deleteById: (id: string, user: UserAuth) => Promise<string>;
}

export interface Workout {
  id: string;
  name: string;
  userId: string;
  day: number;
  finished: boolean;
  getExercises: () => WorkoutExercise[];
  addExercise: (exercise: WorkoutExercise) => void;
  toJson: () => WorkoutJson;
}

export interface WorkoutDbEntity {
  _id: string;
  exercises: WorkoutExercise[];
  name: string;
  userId: string;
  day: number;
  finished: boolean;
}

export interface MakeWorkoutArgs {
  id?: string;
  name: string;
  exercises: WorkoutExercise[];
  userId: string;
  day: number;
  finished?: boolean;
}

export interface WorkoutJson {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  userId?: string;
  day: number;
  finished: boolean;
}
export interface WorkoutDb {
  create: (entity: WorkoutDbEntity) => Promise<WorkoutDbEntity>;
  findById: (id: string) => Promise<WorkoutDbEntity>;
  findAll: () => Promise<WorkoutDbEntity[]>;
  deleteById: (id: string) => Promise<string>;
}

export interface CreateMakeWorkoutArgs {
  makeId: () => string;
  validateId: (id: string) => boolean;
}
