export interface ExerciseOption {
  id: string
  name: string
  muscleGroup?: string
  isCustom: boolean
}

export interface RoutineExercise {
  exerciseId: string
  exerciseName: string
  targetSets: number
  targetReps: number
  targetRestSeconds: number
  order: number
}

export interface Routine {
  id: string
  name: string
  exercises: RoutineExercise[]
  createdAt: number
  updatedAt: number
}

export type RoutineInput = Pick<Routine, 'name' | 'exercises'>

export interface SessionSet {
  setNumber: number
  weight: number
  reps: number
  restSeconds: number
  completedAt: number
}

export interface SessionExercise {
  exerciseId: string
  exerciseName: string
  order: number
  sets: SessionSet[]
}

export interface Session {
  id: string
  startedAt: number
  endedAt: number | null
  routineId?: string
  routineName?: string
  notes?: string
  exercises: SessionExercise[]
}

export interface CustomExercise {
  id: string
  name: string
  muscleGroup?: string
  createdAt: number
}
