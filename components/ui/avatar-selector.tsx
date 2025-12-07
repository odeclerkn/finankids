'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const AVATARS = [
  { id: 'pig', emoji: '🐷', name: 'Cerdito' },
  { id: 'cat', emoji: '🐱', name: 'Gatito' },
  { id: 'dog', emoji: '🐶', name: 'Perrito' },
  { id: 'rabbit', emoji: '🐰', name: 'Conejito' },
  { id: 'bear', emoji: '🐻', name: 'Osito' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'fox', emoji: '🦊', name: 'Zorrito' },
  { id: 'lion', emoji: '🦁', name: 'Leoncito' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicornio' },
  { id: 'robot', emoji: '🤖', name: 'Robot' },
  { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronauta' },
  { id: 'superhero', emoji: '🦸', name: 'Superhéroe' },
]

interface AvatarSelectorProps {
  selected: string
  onSelect: (avatarId: string) => void
}

export function AvatarSelector({ selected, onSelect }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
      {AVATARS.map((avatar) => (
        <motion.button
          key={avatar.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(avatar.id)}
          className={cn(
            'flex flex-col items-center p-3 rounded-2xl transition-all',
            selected === avatar.id
              ? 'bg-gradient-to-br from-kid-purple to-kid-pink ring-4 ring-kid-yellow'
              : 'bg-white hover:bg-gray-50 border-2 border-gray-200'
          )}
        >
          <span className="text-4xl mb-1">{avatar.emoji}</span>
          <span className={cn(
            'text-xs font-medium',
            selected === avatar.id ? 'text-white' : 'text-gray-600'
          )}>
            {avatar.name}
          </span>
        </motion.button>
      ))}
    </div>
  )
}

export function Avatar({
  avatarId,
  size = 'md',
  showBorder = true,
}: {
  avatarId: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showBorder?: boolean
}) {
  const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0]

  const sizeClasses = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-20 h-20 text-5xl',
    xl: 'w-28 h-28 text-6xl',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-kid-purple/20 to-kid-pink/20',
        sizeClasses[size],
        showBorder && 'border-4 border-white shadow-lg'
      )}
    >
      {avatar.emoji}
    </div>
  )
}

export { AVATARS }
