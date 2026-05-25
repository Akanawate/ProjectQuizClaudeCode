import type { Level } from '../types'

interface LevelBadgeProps {
  level: Level
}

const LEVEL_LABELS: Record<Level, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

const LEVEL_CLASSES: Record<Level, string> = {
  beginner: 'text-blue-400 border-blue-400',
  intermediate: 'text-yellow-400 border-yellow-400',
  advanced: 'text-primary border-primary',
}

export default function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <span
      className={`inline-block border rounded-full px-3 py-1 text-sm font-medium ${LEVEL_CLASSES[level]}`}
    >
      {LEVEL_LABELS[level]}
    </span>
  )
}
