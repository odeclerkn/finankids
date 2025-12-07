'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  BookOpen,
  Gamepad2,
  MessageCircle,
  User,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { XPDisplay } from '@/components/game/xp-display'

const NAV_ITEMS = [
  { href: '/kid/dashboard', icon: Home, label: 'Inicio', emoji: '🏠' },
  { href: '/kid/learn', icon: BookOpen, label: 'Aprender', emoji: '📚' },
  { href: '/kid/simulation', icon: Gamepad2, label: 'Simular', emoji: '🎮' },
  { href: '/kid/chat', icon: MessageCircle, label: 'Finu', emoji: '🐷' },
  { href: '/kid/profile', icon: User, label: 'Perfil', emoji: '👤' },
]

export default function KidLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mock data - en producción vendría de Convex
  const mockProgress = {
    totalXp: 450,
    streak: 5,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-orange-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/kid/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🐷</span>
            <span className="font-display font-bold text-kid-purple">
              FinanKids
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <XPDisplay
              totalXp={mockProgress.totalXp}
              streak={mockProgress.streak}
              compact
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-orange-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-orange-100 shadow-lg"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 hover:bg-orange-50',
                  pathname === item.href && 'bg-orange-100'
                )}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="font-medium text-gray-700">{item.label}</span>
              </Link>
            ))}
          </motion.nav>
        )}
      </header>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-1 bg-white border-r border-orange-100">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-orange-100">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-4xl"
              >
                🐷
              </motion.span>
              <span className="font-display font-bold text-xl text-gradient">
                FinanKids
              </span>
            </div>

            {/* XP Display */}
            <div className="px-4 py-4 border-b border-orange-100">
              <XPDisplay
                totalXp={mockProgress.totalXp}
                streak={mockProgress.streak}
              />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-kid-purple to-kid-pink text-white'
                        : 'text-gray-600 hover:bg-orange-50'
                    )}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute right-2 w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-orange-100">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 z-40">
        <div className="flex justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center py-2 px-4 rounded-lg transition-all',
                  isActive ? 'text-kid-purple' : 'text-gray-400'
                )}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-medium mt-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeMobileNav"
                    className="absolute bottom-0 w-8 h-1 bg-gradient-to-r from-kid-purple to-kid-pink rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
