import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Crear misión para usuario
export const createMission = mutation({
  args: {
    userId: v.id('users'),
    type: v.string(),
    title: v.string(),
    description: v.string(),
    xpReward: v.number(),
    durationHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const durationMs = (args.durationHours ?? 24) * 60 * 60 * 1000

    const missionId = await ctx.db.insert('missions', {
      userId: args.userId,
      type: args.type,
      title: args.title,
      description: args.description,
      xpReward: args.xpReward,
      status: 'pending',
      progress: 0,
      createdAt: now,
      expiresAt: now + durationMs,
    })

    return missionId
  },
})

// Generar misiones diarias para un usuario
export const generateDailyMissions = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user || user.role !== 'child') return []

    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000

    // Verificar si ya tiene misiones activas de hoy
    const existingMissions = await ctx.db
      .query('missions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) =>
        q.and(
          q.neq(q.field('status'), 'completed'),
          q.neq(q.field('status'), 'expired'),
          q.gt(q.field('expiresAt'), now)
        )
      )
      .collect()

    if (existingMissions.length >= 3) {
      return existingMissions
    }

    // Plantillas de misiones basadas en edad
    const missionTemplates = [
      {
        type: 'learning',
        title: 'Explorador del Ahorro',
        description: 'Completa una lección sobre ahorro',
        xpReward: 50,
      },
      {
        type: 'quiz',
        title: 'Cerebrito Financiero',
        description: 'Responde correctamente 3 preguntas del quiz',
        xpReward: 30,
      },
      {
        type: 'simulation',
        title: 'Un Día en tu Futuro',
        description: 'Avanza un mes en tu simulación de vida',
        xpReward: 40,
      },
      {
        type: 'chat',
        title: 'Pregúntale a Finu',
        description: 'Hazle una pregunta a tu tutor Finu',
        xpReward: 20,
      },
      {
        type: 'saving',
        title: 'Alcancía Virtual',
        description: 'Transfiere dinero a tus ahorros en la simulación',
        xpReward: 35,
      },
    ]

    // Seleccionar 3 misiones aleatorias
    const shuffled = missionTemplates.sort(() => Math.random() - 0.5)
    const selectedTemplates = shuffled.slice(0, 3 - existingMissions.length)

    const newMissions = []
    for (const template of selectedTemplates) {
      const missionId = await ctx.db.insert('missions', {
        userId: args.userId,
        type: template.type,
        title: template.title,
        description: template.description,
        xpReward: template.xpReward,
        status: 'pending',
        progress: 0,
        createdAt: now,
        expiresAt: now + oneDayMs,
      })
      newMissions.push({ _id: missionId, ...template })
    }

    return [...existingMissions, ...newMissions]
  },
})

// Obtener misiones activas de un usuario
export const getActiveMissions = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const now = Date.now()

    return await ctx.db
      .query('missions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) =>
        q.and(
          q.neq(q.field('status'), 'completed'),
          q.neq(q.field('status'), 'expired'),
          q.gt(q.field('expiresAt'), now)
        )
      )
      .collect()
  },
})

// Actualizar progreso de misión
export const updateProgress = mutation({
  args: {
    missionId: v.id('missions'),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    const mission = await ctx.db.get(args.missionId)
    if (!mission) return null

    const newProgress = Math.min(100, Math.max(0, args.progress))
    const newStatus = newProgress >= 100 ? 'completed' : 'in_progress'

    await ctx.db.patch(args.missionId, {
      progress: newProgress,
      status: newStatus,
      ...(newStatus === 'completed' ? { completedAt: Date.now() } : {}),
    })

    return { progress: newProgress, status: newStatus }
  },
})

// Completar misión
export const completeMission = mutation({
  args: { missionId: v.id('missions') },
  handler: async (ctx, args) => {
    const mission = await ctx.db.get(args.missionId)
    if (!mission || mission.status === 'completed') return null

    await ctx.db.patch(args.missionId, {
      status: 'completed',
      progress: 100,
      completedAt: Date.now(),
    })

    return { xpReward: mission.xpReward }
  },
})

// Marcar misiones expiradas
export const expireOldMissions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()

    const expiredMissions = await ctx.db
      .query('missions')
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field('status'), 'pending'),
            q.eq(q.field('status'), 'in_progress')
          ),
          q.lt(q.field('expiresAt'), now)
        )
      )
      .collect()

    for (const mission of expiredMissions) {
      await ctx.db.patch(mission._id, { status: 'expired' })
    }

    return { expiredCount: expiredMissions.length }
  },
})

// Obtener historial de misiones
export const getMissionHistory = query({
  args: {
    userId: v.id('users'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('missions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(args.limit ?? 20)
  },
})
