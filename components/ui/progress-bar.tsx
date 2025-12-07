'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  showValue?: boolean
  color?: 'purple' | 'pink' | 'blue' | 'green' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const colorClasses = {
  purple: 'from-kid-purple to-purple-400',
  pink: 'from-kid-pink to-pink-400',
  blue: 'from-kid-blue to-blue-400',
  green: 'from-kid-green to-green-400',
  yellow: 'from-kid-yellow to-yellow-400',
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
}

export function ProgressBar({
  value,
  max,
  label,
  showValue = true,
  color = 'purple',
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-bold text-gray-600">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            colorClasses[color]
          )}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
