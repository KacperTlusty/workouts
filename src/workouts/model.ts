
export interface CreateMakeWorkoutArgs {
  makeId: () => string,
  validateId: (string) => boolean
}

export interface Workout {
  id: string;
  getExercises: () => Exercise[];
  addExercise: (Exercise) => void;
  name: string;
  userId?: string;
} 

export default function createMakeWorkout ({
  makeId,
  validateId
}: CreateMakeWorkoutArgs): (args: MakeWorkoutArgs) => Workout {
  return function makeWorkout ({
    name,
    id,
    exercises = []
  }: MakeWorkoutArgs): Workout {
    if (!name) {
      throw new Error('name cannot be empty')
    }

    if (!id) {
      id = makeId()
    }

    if (!validateId(id)) {
      throw new Error('Given id is invalid.')
    }

    return Object.freeze<Workout>({
      name,
      id,
      addExercise,
      getExercises
    })

    function addExercise (exercise: Exercise): void {
      if (!exercise) {
        throw new Error('Cannot add null')
      }
      exercises.push(exercise)
    }

    function getExercises (): Exercise[] {
      return exercises
    }
  }
}
