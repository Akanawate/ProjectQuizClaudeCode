import { useEffect } from 'react'
import type { QuizState, Level } from '../types'
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'
import FeedbackCard from './FeedbackCard'
import LevelBadge from './LevelBadge'

interface QuizScreenProps {
  quizState: QuizState
  onAnswer: (answer: boolean) => void
  onAdvance: () => void
  level: Level
}

export default function QuizScreen({ quizState, onAnswer, onAdvance, level }: QuizScreenProps) {
  const { questions, currentIndex, answers, phase } = quizState
  const currentQuestion = questions[currentIndex]
  const lastAnswer = answers[answers.length - 1]
  const isLast = currentIndex === questions.length - 1

  useEffect(() => {
    if (phase !== 'answering') return
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'v') onAnswer(true)
      if (e.key.toLowerCase() === 'f') onAnswer(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onAnswer, phase])

  if (!currentQuestion) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="sr-only">Quiz em andamento</h2>
        <LevelBadge level={level} />
      </div>

      <ProgressBar current={currentIndex + 1} total={questions.length} />

      {phase === 'answering' && (
        <QuestionCard question={currentQuestion} onAnswer={onAnswer} />
      )}

      {phase === 'feedback' && lastAnswer && (
        <FeedbackCard
          question={currentQuestion}
          userAnswer={lastAnswer}
          isLast={isLast}
          onAdvance={onAdvance}
        />
      )}
    </div>
  )
}
