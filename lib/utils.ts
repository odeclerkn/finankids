import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-MX').format(num)
}

export function calculateLevel(totalXp: number): { level: number; xpInLevel: number; xpForNextLevel: number } {
  let level = 1
  let xpRemaining = totalXp

  const xpForLevel = (lvl: number) => 100 + (lvl - 1) * 50

  while (xpRemaining >= xpForLevel(level)) {
    xpRemaining -= xpForLevel(level)
    level++
  }

  return {
    level,
    xpInLevel: xpRemaining,
    xpForNextLevel: xpForLevel(level),
  }
}

export function getAvatarEmoji(avatarId: string): string {
  const avatars: Record<string, string> = {
    pig: '🐷',
    cat: '🐱',
    dog: '🐶',
    rabbit: '🐰',
    bear: '🐻',
    panda: '🐼',
    fox: '🦊',
    lion: '🦁',
    unicorn: '🦄',
    robot: '🤖',
    astronaut: '👨‍🚀',
    superhero: '🦸',
    parent_default: '👤',
  }
  return avatars[avatarId] ?? '🐷'
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🔥'
  if (streak >= 14) return '⚡'
  if (streak >= 7) return '✨'
  if (streak >= 3) return '🌟'
  return '⭐'
}

export function getDifficultyColor(difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
  const colors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  }
  return colors[difficulty]
}

export function getDifficultyLabel(difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
  const labels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  }
  return labels[difficulty]
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  const intervals = [
    { label: 'año', seconds: 31536000 },
    { label: 'mes', seconds: 2592000 },
    { label: 'día', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `hace ${count} ${interval.label}${count > 1 ? 's' : ''}`
    }
  }

  return 'hace un momento'
}
