'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Coins, Rocket, Brain, Gamepad2 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🐷
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-gradient mb-4">
          FinanKids
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 font-display max-w-2xl">
          ¡Aprende a manejar el dinero como un experto mientras te diviertes!
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mb-12">
        <FeatureCard
          icon={<Coins className="w-10 h-10 text-kid-yellow" />}
          title="Ahorra"
          description="Aprende el poder del ahorro con misiones divertidas"
          delay={0.2}
        />
        <FeatureCard
          icon={<Rocket className="w-10 h-10 text-kid-purple" />}
          title="Invierte"
          description="Descubre cómo hacer crecer tu dinero"
          delay={0.4}
        />
        <FeatureCard
          icon={<Brain className="w-10 h-10 text-kid-pink" />}
          title="Aprende"
          description="Tu tutor Finu te explica todo de forma sencilla"
          delay={0.6}
        />
        <FeatureCard
          icon={<Gamepad2 className="w-10 h-10 text-kid-blue" />}
          title="Simula"
          description="Vive la vida adulta en un juego seguro"
          delay={0.8}
        />
      </div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link href="/kid/onboarding" className="btn-primary text-center text-lg">
          🎮 ¡Quiero Jugar!
        </Link>
        <Link href="/parent/login" className="btn-secondary text-center text-lg">
          👨‍👩‍👧 Soy Padre/Tutor
        </Link>
      </motion.div>

      {/* Floating Elements */}
      <FloatingCoins />
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, rotate: 1 }}
      className="card-kid p-6 text-center"
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </motion.div>
  )
}

function FloatingCoins() {
  const coins = ['💰', '🪙', '💎', '⭐']

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {coins.map((coin, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{
            x: Math.random() * 100 + '%',
            y: '100vh',
            opacity: 0.6
          }}
          animate={{
            y: '-100vh',
            rotate: 360,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 3,
            ease: 'linear',
          }}
          style={{ left: `${10 + i * 25}%` }}
        >
          {coin}
        </motion.div>
      ))}
    </div>
  )
}
