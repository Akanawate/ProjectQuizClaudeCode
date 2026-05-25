import { useState } from 'react'
import type { Level } from '../types'
import LevelBadge from './LevelBadge'

interface HomeScreenProps {
  onStart: (nickname: string, level: Level) => void
  onBrowseRanking: (level: Level) => void
}

const LEVELS: { value: Level; title: string; description: string }[] = [
  {
    value: 'beginner',
    title: 'Iniciante',
    description: 'Conceitos, proposta de valor, instalação e casos de uso gerais',
  },
  {
    value: 'intermediate',
    title: 'Intermediário',
    description: 'CLAUDE.md, slash commands, hooks, MCP e permissões',
  },
  {
    value: 'advanced',
    title: 'Avançado',
    description: 'SDK, API Anthropic, modelos, caching e agent loops',
  },
]

export default function HomeScreen({ onStart, onBrowseRanking }: HomeScreenProps) {
  const [nickname, setNickname] = useState('')
  const [level, setLevel] = useState<Level | null>(null)

  const canStart = nickname.trim().length >= 2 && level !== null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canStart && level) {
      onStart(nickname.trim(), level)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🤖</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">
          Você Entende o Claude Code?
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-md mx-auto">
          Teste seu conhecimento com 10 perguntas Verdadeiro ou Falso sobre Claude Code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-text mb-2">
            Seu nickname
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Ex: dev_fulano"
            maxLength={32}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text
              placeholder:text-muted
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-colors"
          />
          {nickname.length > 0 && nickname.trim().length < 2 && (
            <p className="text-error text-xs mt-1">Mínimo de 2 caracteres.</p>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-text mb-3">Escolha o nível</p>
          <div className="flex flex-col gap-3">
            {LEVELS.map(lvl => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => setLevel(lvl.value)}
                aria-pressed={level === lvl.value}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
                  ${
                    level === lvl.value
                      ? 'border-primary bg-surface ring-2 ring-primary'
                      : 'border-border bg-surface hover:border-muted'
                  }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <LevelBadge level={lvl.value} />
                </div>
                <p className="text-sm text-muted mt-2">{lvl.description}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canStart}
          className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
            ${
              canStart
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-surface text-muted border border-border opacity-50 cursor-not-allowed'
            }`}
        >
          Iniciar Quiz
        </button>
      </form>

      <div className="w-full max-w-md mt-6">
        <p className="text-xs text-muted text-center mb-3 uppercase tracking-wide">Ver ranking</p>
        <div className="flex gap-2">
          {LEVELS.map(lvl => (
            <button
              key={lvl.value}
              type="button"
              onClick={() => onBrowseRanking(lvl.value)}
              className="flex-1 py-2 rounded-xl border border-border text-muted text-sm
                hover:border-primary hover:text-primary
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
                transition-all duration-200"
            >
              {lvl.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
