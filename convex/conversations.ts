import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Crear nueva conversación
export const createConversation = mutation({
  args: {
    userId: v.id('users'),
    agentType: v.string(),
    title: v.string(),
    metadata: v.optional(v.object({
      topic: v.optional(v.string()),
      lessonId: v.optional(v.string()),
      simulationId: v.optional(v.id('simulations')),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    const conversationId = await ctx.db.insert('conversations', {
      userId: args.userId,
      agentType: args.agentType,
      title: args.title,
      createdAt: now,
      updatedAt: now,
      messages: [],
      metadata: args.metadata,
    })

    return conversationId
  },
})

// Agregar mensaje a conversación
export const addMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    role: v.union(v.literal('user'), v.literal('assistant'), v.literal('system')),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) return null

    const now = Date.now()

    const newMessage = {
      role: args.role,
      content: args.content,
      timestamp: now,
    }

    await ctx.db.patch(args.conversationId, {
      updatedAt: now,
      messages: [...conversation.messages, newMessage],
    })

    return newMessage
  },
})

// Obtener conversación por ID
export const getConversation = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId)
  },
})

// Obtener conversaciones de un usuario
export const getUserConversations = query({
  args: {
    userId: v.id('users'),
    agentType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('conversations')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))

    if (args.agentType) {
      query = ctx.db
        .query('conversations')
        .withIndex('by_user_agent', (q) =>
          q.eq('userId', args.userId).eq('agentType', args.agentType)
        )
    }

    const conversations = await query.order('desc').take(args.limit ?? 20)

    return conversations
  },
})

// Obtener la conversación más reciente con un agente
export const getLatestConversation = query({
  args: {
    userId: v.id('users'),
    agentType: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('conversations')
      .withIndex('by_user_agent', (q) =>
        q.eq('userId', args.userId).eq('agentType', args.agentType)
      )
      .order('desc')
      .first()
  },
})

// Eliminar conversación
export const deleteConversation = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.conversationId)
    return { success: true }
  },
})

// Actualizar título de conversación
export const updateTitle = mutation({
  args: {
    conversationId: v.id('conversations'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      title: args.title,
      updatedAt: Date.now(),
    })
    return { success: true }
  },
})
