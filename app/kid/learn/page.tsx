'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star, Lock, CheckCircle, ChevronRight } from 'lucide-react'
import { cn, getDifficultyColor, getDifficultyLabel } from '@/lib/utils'

// Mock lessons data
const CATEGORIES = [
  { id: 'ahorro', name: 'Ahorro', emoji: '🐷', color: 'from-pink-400 to-pink-600' },
  { id: 'gastos', name: 'Gastos', emoji: '🛒', color: 'from-blue-400 to-blue-600' },
  { id: 'ingresos', name: 'Ingresos', emoji: '💰', color: 'from-green-400 to-green-600' },
  { id: 'inversiones', name: 'Inversiones', emoji: '📈', color: 'from-purple-400 to-purple-600' },
  { id: 'impuestos', name: 'Impuestos', emoji: '🏛️', color: 'from-yellow-400 to-orange-500' },
]

const LESSONS = [
  {
    id: 'ahorro_1',
    title: '¿Qué es el ahorro?',
    description: 'Aprende por qué guardar dinero es tan importante',
    category: 'ahorro',
    difficulty: 'beginner' as const,
    xpReward: 50,
    duration: '5 min',
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'ahorro_2',
    title: 'La regla del 50-30-20',
    description: 'Descubre cómo dividir tu dinero de forma inteligente',
    category: 'ahorro',
    difficulty: 'beginner' as const,
    xpReward: 60,
    duration: '8 min',
    isCompleted: false,
    isLocked: false,
  },
  {
    id: 'ahorro_3',
    title: 'Metas de ahorro',
    description: 'Aprende a establecer y alcanzar tus metas financieras',
    category: 'ahorro',
    difficulty: 'intermediate' as const,
    xpReward: 80,
    duration: '10 min',
    isCompleted: false,
    isLocked: false,
  },
  {
    id: 'gastos_1',
    title: 'Gastos fijos y variables',
    description: 'Entiende la diferencia entre tipos de gastos',
    category: 'gastos',
    difficulty: 'beginner' as const,
    xpReward: 50,
    duration: '6 min',
    isCompleted: false,
    isLocked: false,
  },
  {
    id: 'ingresos_1',
    title: '¿De dónde viene el dinero?',
    description: 'Aprende sobre salarios, trabajos y formas de ganar dinero',
    category: 'ingresos',
    difficulty: 'beginner' as const,
    xpReward: 50,
    duration: '5 min',
    isCompleted: false,
    isLocked: false,
  },
  {
    id: 'inversiones_1',
    title: '¿Qué es invertir?',
    description: 'Introducción al mundo de las inversiones',
    category: 'inversiones',
    difficulty: 'intermediate' as const,
    xpReward: 70,
    duration: '8 min',
    isCompleted: false,
    isLocked: true,
  },
  {
    id: 'impuestos_1',
    title: '¿Qué son los impuestos?',
    description: 'Descubre para qué sirven los impuestos',
    category: 'impuestos',
    difficulty: 'intermediate' as const,
    xpReward: 70,
    duration: '7 min',
    isCompleted: false,
    isLocked: true,
  },
]

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredLessons = selectedCategory
    ? LESSONS.filter((l) => l.category === selectedCategory)
    : LESSONS

  const completedCount = LESSONS.filter((l) => l.isCompleted).length
  const totalCount = LESSONS.length

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="card-kid p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kid-blue to-kid-purple flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-gray-800">
              Centro de Aprendizaje
            </h1>
            <p className="text-sm text-gray-500">
              {completedCount}/{totalCount} lecciones completadas
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            className="h-full bg-gradient-to-r from-kid-purple to-kid-pink"
          />
        </div>
      </div>

      {/* Categories */}
      <section>
        <h2 className="font-display font-bold text-gray-800 mb-3">Categorías</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all',
              selectedCategory === null
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            )}
          >
            Todas
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all',
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white`
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              )}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Lessons */}
      <section>
        <h2 className="font-display font-bold text-gray-800 mb-3">
          {selectedCategory
            ? CATEGORIES.find((c) => c.id === selectedCategory)?.name
            : 'Todas las lecciones'}
        </h2>
        <div className="space-y-3">
          {filteredLessons.map((lesson, index) => {
            const category = CATEGORIES.find((c) => c.id === lesson.category)

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  disabled={lesson.isLocked}
                  className={cn(
                    'w-full card-kid p-4 text-left transition-all',
                    lesson.isLocked
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:scale-[1.02]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                        lesson.isCompleted
                          ? 'bg-green-100'
                          : lesson.isLocked
                          ? 'bg-gray-100'
                          : `bg-gradient-to-br ${category?.color}`
                      )}
                    >
                      {lesson.isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : lesson.isLocked ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : (
                        category?.emoji
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-gray-800">
                          {lesson.title}
                        </h3>
                        {!lesson.isLocked && (
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {lesson.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full',
                            getDifficultyColor(lesson.difficulty)
                          )}
                        >
                          {getDifficultyLabel(lesson.difficulty)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {lesson.duration}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-kid-yellow">
                          <Star className="w-3 h-3" />
                          <span>{lesson.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay lecciones en esta categoría</p>
        </div>
      )}
    </div>
  )
}
