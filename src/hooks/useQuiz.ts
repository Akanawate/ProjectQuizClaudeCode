import { useState, useCallback } from 'react'
import type { Question, QuizState, UserAnswer, Level } from '../types'
import questionsData from '../data/questions.json'

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const QUESTIONS_PER_SESSION = 10

export function useQuiz() {
  const [state, setState] = useState<QuizState | null>(null)

  const startQuiz = useCallback((level: Level) => {
    const pool = (questionsData as Question[]).filter(q => q.level === level)
    if (import.meta.env.DEV && pool.length < QUESTIONS_PER_SESSION) {
      console.warn(`Nível "${level}" tem apenas ${pool.length} questões (mínimo esperado: ${QUESTIONS_PER_SESSION}).`)
    }
    const shuffled = fisherYatesShuffle(pool).slice(0, QUESTIONS_PER_SESSION)
    setState({
      questions: shuffled,
      currentIndex: 0,
      answers: [],
      isFinished: false,
      phase: 'answering',
    })
  }, [])

  const answerQuestion = useCallback((userAnswer: boolean) => {
    setState(prev => {
      if (!prev || prev.isFinished || prev.phase !== 'answering') return prev
      const question = prev.questions[prev.currentIndex]
      const correct = userAnswer === question.answer
      const newAnswer: UserAnswer = { questionId: question.id, userAnswer, correct }
      return {
        ...prev,
        answers: [...prev.answers, newAnswer],
        phase: 'feedback',
      }
    })
  }, [])

  const advanceQuestion = useCallback(() => {
    setState(prev => {
      if (!prev || prev.phase !== 'feedback') return prev
      const nextIndex = prev.currentIndex + 1
      const isFinished = nextIndex >= prev.questions.length
      return {
        ...prev,
        currentIndex: isFinished ? prev.currentIndex : nextIndex,
        isFinished,
        phase: 'answering',
      }
    })
  }, [])

  const resetQuiz = useCallback(() => {
    setState(null)
  }, [])

  const score = state?.answers.filter(a => a.correct).length ?? 0

  return { state, startQuiz, answerQuestion, advanceQuestion, resetQuiz, score }
}
