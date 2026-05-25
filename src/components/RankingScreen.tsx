import { useEffect } from 'react'
import type { Level, Score } from '../types'
import LevelBadge from './LevelBadge'

interface RankingScreenProps {
  level: Level
  nickname: string
  fromHome?: boolean
  fetchRanking: (level: Level, signal?: AbortSignal) => Promise<void>
  rankings: Score[]
  loading: boolean
  error: string | null
  onPlayAgain: () => void
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

export default function RankingScreen({
  level,
  nickname,
  fromHome,
  fetchRanking,
  rankings,
  loading,
  error,
  onPlayAgain,
}: RankingScreenProps) {
  useEffect(() => {
    const controller = new AbortController()
    void fetchRanking(level, controller.signal)
    return () => controller.abort()
  }, [level, fetchRanking])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Ranking</h2>
        <LevelBadge level={level} />
      </div>

      {loading && (
        <div className="text-center py-12 text-muted">
          <div
            className="inline-block w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin mb-3"
            aria-label="Carregando ranking"
          />
          <p className="text-sm">Carregando...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-surface border border-error rounded-xl p-4 text-center">
          <p className="text-error text-sm mb-3">{error}</p>
          <button
            onClick={() => void fetchRanking(level)}
            className="text-sm text-primary underline hover:no-underline focus:outline-none"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && rankings.length === 0 && (
        <div className="bg-surface border border-border rounded-xl p-6 text-center text-muted text-sm">
          Nenhum score registrado ainda. Seja o primeiro!
        </div>
      )}

      {!loading && !error && rankings.length > 0 && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 w-10">#</th>
                <th className="text-left px-4 py-3">Nickname</th>
                <th className="text-center px-4 py-3 w-16">Score</th>
                <th className="text-right px-4 py-3 w-20 hidden sm:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((row, index) => {
                const isCurrentUser = row.nickname === nickname
                return (
                  <tr
                    key={row.id ?? index}
                    className={`border-b border-border last:border-0 transition-colors ${
                      isCurrentUser ? 'bg-primary/10' : 'hover:bg-border/30'
                    }`}
                  >
                    <td className="px-4 py-3 text-muted font-mono">{index + 1}</td>
                    <td
                      className={`px-4 py-3 font-medium ${isCurrentUser ? 'text-primary' : 'text-text'}`}
                    >
                      {row.nickname}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-muted font-normal">(você)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-text">
                      {row.score}/{row.total}
                    </td>
                    <td className="px-4 py-3 text-right text-muted hidden sm:table-cell">
                      {formatDate(row.created_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={onPlayAgain}
        className="w-full py-3 rounded-xl bg-primary text-white font-semibold
          hover:bg-primary-hover
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          transition-all duration-200"
      >
        {fromHome ? 'Voltar' : 'Jogar Novamente'}
      </button>
    </div>
  )
}
