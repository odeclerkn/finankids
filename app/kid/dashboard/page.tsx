'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  BookOpen,
  Gamepad2,
  MessageCircle,
  Trophy,
  TrendingUp,
  Wallet,
  Target,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { MissionCard } from '@/components/game/mission-card'
import { Avatar } from '@/components/ui/avatar-selector'
import { ProgressBar } from '@/components/ui/progress-bar'

// Mock data - en producción vendría de Convex
const mockUser = {
  name: 'Sofía',
  avatarId: 'unicorn',
  age: 9,
}

const mockProgress = {
  level: 5,
  xp: 75,
  totalXp: 450,
  streak: 5,
  financialStats: {
    savingsHabit: 65,
    spendingWisdom: 45,
    investmentKnowledge: 30,
    taxUnderstanding: 20,
    budgetingSkill: 55,
  },
}

const mockMissions = [
  {
    _id: '1',
    type: 'learning',
    title: 'Explorador del Ahorro',
    description: 'Completa una lección sobre ahorro',
    xpReward: 50,
    status: 'pending' as const,
    progress: 0,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  },
  {
    _id: '2',
    type: 'chat',
    title: 'Pregúntale a Finu',
    description: 'Hazle una pregunta a tu tutor',
    xpReward: 20,
    status: 'in_progress' as const,
    progress: 50,
    expiresAt: Date.now() + 20 * 60 * 60 * 1000,
  },
]

const quickActions = [
  {
    href: '/kid/learn',
    icon: BookOpen,
    label: 'Aprender',
    emoji: '📚',
    color: 'from-blue-400 to-blue-600',
  },
  {
    href: '/kid/simulation',
    icon: Gamepad2,
    label: 'Simular',
    emoji: '🎮',
    color: 'from-green-400 to-green-600',
  },
  {
    href: '/kid/chat',
    icon: MessageCircle,
    label: 'Hablar con Finu',
    emoji: '🐷',
    color: 'from-pink-400 to-pink-600',
  },
]

export default function KidDashboard() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-kid p-6"
      >
        <div className="flex items-center gap-4">
          <Avatar avatarId={mockUser.avatarId} size="lg" />
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-800">
              ¡Hola, {mockUser.name}! 👋
            </h1>
            <p className="text-gray-500">
              Tienes {mockProgress.streak} días de racha. ¡Sigue así! 🔥
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-display font-bold text-gray-800 mb-3">
          ¿Qué quieres hacer hoy?
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className={`card-kid p-4 flex flex-col items-center gap-2 bg-gradient-to-br ${action.color} text-white hover:scale-105 transition-transform`}
              >
                <span className="text-3xl">{action.emoji}</span>
                <span className="font-medium text-sm text-center">
                  {action.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Missions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-kid-purple" />
            Misiones del Día
          </h2>
          <Link
            href="/kid/missions"
            className="text-sm text-kid-purple font-medium"
          >
            Ver todas →
          </Link>
        </div>
        <div className="space-y-3">
          {mockMissions.map((mission) => (
            <MissionCard
              key={mission._id}
              mission={mission}
              onStart={() => console.log('Start mission', mission._id)}
            />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-lg font-display font-bold text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-kid-green" />
          Tus Habilidades Financieras
        </h2>
        <div className="card-kid p-4 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">🐷 Ahorro</span>
              <span className="text-sm font-bold text-kid-purple">
                {mockProgress.financialStats.savingsHabit}%
              </span>
            </div>
            <ProgressBar
              value={mockProgress.financialStats.savingsHabit}
              max={100}
              showValue={false}
              color="purple"
              size="sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">
                💡 Gasto Inteligente
              </span>
              <span className="text-sm font-bold text-kid-blue">
                {mockProgress.financialStats.spendingWisdom}%
              </span>
            </div>
            <ProgressBar
              value={mockProgress.financialStats.spendingWisdom}
              max={100}
              showValue={false}
              color="blue"
              size="sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">
                📈 Inversiones
              </span>
              <span className="text-sm font-bold text-kid-green">
                {mockProgress.financialStats.investmentKnowledge}%
              </span>
            </div>
            <ProgressBar
              value={mockProgress.financialStats.investmentKnowledge}
              max={100}
              showValue={false}
              color="green"
              size="sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">
                🧮 Presupuesto
              </span>
              <span className="text-sm font-bold text-kid-yellow">
                {mockProgress.financialStats.budgetingSkill}%
              </span>
            </div>
            <ProgressBar
              value={mockProgress.financialStats.budgetingSkill}
              max={100}
              showValue={false}
              color="yellow"
              size="sm"
            />
          </div>
        </div>
      </section>

      {/* Recent Achievements */}
      <section>
        <h2 className="text-lg font-display font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-kid-yellow" />
          Logros Recientes
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['🌟 Primera Lección', '🔥 3 Días Seguidos', '💰 Primer Ahorro'].map(
            (achievement, index) => (
              <motion.div
                key={achievement}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
                className="flex-shrink-0 card-kid px-4 py-3 flex items-center gap-2"
              >
                <span className="text-xl">{achievement.split(' ')[0]}</span>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {achievement.split(' ').slice(1).join(' ')}
                </span>
              </motion.div>
            )
          )}
        </div>
      </section>
    </div>
  )
}
