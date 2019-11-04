declare interface Workout {
  id: string;
  getExercises: () => Exercise[];
  addExercise: (Exercise) => void;
  name: string;
  userId?: string;
}

declare interface WorkoutDbEntity {
  id: string;
  exercises: string[];
  name: string;
  userId?: string;
}

declare interface Exercise {
  id: string;
  name: string;
  type: string;
  duration?: number;
  breakDuration?: number;
  difficulty?: string;
  mobility?: string;
  picture?: string;
}

declare interface User {
  email: string;
  age?: number;
  firstName?: string;
  lastName?: string;
  password?: string;
  workouts?: Workout[];
}

declare interface MakeWorkoutArgs {
  id?: string;
  name: string;
  exercises?: Exercise[];
  userId?: string;
}

declare interface WorkoutJson {
  id: string;
  name: string;
  exercises: string[];
  userId?: string;
}

declare interface WorkoutDb {
  create: (WorkoutDbEntity) => Promise<WorkoutDbEntity>;
  findById: (string) => Promise<WorkoutDbEntity>;
  findAll: () => Promise<WorkoutDbEntity[]>;
}

declare interface Db {
  create: (WorkoutDbEntity) => Promise<WorkoutDbEntity>;
  findById: (string) => Promise<WorkoutDbEntity>;
  findAll: () => Promise<WorkoutDbEntity[]>;
}
