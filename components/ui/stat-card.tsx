'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'purple' | 'pink' | 'blue' | 'green' | 'yellow'
}

const colorClasses = {
  purple: 'bg-purple-100 text-kid-purple',
  pink: 'bg-pink-100 text-kid-pink',
  blue: 'bg-blue-100 text-kid-blue',
  green: 'bg-green-100 text-kid-green',
  yellow: 'bg-yellow-100 text-kid-yellow',
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'purple',
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card-kid p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-display font-bold text-gray-800 mt-1">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center mt-2 text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-2xl',
          colorClasses[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}
