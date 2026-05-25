import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Score, Level } from '../types'

export function useRanking() {
  const [rankings, setRankings] = useState<Score[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRanking = useCallback(async (level: Level, signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('scores')
      .select('id, nickname, level, score, total, created_at')
      .eq('level', level)
      .order('score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(10)
    if (signal?.aborted) return
    setLoading(false)
    if (err) {
      setError('Não foi possível carregar o ranking. Tente novamente.')
      return
    }
    setRankings((data ?? []) as Score[])
  }, [])

  const submitScore = useCallback(async (scoreData: Omit<Score, 'id' | 'created_at' | 'time_ms'>): Promise<boolean> => {
    const { error: err } = await supabase.from('scores').insert(scoreData)
    if (err) {
      console.error('Erro ao salvar score:', err.message)
      return false
    }
    return true
  }, [])

  return { rankings, loading, error, fetchRanking, submitScore }
}
