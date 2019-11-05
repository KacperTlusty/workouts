import { Request, Response } from 'express'
import { Exercise } from '../exercises/types'

export interface WorkoutHandler {
  create: (req: Request, res: Response) => Promise<Response>;
  getAll: (req: Request, res: Response) => Promise<Response>;
  getById: (req: Request, res: Response) => Promise<Response>;
  deleteById: (req: Request, res: Response) => Promise<Response>;
}

export interface WorkoutController {
  getAll: () => Promise<WorkoutJson[]>;
  create: (MakeWorkoutArgs) => Promise<WorkoutJson>;
  getById: (id: string) => Promise<WorkoutJson>;
  deleteById: (id: string) => Promise<string>;
}

export interface Workout {
  id: string;
  getExercises: () => Exercise[];
  addExercise: (Exercise) => void;
  name: string;
  userId?: string;
}

export interface WorkoutDbEntity {
  _id: string;
  exercises: string[];
  name: string;
  userId?: string;
}

export interface User {
  email: string;
  age?: number;
  firstName?: string;
  lastName?: string;
  password?: string;
  workouts?: Workout[];
}

export interface MakeWorkoutArgs {
  id?: string;
  name: string;
  exercises?: Exercise[];
  userId?: string;
}

export interface WorkoutJson {
  id: string;
  name: string;
  exercises: string[];
  userId?: string;
}
export interface WorkoutDb {
  create: (WorkoutDbEntity) => Promise<WorkoutDbEntity>;
  findById: (string) => Promise<WorkoutDbEntity>;
  findAll: () => Promise<WorkoutDbEntity[]>;
  deleteById: (string) => Promise<string>;
}

export interface CreateMakeWorkoutArgs {
  makeId: () => string;
  validateId: (string) => boolean;
}
