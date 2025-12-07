import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // Familias (agrupa padres e hijos)
  families: defineTable({
    name: v.string(),
    createdAt: v.number(),
    settings: v.object({
      currency: v.string(),
      language: v.string(),
      timezone: v.string(),
    }),
    microeconomicContext: v.object({
      monthlyBudgetRange: v.string(), // "bajo", "medio", "alto"
      location: v.string(),
      financialGoals: v.array(v.string()),
      typicalExpenses: v.array(v.object({
        category: v.string(),
        description: v.string(),
      })),
    }),
  }),

  // Usuarios (padres e hijos)
  users: defineTable({
    clerkId: v.optional(v.string()), // Para auth con Clerk (futuro)
    email: v.optional(v.string()),
    role: v.union(v.literal('child'), v.literal('parent')),
    name: v.string(),
    avatarId: v.string(),
    familyId: v.id('families'),
    // Solo para niños
    age: v.optional(v.number()),
    pin: v.optional(v.string()), // PIN simple para acceso de niños
    createdAt: v.number(),
  }).index('by_family', ['familyId'])
    .index('by_email', ['email']),

  // Progreso del niño en el aprendizaje
  progress: defineTable({
    userId: v.id('users'),
    level: v.number(),
    xp: v.number(),
    totalXp: v.number(),
    streak: v.number(), // Días consecutivos
    lastActiveAt: v.number(),
    completedLessons: v.array(v.string()),
    achievements: v.array(v.object({
      id: v.string(),
      name: v.string(),
      unlockedAt: v.number(),
    })),
    financialStats: v.object({
      savingsHabit: v.number(),      // 0-100
      spendingWisdom: v.number(),    // 0-100
      investmentKnowledge: v.number(), // 0-100
      taxUnderstanding: v.number(),    // 0-100
      budgetingSkill: v.number(),      // 0-100
    }),
  }).index('by_user', ['userId']),

  // Simulación de vida adulta
  simulations: defineTable({
    userId: v.id('users'),
    name: v.string(), // Nombre de la simulación
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    // Estado de la simulación
    state: v.object({
      virtualAge: v.number(),         // Edad en simulación (18-65)
      currentMonth: v.number(),       // Mes actual (1-12)
      currentYear: v.number(),        // Año de simulación
      job: v.optional(v.object({
        title: v.string(),
        company: v.string(),
        monthlySalary: v.number(),
        satisfaction: v.number(),
      })),
      finances: v.object({
        cash: v.number(),
        savings: v.number(),
        debt: v.number(),
        creditScore: v.number(),
      }),
      investments: v.array(v.object({
        type: v.string(),
        name: v.string(),
        amount: v.number(),
        purchasePrice: v.number(),
        currentPrice: v.number(),
        purchaseDate: v.number(),
      })),
      monthlyExpenses: v.array(v.object({
        category: v.string(),
        name: v.string(),
        amount: v.number(),
        isFixed: v.boolean(),
      })),
      assets: v.array(v.object({
        type: v.string(),
        name: v.string(),
        value: v.number(),
        purchaseDate: v.number(),
      })),
      lifeEvents: v.array(v.object({
        type: v.string(),
        description: v.string(),
        impact: v.string(),
        occurredAt: v.number(),
      })),
    }),
  }).index('by_user', ['userId'])
    .index('by_user_active', ['userId', 'isActive']),

  // Conversaciones con agentes IA
  conversations: defineTable({
    userId: v.id('users'),
    agentType: v.string(), // 'tutor', 'simulator', 'advisor'
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    messages: v.array(v.object({
      role: v.union(v.literal('user'), v.literal('assistant'), v.literal('system')),
      content: v.string(),
      timestamp: v.number(),
    })),
    metadata: v.optional(v.object({
      topic: v.optional(v.string()),
      lessonId: v.optional(v.string()),
      simulationId: v.optional(v.id('simulations')),
    })),
  }).index('by_user', ['userId'])
    .index('by_user_agent', ['userId', 'agentType']),

  // Base de conocimiento para RAG
  knowledgeBase: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    tags: v.array(v.string()),
    ageRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    difficulty: v.union(v.literal('beginner'), v.literal('intermediate'), v.literal('advanced')),
    embedding: v.optional(v.array(v.float64())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_category', ['category'])
    .index('by_difficulty', ['difficulty'])
    .vectorIndex('by_embedding', {
      vectorField: 'embedding',
      dimensions: 1536,
      filterFields: ['category', 'difficulty'],
    }),

  // Lecciones/Misiones
  lessons: defineTable({
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
    isActive: v.boolean(),
  }).index('by_category', ['category'])
    .index('by_order', ['order']),

  // Misiones/Retos diarios
  missions: defineTable({
    userId: v.id('users'),
    type: v.string(),
    title: v.string(),
    description: v.string(),
    xpReward: v.number(),
    status: v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed'), v.literal('expired')),
    progress: v.number(), // 0-100
    createdAt: v.number(),
    expiresAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index('by_user', ['userId'])
    .index('by_user_status', ['userId', 'status']),
})
