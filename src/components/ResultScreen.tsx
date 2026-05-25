import { useEffect, useRef, useState } from 'react'
import type { Question, UserAnswer, Level, Score } from '../types'
import LevelBadge from './LevelBadge'
import QuestionReview from './QuestionReview'

interface ResultScreenProps {
  questions: Question[]
  answers: UserAnswer[]
  score: number
  total: number
  nickname: string
  level: Level
  submitScore: (data: Omit<Score, 'id' | 'created_at' | 'time_ms'>) => Promise<boolean>
  onViewRanking: () => void
  onPlayAgain: () => void
}

function getBadge(score: number): { name: string; description: string } {
  if (score <= 3) return { name: 'Explorador', description: 'Você ainda está descobrindo o Claude Code' }
  if (score <= 6) return { name: 'Praticante', description: 'Bom começo! Tem bastante chão pela frente.' }
  if (score <= 8) return { name: 'Especialista', description: 'Você domina bem o Claude Code!' }
  return { name: 'Claude Expert', description: 'Impressionante! Você é um mestre do Claude Code.' }
}

export default function ResultScreen({
  questions,
  answers,
  score,
  total,
  nickname,
  level,
  submitScore,
  onViewRanking,
  onPlayAgain,
}: ResultScreenProps) {
  const submitted = useRef(false)
  const [submitError, setSubmitError] = useState(false)
  const badge = getBadge(score)

  useEffect(() => {
    if (!submitted.current) {
      submitted.current = true
      void submitScore({ nickname, level, score, total }).then(ok => {
        if (!ok) setSubmitError(true)
      })
    }
  }, [nickname, level, score, total, submitScore])

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center bg-surface border border-border rounded-2xl p-6 sm:p-8">
        <h2 className="text-5xl font-bold text-text mb-1">
          {score}
          <span className="text-2xl text-muted">/{total}</span>
        </h2>
        <p className="text-muted text-sm mb-4">acertos</p>

        <div className="mb-2">
          <span className="text-xl font-semibold text-primary">{badge.name}</span>
        </div>
        <p className="text-muted text-sm mb-4">{badge.description}</p>

        <LevelBadge level={level} />
      </div>

      {submitError && (
        <div className="bg-surface border border-error rounded-xl px-4 py-3 text-error text-sm text-center">
          Não foi possível salvar seu score. Seu resultado não aparecerá no ranking.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onViewRanking}
          className="flex-1 py-3 rounded-xl border border-primary text-primary font-semibold
            hover:bg-primary hover:text-white
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
            transition-all duration-200"
        >
          Ver Ranking
        </button>
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 rounded-xl bg-surface border border-border text-text font-semibold
            hover:border-muted
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
            transition-all duration-200"
        >
          Jogar Novamente
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Revisão das Perguntas
        </h3>
        <div className="flex flex-col gap-3">
          {questions.map((question, index) => {
            const userAnswer = answers[index]
            if (!userAnswer) return null
            return (
              <QuestionReview
                key={question.id}
                question={question}
                userAnswer={userAnswer}
                index={index}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
