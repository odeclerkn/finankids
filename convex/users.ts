import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Crear una nueva familia con su primer usuario (padre)
export const createFamily = mutation({
  args: {
    familyName: v.string(),
    parentName: v.string(),
    parentEmail: v.string(),
    settings: v.optional(v.object({
      currency: v.string(),
      language: v.string(),
      timezone: v.string(),
    })),
    microeconomicContext: v.optional(v.object({
      monthlyBudgetRange: v.string(),
      location: v.string(),
      financialGoals: v.array(v.string()),
      typicalExpenses: v.array(v.object({
        category: v.string(),
        description: v.string(),
      })),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    // Crear familia
    const familyId = await ctx.db.insert('families', {
      name: args.familyName,
      createdAt: now,
      settings: args.settings ?? {
        currency: 'MXN',
        language: 'es',
        timezone: 'America/Mexico_City',
      },
      microeconomicContext: args.microeconomicContext ?? {
        monthlyBudgetRange: 'medio',
        location: 'Ciudad',
        financialGoals: ['Ahorro para emergencias', 'Educación'],
        typicalExpenses: [
          { category: 'Vivienda', description: 'Renta o hipoteca' },
          { category: 'Alimentación', description: 'Supermercado y comidas' },
          { category: 'Transporte', description: 'Gasolina o transporte público' },
        ],
      },
    })

    // Crear usuario padre
    const parentId = await ctx.db.insert('users', {
      role: 'parent',
      name: args.parentName,
      email: args.parentEmail,
      avatarId: 'parent_default',
      familyId,
      createdAt: now,
    })

    return { familyId, parentId }
  },
})

// Agregar un niño a la familia
export const addChild = mutation({
  args: {
    familyId: v.id('families'),
    name: v.string(),
    age: v.number(),
    avatarId: v.string(),
    pin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    // Crear usuario niño
    const childId = await ctx.db.insert('users', {
      role: 'child',
      name: args.name,
      age: args.age,
      avatarId: args.avatarId,
      familyId: args.familyId,
      pin: args.pin ?? '1234',
      createdAt: now,
    })

    // Crear progreso inicial
    await ctx.db.insert('progress', {
      userId: childId,
      level: 1,
      xp: 0,
      totalXp: 0,
      streak: 0,
      lastActiveAt: now,
      completedLessons: [],
      achievements: [],
      financialStats: {
        savingsHabit: 10,
        spendingWisdom: 10,
        investmentKnowledge: 5,
        taxUnderstanding: 5,
        budgetingSkill: 10,
      },
    })

    return childId
  },
})

// Obtener usuario por ID
export const getUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId)
  },
})

// Obtener todos los niños de una familia
export const getChildrenByFamily = query({
  args: { familyId: v.id('families') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_family', (q) => q.eq('familyId', args.familyId))
      .filter((q) => q.eq(q.field('role'), 'child'))
      .collect()
  },
})

// Obtener familia con todos sus miembros
export const getFamilyWithMembers = query({
  args: { familyId: v.id('families') },
  handler: async (ctx, args) => {
    const family = await ctx.db.get(args.familyId)
    if (!family) return null

    const members = await ctx.db
      .query('users')
      .withIndex('by_family', (q) => q.eq('familyId', args.familyId))
      .collect()

    return { ...family, members }
  },
})

// Actualizar contexto microeconómico de la familia
export const updateMicroeconomicContext = mutation({
  args: {
    familyId: v.id('families'),
    microeconomicContext: v.object({
      monthlyBudgetRange: v.string(),
      location: v.string(),
      financialGoals: v.array(v.string()),
      typicalExpenses: v.array(v.object({
        category: v.string(),
        description: v.string(),
      })),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.familyId, {
      microeconomicContext: args.microeconomicContext,
    })
  },
})

// Validar PIN de niño
export const validateChildPin = query({
  args: {
    childId: v.id('users'),
    pin: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.childId)
    if (!user || user.role !== 'child') return false
    return user.pin === args.pin
  },
})
