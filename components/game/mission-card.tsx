'use client'

import { motion } from 'framer-motion'
import { Clock, Zap, CheckCircle, Target } from 'lucide-react'
import { ProgressBar } from '@/components/ui/progress-bar'
import { cn } from '@/lib/utils'

interface Mission {
  _id: string
  type: string
  title: string
  description: string
  xpReward: number
  status: 'pending' | 'in_progress' | 'completed' | 'expired'
  progress: number
  expiresAt: number
}

interface MissionCardProps {
  mission: Mission
  onStart?: () => void
  onClaim?: () => void
}

const typeIcons: Record<string, string> = {
  learning: '📚',
  quiz: '🧠',
  simulation: '🎮',
  chat: '💬',
  saving: '🐷',
}

const typeColors: Record<string, string> = {
  learning: 'from-blue-400 to-blue-600',
  quiz: 'from-purple-400 to-purple-600',
  simulation: 'from-green-400 to-green-600',
  chat: 'from-pink-400 to-pink-600',
  saving: 'from-yellow-400 to-orange-500',
}

export function MissionCard({ mission, onStart, onClaim }: MissionCardProps) {
  const timeLeft = mission.expiresAt - Date.now()
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)))
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)))

  const isCompleted = mission.status === 'completed'
  const isExpired = mission.status === 'expired' || timeLeft <= 0

  return (
    <motion.div
      whileHover={{ scale: isExpired ? 1 : 1.02 }}
      className={cn(
        'card-kid p-4 relative overflow-hidden',
        isExpired && 'opacity-50',
        isCompleted && 'bg-green-50'
      )}
    >
      {/* Background decoration */}
      <div
        className={cn(
          'absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-20 bg-gradient-to-br',
          typeColors[mission.type] ?? typeColors.learning
        )}
      />

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br',
            typeColors[mission.type] ?? typeColors.learning
          )}
        >
          {isCompleted ? '✅' : typeIcons[mission.type] ?? '📋'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-gray-800 truncate">
            {mission.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {mission.description}
          </p>

          {/* Progress */}
          {mission.status === 'in_progress' && (
            <div className="mt-2">
              <ProgressBar
                value={mission.progress}
                max={100}
                showValue={false}
                color="green"
                size="sm"
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            {/* Time left */}
            {!isCompleted && !isExpired && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  {hoursLeft}h {minutesLeft}m
                </span>
              </div>
            )}

            {isExpired && (
              <span className="text-xs text-red-500 font-medium">Expirada</span>
            )}

            {isCompleted && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Completada</span>
              </div>
            )}

            {/* XP Reward */}
            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
              <Zap className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-bold text-yellow-700">
                +{mission.xpReward} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      {!isExpired && (
        <div className="mt-3">
          {mission.status === 'pending' && onStart && (
            <button
              onClick={onStart}
              className="w-full py-2 bg-gradient-to-r from-kid-blue to-kid-green text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Empezar
            </button>
          )}

          {mission.status === 'completed' && mission.progress >= 100 && onClaim && (
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              onClick={onClaim}
              className="w-full py-2 bg-gradient-to-r from-kid-yellow to-orange-500 text-white font-bold rounded-xl"
            >
              ¡Reclamar Recompensa!
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export function MissionList({
  missions,
  onStartMission,
  onClaimMission,
}: {
  missions: Mission[]
  onStartMission?: (missionId: string) => void
  onClaimMission?: (missionId: string) => void
}) {
  if (missions.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No hay misiones disponibles</p>
        <p className="text-sm text-gray-400">¡Vuelve mañana para nuevas misiones!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <MissionCard
          key={mission._id}
          mission={mission}
          onStart={() => onStartMission?.(mission._id)}
          onClaim={() => onClaimMission?.(mission._id)}
        />
      ))}
    </div>
  )
}
