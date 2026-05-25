import { useState } from 'react'
import type { Question, UserAnswer } from '../types'

interface QuestionReviewProps {
  question: Question
  userAnswer: UserAnswer
  index: number
}

export default function QuestionReview({ question, userAnswer, index }: QuestionReviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { correct } = userAnswer

  return (
    <div
      className={`border-l-4 rounded-r-xl bg-surface p-4 ${
        correct ? 'border-success' : 'border-error'
      }`}
    >
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary rounded"
      >
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex-shrink-0 text-lg ${correct ? 'text-success' : 'text-error'}`}
            aria-hidden
          >
            {correct ? '✓' : '✗'}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-xs text-muted block mb-1">Pergunta {index + 1}</span>
            <p className="text-sm text-text leading-relaxed">{question.statement}</p>
            <div className="flex gap-4 mt-2 text-xs text-muted">
              <span>
                Sua resposta:{' '}
                <strong className={correct ? 'text-success' : 'text-error'}>
                  {userAnswer.userAnswer ? 'Verdadeiro' : 'Falso'}
                </strong>
              </span>
              <span>
                Resposta correta:{' '}
                <strong className="text-text">
                  {question.answer ? 'Verdadeiro' : 'Falso'}
                </strong>
              </span>
            </div>
          </div>
          <span className="text-muted text-sm flex-shrink-0" aria-hidden>
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 ml-8 text-sm text-muted leading-relaxed border-t border-border pt-3">
          {question.explanation}
        </div>
      )}
    </div>
  )
}
