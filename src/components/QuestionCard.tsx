import { useEffect, useRef } from 'react'
import type { Question } from '../types'

interface QuestionCardProps {
  question: Question
  onAnswer: (answer: boolean) => void
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const verdadeiroRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    verdadeiroRef.current?.focus()
  }, [question.id])

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
      <p className="text-lg sm:text-xl font-medium text-text leading-relaxed mb-8">
        {question.statement}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          ref={verdadeiroRef}
          onClick={() => onAnswer(true)}
          aria-label="Verdadeiro"
          className="flex-1 flex items-center justify-center gap-2 py-4 text-lg font-semibold rounded-xl
            border border-success text-success
            hover:bg-success hover:text-white
            focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 focus:ring-offset-surface
            transition-all duration-200"
        >
          <span aria-hidden>✓</span>
          Verdadeiro
        </button>

        <button
          onClick={() => onAnswer(false)}
          aria-label="Falso"
          className="flex-1 flex items-center justify-center gap-2 py-4 text-lg font-semibold rounded-xl
            border border-error text-error
            hover:bg-error hover:text-white
            focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-surface
            transition-all duration-200"
        >
          <span aria-hidden>✗</span>
          Falso
        </button>
      </div>

      <p className="text-xs text-muted mt-4 text-center">
        Tecla <kbd className="bg-border px-1 rounded">V</kbd> = Verdadeiro &nbsp;·&nbsp;
        Tecla <kbd className="bg-border px-1 rounded">F</kbd> = Falso
      </p>
    </div>
  )
}
