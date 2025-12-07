import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Crear lección
export const createLesson = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    order: v.number(),
    ageRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    difficulty: v.union(v.literal('beginner'), v.literal('intermediate'), v.literal('advanced')),
    xpReward: v.number(),
    content: v.object({
      introduction: v.string(),
      sections: v.array(v.object({
        title: v.string(),
        content: v.string(),
        type: v.union(v.literal('text'), v.literal('interactive'), v.literal('quiz')),
      })),
      quiz: v.optional(v.array(v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctIndex: v.number(),
        explanation: v.string(),
      }))),
    }),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('lessons', {
      ...args,
      isActive: true,
    })
    return id
  },
})

// Obtener lecciones por categoría
export const getByCategory = query({
  args: {
    category: v.string(),
    ageFilter: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let lessons = await ctx.db
      .query('lessons')
      .withIndex('by_category', (q) => q.eq('category', args.category))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect()

    // Filtrar por edad si se proporciona
    if (args.ageFilter) {
      lessons = lessons.filter(
        (l) => l.ageRange.min <= args.ageFilter! && l.ageRange.max >= args.ageFilter!
      )
    }

    return lessons.sort((a, b) => a.order - b.order)
  },
})

// Obtener todas las lecciones disponibles para una edad
export const getForAge = query({
  args: { age: v.number() },
  handler: async (ctx, args) => {
    const lessons = await ctx.db
      .query('lessons')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect()

    return lessons
      .filter((l) => l.ageRange.min <= args.age && l.ageRange.max >= args.age)
      .sort((a, b) => a.order - b.order)
  },
})

// Obtener lección por ID
export const getById = query({
  args: { lessonId: v.id('lessons') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId)
  },
})

// Obtener siguiente lección recomendada
export const getNextRecommended = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Obtener usuario y progreso
    const user = await ctx.db.get(args.userId)
    if (!user || user.role !== 'child') return null

    const progress = await ctx.db
      .query('progress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) return null

    // Obtener todas las lecciones disponibles para la edad
    const lessons = await ctx.db
      .query('lessons')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect()

    const availableLessons = lessons
      .filter((l) => {
        const inAgeRange = l.ageRange.min <= (user.age ?? 8) && l.ageRange.max >= (user.age ?? 8)
        const notCompleted = !progress.completedLessons.includes(l._id)
        return inAgeRange && notCompleted
      })
      .sort((a, b) => a.order - b.order)

    return availableLessons[0] ?? null
  },
})

// Actualizar lección
export const updateLesson = mutation({
  args: {
    lessonId: v.id('lessons'),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      xpReward: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.lessonId, args.updates)
    return { success: true }
  },
})

// Obtener categorías disponibles
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const lessons = await ctx.db.query('lessons').collect()
    const categories = [...new Set(lessons.map((l) => l.category))]
    return categories
  },
})
