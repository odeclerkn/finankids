'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { AvatarSelector } from '@/components/ui/avatar-selector'

const STEPS = [
  { id: 'welcome', title: '¡Bienvenido!' },
  { id: 'name', title: '¿Cómo te llamas?' },
  { id: 'age', title: '¿Cuántos años tienes?' },
  { id: 'avatar', title: 'Elige tu avatar' },
  { id: 'ready', title: '¡Listo para empezar!' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    age: 8,
    avatarId: 'pig',
  })

  const currentStep = STEPS[step]
  const isFirstStep = step === 0
  const isLastStep = step === STEPS.length - 1

  const nextStep = () => {
    if (isLastStep) {
      // Save to localStorage for demo (in production, save to Convex)
      localStorage.setItem('finankids_user', JSON.stringify(formData))
      router.push('/kid/dashboard')
    } else {
      setStep((s) => s + 1)
    }
  }

  const prevStep = () => {
    if (!isFirstStep) {
      setStep((s) => s - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep.id) {
      case 'name':
        return formData.name.trim().length >= 2
      case 'age':
        return formData.age >= 5 && formData.age <= 16
      case 'avatar':
        return formData.avatarId !== ''
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-all ${
                index <= step
                  ? 'bg-gradient-to-r from-kid-purple to-kid-pink'
                  : 'bg-white'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="card-kid p-6 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              {/* Welcome */}
              {currentStep.id === 'welcome' && (
                <div className="text-center flex-1 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-8xl mb-6"
                  >
                    🐷
                  </motion.div>
                  <h1 className="text-3xl font-display font-bold text-gradient mb-4">
                    ¡Hola!
                  </h1>
                  <p className="text-gray-600">
                    Soy <span className="font-bold text-kid-purple">Finu</span>,
                    tu amigo financiero.
                  </p>
                  <p className="text-gray-600 mt-2">
                    Te enseñaré todo sobre el dinero de forma divertida.
                  </p>
                </div>
              )}

              {/* Name */}
              {currentStep.id === 'name' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <span className="text-6xl mb-4">👋</span>
                  <h2 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
                    ¿Cómo te llamas?
                  </h2>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Tu nombre"
                    className="w-full max-w-xs px-6 py-4 text-xl text-center border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-kid-purple"
                    autoFocus
                  />
                </div>
              )}

              {/* Age */}
              {currentStep.id === 'age' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <span className="text-6xl mb-4">🎂</span>
                  <h2 className="text-2xl font-display font-bold text-gray-800 mb-2 text-center">
                    ¿Cuántos años tienes, {formData.name}?
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Esto nos ayuda a adaptar el contenido para ti
                  </p>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={() =>
                        setFormData({ ...formData, age: Math.max(5, formData.age - 1) })
                      }
                      className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 hover:border-kid-purple"
                    >
                      -
                    </button>
                    <span className="text-6xl font-display font-bold text-kid-purple">
                      {formData.age}
                    </span>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, age: Math.min(16, formData.age + 1) })
                      }
                      className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 hover:border-kid-purple"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 mt-4">años</p>
                </div>
              )}

              {/* Avatar */}
              {currentStep.id === 'avatar' && (
                <div className="flex-1 flex flex-col">
                  <h2 className="text-2xl font-display font-bold text-gray-800 mb-2 text-center">
                    ¡Elige tu avatar!
                  </h2>
                  <p className="text-gray-500 mb-6 text-center">
                    Este será tu personaje en FinanKids
                  </p>
                  <AvatarSelector
                    selected={formData.avatarId}
                    onSelect={(avatarId) => setFormData({ ...formData, avatarId })}
                  />
                </div>
              )}

              {/* Ready */}
              {currentStep.id === 'ready' && (
                <div className="text-center flex-1 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="text-8xl mb-6"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-3xl font-display font-bold text-gradient mb-4">
                    ¡Todo listo, {formData.name}!
                  </h2>
                  <p className="text-gray-600">
                    Estás a punto de comenzar tu aventura financiera.
                  </p>
                  <p className="text-gray-600 mt-2">
                    ¿Estás listo para aprender a ser un maestro del dinero?
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all ${
                isFirstStep
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Atrás
            </button>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-1 px-6 py-3 rounded-xl font-bold transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-kid-purple to-kid-pink text-white hover:opacity-90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLastStep ? '¡Empezar!' : 'Siguiente'}
              {!isLastStep && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
