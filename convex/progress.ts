import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Obtener progreso de un usuario
export const getProgress = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('progress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()
  },
})

// Añadir XP y actualizar nivel si es necesario
export const addXp = mutation({
  args: {
    userId: v.id('users'),
    xpAmount: v.number(),
    source: v.string(), // 'lesson', 'mission', 'quiz', 'daily_login'
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('progress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) return null

    const newXp = progress.xp + args.xpAmount
    const newTotalXp = progress.totalXp + args.xpAmount

    // Calcular nuevo nivel (100 XP por nivel, incrementando 50 por nivel)
    const xpForLevel = (level: number) => 100 + (level - 1) * 50
    let newLevel = progress.level
    let remainingXp = newXp

    while (remainingXp >= xpForLevel(newLevel)) {
      remainingXp -= xpForLevel(newLevel)
      newLevel++
    }

    const leveledUp = newLevel > progress.level

    await ctx.db.patch(progress._id, {
      xp: remainingXp,
      totalXp: newTotalXp,
      level: newLevel,
      lastActiveAt: Date.now(),
    })

    return {
      newLevel,
      newXp: remainingXp,
      totalXp: newTotalXp,
      leveledUp,
      xpGained: args.xpAmount,
    }
  },
})

// Completar una lección
export const completeLesson = mutation({
  args: {
    userId: v.id('users'),
    lessonId: v.string(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('progress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) return null

    // Verificar si ya está completada
    if (progress.completedLessons.includes(args.lessonId)) {
      return { alreadyCompleted: true }
    }

    await ctx.db.patch(progress._id, {
      completedLessons: [...progress.completedLessons, args.lessonId],
      lastActiveAt: Date.now(),
    })

    return { alreadyCompleted: false }
  },
})

// Desbloquear logro
export const unlockAchievement = mutation({
  args: {
    userId: v.id('users'),
    achievementId: v.string(),
    achievementName: v.string(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('progress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) return null

    // Verificar si ya está desbloqueado
    const alreadyUnlocked = progress.achievements.some(
      (a) => a.id === args.achievementId
    )
    if (alreadyUnlocked) {
      return { alreadyUnlocked: true }
    }

    await ctx.db.patch(progress._id, {
      achievements: [
        ...progress.achievements,
        {
          id: args.achievementId,
          name: args.achievementName,
          unlockedAt: Date.now(),
        },
      ],
    })

    return { alreadyUnlocked: false }
  },
})

// Actualizar estadísticas financieras
export const updateFinancialStats = mutation({
  args: {
    userId: v.id('users'),
    stats: v.object({
      savingsHabit: v.optional(v.number()),
      spendingWisdom: v.optional(v.number()),
      investmentKnowledge: v.optional(v.number()),
      taxUnderstanding: v.optional(v.number()),
      budgetingSkill: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('progress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) return null

    const newStats = { ...progress.financialStats }

    // Actualizar solo los campos proporcionados, con límite de 0-100
    for (const [key, value] of Object.entries(args.stats)) {
      if (value !== undefined) {
        const typedKey = key as keyof typeof newStats
        newStats[typedKey] = Math.min(100, Math.max(0, value))
      }
    }

    await ctx.db.patch(progress._id, {
      financialStats: newStats,
    })

    return newStats
  },
})

// Actualizar racha diaria
export const updateStreak = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('progress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) return null

    const now = Date.now()
    const lastActive = new Date(progress.lastActiveAt)
    const today = new Date(now)

    // Resetear horas para comparar solo fechas
    lastActive.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

    let newStreak = progress.streak

    if (daysDiff === 0) {
      // Mismo día, no hacer nada
    } else if (daysDiff === 1) {
      // Día consecutivo, incrementar racha
      newStreak++
    } else {
      // Racha rota
      newStreak = 1
    }

    await ctx.db.patch(progress._id, {
      streak: newStreak,
      lastActiveAt: now,
    })

    return { streak: newStreak, isNewDay: daysDiff > 0 }
  },
})

// Obtener ranking de la familia
export const getFamilyLeaderboard = query({
  args: { familyId: v.id('families') },
  handler: async (ctx, args) => {
    const children = await ctx.db
      .query('users')
      .withIndex('by_family', (q) => q.eq('familyId', args.familyId))
      .filter((q) => q.eq(q.field('role'), 'child'))
      .collect()

    const leaderboard = await Promise.all(
      children.map(async (child) => {
        const progress = await ctx.db
          .query('progress')
          .withIndex('by_user', (q) => q.eq('userId', child._id))
          .first()

        return {
          userId: child._id,
          name: child.name,
          avatarId: child.avatarId,
          level: progress?.level ?? 1,
          totalXp: progress?.totalXp ?? 0,
          streak: progress?.streak ?? 0,
        }
      })
    )

    return leaderboard.sort((a, b) => b.totalXp - a.totalXp)
  },
})
