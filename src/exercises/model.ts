export interface MakeExerciseModel {
  createId: () => string;
  validateId: (string) => boolean;
}

export interface ExerciseArgs {
  id?: string;
  name: string;
  type: string;
  duration?: number;
  breakDuration?: number;
  difficulty?: string;
  mobility?: string;
  picture?: string;
}

export default function makeModel ({
  createId,
  validateId
}: MakeExerciseModel): (ExerciseArgs) => Exercise {
  return function (args: ExerciseArgs): Exercise {
    if (!args.name) {
      throw new Error('name is missing')
    }

    if (!args.type) {
      throw new Error('type is missing')
    }

    if (args.duration && args.duration < 0) {
      throw new Error('duration cannot be negative number')
    }
    return null
  }
}
