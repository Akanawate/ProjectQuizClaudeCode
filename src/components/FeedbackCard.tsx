import { useEffect, useRef } from 'react'
import type { Question, UserAnswer } from '../types'

interface FeedbackCardProps {
  question: Question
  userAnswer: UserAnswer
  isLast: boolean
  onAdvance: () => void
}

export default function FeedbackCard({ question, userAnswer, isLast, onAdvance }: FeedbackCardProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault()
        onAdvance()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onAdvance])

  const { correct } = userAnswer

  return (
    <div className={`rounded-2xl border-2 p-6 sm:p-8 ${correct ? 'border-success bg-success/5' : 'border-error bg-error/5'}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-2xl font-bold ${correct ? 'text-success' : 'text-error'}`}>
          {correct ? '✓ Correto!' : '✗ Incorreto'}
        </span>
      </div>

      <p className="text-sm text-muted mb-1">Afirmação</p>
      <p className="text-base text-text leading-relaxed mb-5">{question.statement}</p>

      <div className="flex gap-6 mb-5 text-sm">
        <div>
          <span className="text-muted">Sua resposta: </span>
          <span className={`font-semibold ${correct ? 'text-success' : 'text-error'}`}>
            {userAnswer.userAnswer ? 'Verdadeiro' : 'Falso'}
          </span>
        </div>
        <div>
          <span className="text-muted">Resposta correta: </span>
          <span className="font-semibold text-text">
            {question.answer ? 'Verdadeiro' : 'Falso'}
          </span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 mb-6 text-sm text-muted leading-relaxed">
        {question.explanation}
      </div>

      <button
        ref={buttonRef}
        onClick={onAdvance}
        className="w-full py-3 rounded-xl bg-primary text-white font-semibold
          hover:bg-primary-hover
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          transition-all duration-200"
      >
        {isLast ? 'Ver Resultado →' : 'Próxima Pergunta →'}
      </button>

      <p className="text-xs text-muted mt-3 text-center">
        Tecla <kbd className="bg-border px-1 rounded">Enter</kbd> ou <kbd className="bg-border px-1 rounded">→</kbd> para continuar
      </p>
    </div>
  )
}
