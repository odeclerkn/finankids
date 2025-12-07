'use client'

import { motion } from 'framer-motion'
import { Settings, Trophy, Clock, BookOpen, Gamepad2, LogOut } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar-selector'
import { ProgressBar } from '@/components/ui/progress-bar'
import { calculateLevel, timeAgo } from '@/lib/utils'

// Mock data
const mockUser = {
  name: 'Sofía',
  avatarId: 'unicorn',
  age: 9,
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
}

const mockProgress = {
  level: 5,
  xp: 75,
  totalXp: 450,
  streak: 5,
  completedLessons: ['ahorro_1', 'ahorro_2'],
  achievements: [
    { id: 'first_lesson', name: 'Primera Lección', emoji: '🌟' },
    { id: 'streak_3', name: '3 Días Seguidos', emoji: '🔥' },
    { id: 'first_save', name: 'Primer Ahorro', emoji: '💰' },
    { id: 'quiz_master', name: 'Maestro del Quiz', emoji: '🧠' },
  ],
  financialStats: {
    savingsHabit: 65,
    spendingWisdom: 45,
    investmentKnowledge: 30,
    taxUnderstanding: 20,
    budgetingSkill: 55,
  },
}

const stats = [
  { label: 'Lecciones', value: mockProgress.completedLessons.length, icon: BookOpen, color: 'text-blue-500' },
  { label: 'Racha', value: `${mockProgress.streak} días`, icon: Clock, color: 'text-orange-500' },
  { label: 'Logros', value: mockProgress.achievements.length, icon: Trophy, color: 'text-yellow-500' },
]

export default function ProfilePage() {
  const { level, xpInLevel, xpForNextLevel } = calculateLevel(mockProgress.totalXp)

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Profile Header */}
      <div className="card-kid p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative inline-block"
        >
          <Avatar avatarId={mockUser.avatarId} size="xl" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-kid-yellow to-orange-400 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg"
          >
            {level}
          </motion.div>
        </motion.div>

        <h1 className="text-2xl font-display font-bold text-gray-800 mt-4">
          {mockUser.name}
        </h1>
        <p className="text-gray-500">{mockUser.age} años</p>
        <p className="text-xs text-gray-400 mt-1">
          Jugando desde {timeAgo(mockUser.createdAt)}
        </p>

        {/* Level Progress */}
        <div className="mt-4 max-w-xs mx-auto">
          <ProgressBar
            value={xpInLevel}
            max={xpForNextLevel}
            label={`Nivel ${level}`}
            color="yellow"
            size="md"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-kid p-4 text-center"
          >
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <section>
        <h2 className="font-display font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-kid-yellow" />
          Mis Logros
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {mockProgress.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card-kid p-4 text-center"
            >
              <span className="text-4xl mb-2 block">{achievement.emoji}</span>
              <p className="font-medium text-gray-800 text-sm">{achievement.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Financial Skills */}
      <section>
        <h2 className="font-display font-bold text-gray-800 mb-3">
          📊 Mis Habilidades
        </h2>
        <div className="card-kid p-4 space-y-4">
          {Object.entries(mockProgress.financialStats).map(([key, value]) => {
            const labels: Record<string, { name: string; emoji: string; color: 'purple' | 'blue' | 'green' | 'yellow' | 'pink' }> = {
              savingsHabit: { name: 'Ahorro', emoji: '🐷', color: 'purple' },
              spendingWisdom: { name: 'Gasto Inteligente', emoji: '💡', color: 'blue' },
              investmentKnowledge: { name: 'Inversiones', emoji: '📈', color: 'green' },
              taxUnderstanding: { name: 'Impuestos', emoji: '🏛️', color: 'yellow' },
              budgetingSkill: { name: 'Presupuesto', emoji: '🧮', color: 'pink' },
            }
            const label = labels[key]
            if (!label) return null

            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    {label.emoji} {label.name}
                  </span>
                  <span className="text-sm font-bold text-gray-800">{value}%</span>
                </div>
                <ProgressBar
                  value={value}
                  max={100}
                  showValue={false}
                  color={label.color}
                  size="sm"
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full card-kid p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-gray-700">Configuración</span>
        </button>
        <button className="w-full card-kid p-4 flex items-center gap-3 hover:bg-red-50 transition-colors text-red-500">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}
