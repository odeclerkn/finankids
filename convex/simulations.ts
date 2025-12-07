import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Crear nueva simulación
export const createSimulation = mutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    // Desactivar otras simulaciones activas
    const activeSimulations = await ctx.db
      .query('simulations')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', args.userId).eq('isActive', true)
      )
      .collect()

    for (const sim of activeSimulations) {
      await ctx.db.patch(sim._id, { isActive: false })
    }

    // Crear nueva simulación
    const simulationId = await ctx.db.insert('simulations', {
      userId: args.userId,
      name: args.name,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      state: {
        virtualAge: 18,
        currentMonth: 1,
        currentYear: 2024,
        finances: {
          cash: 500,
          savings: 0,
          debt: 0,
          creditScore: 650,
        },
        investments: [],
        monthlyExpenses: [
          { category: 'Comida', name: 'Alimentación', amount: 200, isFixed: false },
          { category: 'Transporte', name: 'Pasajes', amount: 50, isFixed: true },
          { category: 'Entretenimiento', name: 'Diversión', amount: 100, isFixed: false },
        ],
        assets: [],
        lifeEvents: [
          {
            type: 'start',
            description: '¡Comenzaste tu vida adulta a los 18 años!',
            impact: 'neutral',
            occurredAt: now,
          },
        ],
      },
    })

    return simulationId
  },
})

// Obtener simulación activa
export const getActiveSimulation = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('simulations')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', args.userId).eq('isActive', true)
      )
      .first()
  },
})

// Obtener todas las simulaciones de un usuario
export const getUserSimulations = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('simulations')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect()
  },
})

// Conseguir trabajo
export const getJob = mutation({
  args: {
    simulationId: v.id('simulations'),
    job: v.object({
      title: v.string(),
      company: v.string(),
      monthlySalary: v.number(),
      satisfaction: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const simulation = await ctx.db.get(args.simulationId)
    if (!simulation) return null

    const now = Date.now()

    await ctx.db.patch(args.simulationId, {
      updatedAt: now,
      state: {
        ...simulation.state,
        job: args.job,
        lifeEvents: [
          ...simulation.state.lifeEvents,
          {
            type: 'job',
            description: `Conseguiste trabajo como ${args.job.title} en ${args.job.company}`,
            impact: 'positive',
            occurredAt: now,
          },
        ],
      },
    })

    return { success: true }
  },
})

// Avanzar un mes en la simulación
export const advanceMonth = mutation({
  args: { simulationId: v.id('simulations') },
  handler: async (ctx, args) => {
    const simulation = await ctx.db.get(args.simulationId)
    if (!simulation) return null

    const { state } = simulation
    const now = Date.now()

    // Calcular nuevo mes/año
    let newMonth = state.currentMonth + 1
    let newYear = state.currentYear
    let newAge = state.virtualAge

    if (newMonth > 12) {
      newMonth = 1
      newYear++
      // Cumpleaños cada año
      newAge++
    }

    // Calcular ingresos
    const monthlyIncome = state.job?.monthlySalary ?? 0

    // Calcular gastos totales
    const totalExpenses = state.monthlyExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    )

    // Calcular rendimiento de inversiones (simplificado: 0.5% mensual promedio)
    let investmentReturns = 0
    const updatedInvestments = state.investments.map((inv) => {
      const monthlyReturn = inv.currentPrice * 0.005 * (Math.random() * 2 - 0.5 + 1)
      const newPrice = inv.currentPrice + monthlyReturn
      investmentReturns += monthlyReturn * (inv.amount / inv.purchasePrice)
      return { ...inv, currentPrice: Math.max(0, newPrice) }
    })

    // Actualizar finanzas
    const netIncome = monthlyIncome - totalExpenses + investmentReturns
    const newCash = Math.max(0, state.finances.cash + netIncome)

    // Eventos aleatorios (20% de probabilidad)
    const newLifeEvents = [...state.lifeEvents]
    if (Math.random() < 0.2) {
      const randomEvents = [
        { type: 'bonus', description: '¡Recibiste un bono sorpresa!', impact: 'positive', amount: 200 },
        { type: 'expense', description: 'Tuviste un gasto médico inesperado', impact: 'negative', amount: -150 },
        { type: 'gift', description: 'Un familiar te dio un regalo', impact: 'positive', amount: 100 },
        { type: 'repair', description: 'Algo se rompió y tuviste que repararlo', impact: 'negative', amount: -100 },
      ]
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)]
      newLifeEvents.push({
        type: event.type,
        description: event.description,
        impact: event.impact,
        occurredAt: now,
      })
    }

    await ctx.db.patch(args.simulationId, {
      updatedAt: now,
      state: {
        ...state,
        virtualAge: newAge,
        currentMonth: newMonth,
        currentYear: newYear,
        finances: {
          ...state.finances,
          cash: newCash,
        },
        investments: updatedInvestments,
        lifeEvents: newLifeEvents,
      },
    })

    return {
      newMonth,
      newYear,
      newAge,
      monthlyIncome,
      totalExpenses,
      investmentReturns: Math.round(investmentReturns),
      netIncome: Math.round(netIncome),
      newCash: Math.round(newCash),
    }
  },
})

// Hacer una inversión
export const makeInvestment = mutation({
  args: {
    simulationId: v.id('simulations'),
    investment: v.object({
      type: v.string(),
      name: v.string(),
      amount: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const simulation = await ctx.db.get(args.simulationId)
    if (!simulation) return null

    const { state } = simulation
    const now = Date.now()

    // Verificar que tiene suficiente dinero
    if (state.finances.cash < args.investment.amount) {
      return { success: false, error: 'No tienes suficiente dinero' }
    }

    const newInvestment = {
      type: args.investment.type,
      name: args.investment.name,
      amount: args.investment.amount,
      purchasePrice: args.investment.amount,
      currentPrice: args.investment.amount,
      purchaseDate: now,
    }

    await ctx.db.patch(args.simulationId, {
      updatedAt: now,
      state: {
        ...state,
        finances: {
          ...state.finances,
          cash: state.finances.cash - args.investment.amount,
        },
        investments: [...state.investments, newInvestment],
        lifeEvents: [
          ...state.lifeEvents,
          {
            type: 'investment',
            description: `Invertiste $${args.investment.amount} en ${args.investment.name}`,
            impact: 'neutral',
            occurredAt: now,
          },
        ],
      },
    })

    return { success: true }
  },
})

// Transferir a ahorros
export const transferToSavings = mutation({
  args: {
    simulationId: v.id('simulations'),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const simulation = await ctx.db.get(args.simulationId)
    if (!simulation) return null

    const { state } = simulation

    if (state.finances.cash < args.amount) {
      return { success: false, error: 'No tienes suficiente dinero' }
    }

    await ctx.db.patch(args.simulationId, {
      updatedAt: Date.now(),
      state: {
        ...state,
        finances: {
          ...state.finances,
          cash: state.finances.cash - args.amount,
          savings: state.finances.savings + args.amount,
        },
      },
    })

    return { success: true }
  },
})

// Agregar gasto mensual
export const addExpense = mutation({
  args: {
    simulationId: v.id('simulations'),
    expense: v.object({
      category: v.string(),
      name: v.string(),
      amount: v.number(),
      isFixed: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const simulation = await ctx.db.get(args.simulationId)
    if (!simulation) return null

    await ctx.db.patch(args.simulationId, {
      updatedAt: Date.now(),
      state: {
        ...simulation.state,
        monthlyExpenses: [...simulation.state.monthlyExpenses, args.expense],
      },
    })

    return { success: true }
  },
})

// Eliminar gasto mensual
export const removeExpense = mutation({
  args: {
    simulationId: v.id('simulations'),
    expenseIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const simulation = await ctx.db.get(args.simulationId)
    if (!simulation) return null

    const newExpenses = simulation.state.monthlyExpenses.filter(
      (_, index) => index !== args.expenseIndex
    )

    await ctx.db.patch(args.simulationId, {
      updatedAt: Date.now(),
      state: {
        ...simulation.state,
        monthlyExpenses: newExpenses,
      },
    })

    return { success: true }
  },
})
