export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface Question {
  id: string
  level: Level
  statement: string
  answer: boolean
  explanation: string
  tags: string[]
}

export interface UserAnswer {
  questionId: string
  userAnswer: boolean
  correct: boolean
}

export interface QuizState {
  questions: Question[]
  currentIndex: number
  answers: UserAnswer[]
  isFinished: boolean
  phase: 'answering' | 'feedback'
}

export interface Score {
  id?: string
  nickname: string
  level: Level
  score: number
  total: number
  time_ms?: number
  created_at?: string
}
