'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  Home,
  ShoppingCart,
  TrendingUp,
  Wallet,
  Calendar,
  ChevronRight,
  Plus,
  Minus,
  PlayCircle,
  PiggyBank,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { ProgressBar } from '@/components/ui/progress-bar'

// Mock simulation data
const initialSimulation = {
  virtualAge: 18,
  currentMonth: 1,
  currentYear: 2024,
  job: null as { title: string; company: string; monthlySalary: number } | null,
  finances: {
    cash: 500,
    savings: 0,
    debt: 0,
    creditScore: 650,
  },
  investments: [] as Array<{
    type: string
    name: string
    amount: number
    currentValue: number
  }>,
  monthlyExpenses: [
    { category: 'Comida', name: 'Alimentación', amount: 200, isFixed: false },
    { category: 'Transporte', name: 'Pasajes', amount: 50, isFixed: true },
    { category: 'Entretenimiento', name: 'Diversión', amount: 100, isFixed: false },
  ],
}

const AVAILABLE_JOBS = [
  { title: 'Mesero', company: 'Restaurante Local', monthlySalary: 800, minAge: 18 },
  { title: 'Asistente de Tienda', company: 'Tienda de Ropa', monthlySalary: 900, minAge: 18 },
  { title: 'Tutor de Matemáticas', company: 'Academia', monthlySalary: 600, minAge: 18 },
  { title: 'Repartidor', company: 'App de Delivery', monthlySalary: 1000, minAge: 18 },
  { title: 'Diseñador Jr.', company: 'Agencia Creativa', monthlySalary: 1500, minAge: 20 },
  { title: 'Programador Jr.', company: 'Startup Tech', monthlySalary: 2000, minAge: 20 },
]

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

type ViewType = 'overview' | 'job' | 'expenses' | 'savings' | 'invest'

export default function SimulationPage() {
  const [simulation, setSimulation] = useState(initialSimulation)
  const [currentView, setCurrentView] = useState<ViewType>('overview')
  const [showEvent, setShowEvent] = useState<string | null>(null)
  const [savingsAmount, setSavingsAmount] = useState(50)

  const totalExpenses = simulation.monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)
  const monthlyIncome = simulation.job?.monthlySalary ?? 0
  const netIncome = monthlyIncome - totalExpenses

  const advanceMonth = () => {
    setSimulation((prev) => {
      let newMonth = prev.currentMonth + 1
      let newYear = prev.currentYear
      let newAge = prev.virtualAge

      if (newMonth > 12) {
        newMonth = 1
        newYear++
        newAge++
      }

      // Calculate new cash
      const income = prev.job?.monthlySalary ?? 0
      const expenses = prev.monthlyExpenses.reduce((s, e) => s + e.amount, 0)
      const newCash = Math.max(0, prev.finances.cash + income - expenses)

      // Random event (30% chance)
      if (Math.random() < 0.3) {
        const events = [
          { message: '🎁 ¡Tu abuela te dio un regalo de $100!', amount: 100 },
          { message: '🔧 Algo se rompió. Gastaste $80 en repararlo.', amount: -80 },
          { message: '⭐ ¡Recibiste un bono por buen trabajo: $150!', amount: 150 },
          { message: '🏥 Tuviste un gasto médico de $120.', amount: -120 },
        ]
        const event = events[Math.floor(Math.random() * events.length)]
        setShowEvent(event.message)
        setTimeout(() => setShowEvent(null), 3000)
        return {
          ...prev,
          virtualAge: newAge,
          currentMonth: newMonth,
          currentYear: newYear,
          finances: {
            ...prev.finances,
            cash: Math.max(0, newCash + event.amount),
          },
        }
      }

      return {
        ...prev,
        virtualAge: newAge,
        currentMonth: newMonth,
        currentYear: newYear,
        finances: {
          ...prev.finances,
          cash: newCash,
        },
      }
    })
  }

  const getJob = (job: typeof AVAILABLE_JOBS[0]) => {
    setSimulation((prev) => ({
      ...prev,
      job: {
        title: job.title,
        company: job.company,
        monthlySalary: job.monthlySalary,
      },
    }))
    setCurrentView('overview')
    setShowEvent(`🎉 ¡Felicidades! Ahora trabajas como ${job.title}`)
    setTimeout(() => setShowEvent(null), 3000)
  }

  const transferToSavings = () => {
    if (simulation.finances.cash >= savingsAmount) {
      setSimulation((prev) => ({
        ...prev,
        finances: {
          ...prev.finances,
          cash: prev.finances.cash - savingsAmount,
          savings: prev.finances.savings + savingsAmount,
        },
      }))
      setShowEvent(`🐷 ¡Ahorraste ${formatCurrency(savingsAmount)}!`)
      setTimeout(() => setShowEvent(null), 3000)
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Event Notification */}
      <AnimatePresence>
        {showEvent && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-96 z-50 bg-white rounded-2xl shadow-xl p-4 border-2 border-kid-yellow"
          >
            <p className="text-center font-medium text-gray-800">{showEvent}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="card-kid p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kid-blue to-kid-green flex items-center justify-center text-2xl">
              🎮
            </div>
            <div>
              <h1 className="font-display font-bold text-gray-800">
                Mi Vida Futura
              </h1>
              <p className="text-sm text-gray-500">
                Edad: {simulation.virtualAge} años
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {MONTHS[simulation.currentMonth - 1]} {simulation.currentYear}
            </p>
            <button
              onClick={advanceMonth}
              className="flex items-center gap-1 text-kid-purple font-medium text-sm hover:underline"
            >
              <PlayCircle className="w-4 h-4" />
              Avanzar mes
            </button>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <Wallet className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Efectivo</p>
            <p className="font-bold text-green-600">
              {formatCurrency(simulation.finances.cash)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <PiggyBank className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Ahorros</p>
            <p className="font-bold text-blue-600">
              {formatCurrency(simulation.finances.savings)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Balance Mensual</p>
            <p className={`font-bold ${netIncome >= 0 ? 'text-purple-600' : 'text-red-500'}`}>
              {netIncome >= 0 ? '+' : ''}{formatCurrency(netIncome)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Resumen', icon: '📊' },
          { id: 'job', label: 'Trabajo', icon: '💼' },
          { id: 'expenses', label: 'Gastos', icon: '🛒' },
          { id: 'savings', label: 'Ahorros', icon: '🐷' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id as ViewType)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              currentView === tab.id
                ? 'bg-gradient-to-r from-kid-purple to-kid-pink text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {currentView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Job Status */}
            <div className="card-kid p-4">
              <h3 className="font-display font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-kid-blue" />
                Mi Trabajo
              </h3>
              {simulation.job ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{simulation.job.title}</p>
                    <p className="text-sm text-gray-500">{simulation.job.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(simulation.job.monthlySalary)}/mes
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentView('job')}
                  className="w-full py-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  + Buscar trabajo
                </button>
              )}
            </div>

            {/* Monthly Expenses Summary */}
            <div className="card-kid p-4">
              <h3 className="font-display font-bold text-gray-800 mb-3 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-kid-pink" />
                Gastos Mensuales
              </h3>
              <div className="space-y-2">
                {simulation.monthlyExpenses.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{expense.name}</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-red-500">
                    -{formatCurrency(totalExpenses)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'job' && (
          <motion.div
            key="job"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="card-kid p-4">
              <h3 className="font-display font-bold text-gray-800 mb-4">
                🔍 Trabajos Disponibles
              </h3>
              <div className="space-y-3">
                {AVAILABLE_JOBS.filter(j => j.minAge <= simulation.virtualAge).map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-600">
                        {formatCurrency(job.monthlySalary)}/mes
                      </span>
                      <button
                        onClick={() => getJob(job)}
                        disabled={simulation.job?.title === job.title}
                        className="px-3 py-1 bg-kid-purple text-white rounded-lg text-sm hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {simulation.job?.title === job.title ? 'Actual' : 'Aplicar'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'savings' && (
          <motion.div
            key="savings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="card-kid p-6 text-center">
              <div className="text-6xl mb-4">🐷</div>
              <h3 className="font-display font-bold text-2xl text-gray-800 mb-2">
                Tu Alcancía
              </h3>
              <p className="text-3xl font-bold text-kid-purple mb-4">
                {formatCurrency(simulation.finances.savings)}
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-500 mb-3">¿Cuánto quieres ahorrar?</p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setSavingsAmount(Math.max(10, savingsAmount - 50))}
                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center"
                  >
                    <Minus className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-2xl font-bold text-kid-purple w-32">
                    {formatCurrency(savingsAmount)}
                  </span>
                  <button
                    onClick={() => setSavingsAmount(Math.min(simulation.finances.cash, savingsAmount + 50))}
                    className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={transferToSavings}
                disabled={simulation.finances.cash < savingsAmount}
                className="w-full py-3 bg-gradient-to-r from-kid-purple to-kid-pink text-white font-bold rounded-xl disabled:opacity-50"
              >
                Transferir a Ahorros
              </button>

              <p className="text-sm text-gray-400 mt-3">
                Disponible: {formatCurrency(simulation.finances.cash)}
              </p>
            </div>

            {/* Savings Tips */}
            <div className="card-kid p-4">
              <h4 className="font-display font-bold text-gray-800 mb-3">
                💡 Tip de Ahorro
              </h4>
              <p className="text-gray-600 text-sm">
                Intenta ahorrar al menos el 20% de lo que ganas cada mes.
                Si ganas {formatCurrency(monthlyIncome)}, deberías ahorrar
                {' '}{formatCurrency(monthlyIncome * 0.2)} cada mes.
              </p>
            </div>
          </motion.div>
        )}

        {currentView === 'expenses' && (
          <motion.div
            key="expenses"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="card-kid p-4">
              <h3 className="font-display font-bold text-gray-800 mb-4">
                📋 Mis Gastos Mensuales
              </h3>
              <div className="space-y-3">
                {simulation.monthlyExpenses.map((expense, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {expense.category === 'Comida' ? '🍔' :
                         expense.category === 'Transporte' ? '🚌' :
                         expense.category === 'Entretenimiento' ? '🎮' : '📦'}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{expense.name}</p>
                        <p className="text-xs text-gray-500">
                          {expense.isFixed ? 'Gasto fijo' : 'Gasto variable'}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total Mensual</span>
                  <span className="font-bold text-red-500 text-xl">
                    {formatCurrency(totalExpenses)}
                  </span>
                </div>
              </div>
            </div>

            {/* Expense Analysis */}
            <div className="card-kid p-4">
              <h4 className="font-display font-bold text-gray-800 mb-3">
                📊 Análisis
              </h4>
              {monthlyIncome > 0 ? (
                <>
                  <p className="text-gray-600 text-sm mb-3">
                    Tus gastos representan el{' '}
                    <span className="font-bold text-kid-purple">
                      {Math.round((totalExpenses / monthlyIncome) * 100)}%
                    </span>{' '}
                    de tus ingresos.
                  </p>
                  <ProgressBar
                    value={totalExpenses}
                    max={monthlyIncome}
                    showValue={false}
                    color={totalExpenses > monthlyIncome * 0.8 ? 'pink' : 'green'}
                    size="md"
                  />
                  {totalExpenses > monthlyIncome * 0.8 && (
                    <p className="text-sm text-orange-600 mt-2">
                      ⚠️ Cuidado: estás gastando más del 80% de tus ingresos
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  Consigue un trabajo para ver cómo se comparan tus gastos con tus ingresos.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
