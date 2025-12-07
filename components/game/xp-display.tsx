'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star, Zap, Trophy } from 'lucide-react'
import { ProgressBar } from '@/components/ui/progress-bar'
import { cn, calculateLevel, getStreakEmoji } from '@/lib/utils'

interface XPDisplayProps {
  totalXp: number
  streak: number
  compact?: boolean
}

export function XPDisplay({ totalXp, streak, compact = false }: XPDisplayProps) {
  const { level, xpInLevel, xpForNextLevel } = calculateLevel(totalXp)

  if (compact) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 text-kid-yellow" />
          <span className="font-bold text-gray-800">Nv. {level}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-5 h-5 text-kid-purple" />
          <span className="font-medium text-gray-600">{totalXp} XP</span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1">
            <span>{getStreakEmoji(streak)}</span>
            <span className="font-medium text-gray-600">{streak}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card-kid p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kid-yellow to-orange-400 flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Nivel</p>
            <p className="text-2xl font-display font-bold text-gray-800">
              {level}
            </p>
          </div>
        </div>

        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-full"
          >
            <span className="text-2xl">{getStreakEmoji(streak)}</span>
            <div>
              <p className="text-xs text-gray-500">Racha</p>
              <p className="font-bold text-orange-600">{streak} días</p>
            </div>
          </motion.div>
        )}
      </div>

      <ProgressBar
        value={xpInLevel}
        max={xpForNextLevel}
        label="Experiencia"
        color="yellow"
        size="md"
      />

      <p className="text-xs text-gray-400 mt-2 text-center">
        {xpForNextLevel - xpInLevel} XP para el siguiente nivel
      </p>
    </div>
  )
}

export function XPGainAnimation({
  amount,
  onComplete,
}: {
  amount: number
  onComplete: () => void
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.5 }}
        animate={{ opacity: 1, y: -50, scale: 1 }}
        exit={{ opacity: 0, y: -100 }}
        onAnimationComplete={onComplete}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-kid-purple to-kid-pink px-6 py-3 rounded-full shadow-xl">
          <Zap className="w-6 h-6 text-kid-yellow" />
          <span className="text-2xl font-display font-bold text-white">
            +{amount} XP
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export function LevelUpAnimation({
  newLevel,
  onComplete,
}: {
  newLevel: number
  onComplete: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl mb-4"
        >
          🎉
        </motion.div>

        <h2 className="text-3xl font-display font-bold text-gradient mb-2">
          ¡Subiste de Nivel!
        </h2>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-8 h-8 text-kid-yellow" />
          <span className="text-5xl font-display font-bold text-kid-purple">
            {newLevel}
          </span>
        </div>

        <p className="text-gray-600 mb-6">
          ¡Felicidades! Sigue aprendiendo para desbloquear más contenido.
        </p>

        <button
          onClick={onComplete}
          className="btn-primary w-full"
        >
          ¡Genial!
        </button>
      </motion.div>
    </motion.div>
  )
}
