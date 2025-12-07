import { v } from 'convex/values'
import { mutation, query, action, internalMutation, internalQuery } from './_generated/server'
import { internal } from './_generated/api'
import { Id } from './_generated/dataModel'

// ============================================
// MUTATIONS
// ============================================

// Agregar conocimiento a la base (sin embedding)
export const addKnowledge = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    const id = await ctx.db.insert('knowledgeBase', {
      ...args,
      embedding: undefined,
      createdAt: now,
      updatedAt: now,
    })

    return id
  },
})

// Agregar conocimiento con embedding ya generado
export const addKnowledgeWithEmbedding = mutation({
  args: {
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
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    const id = await ctx.db.insert('knowledgeBase', {
      ...args,
      createdAt: now,
      updatedAt: now,
    })

    return id
  },
})

// Actualizar embedding de un conocimiento (internal)
export const updateEmbedding = internalMutation({
  args: {
    id: v.id('knowledgeBase'),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      embedding: args.embedding,
      updatedAt: Date.now(),
    })
  },
})

// Eliminar conocimiento
export const deleteKnowledge = mutation({
  args: { id: v.id('knowledgeBase') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return { success: true }
  },
})

// Limpiar toda la base de conocimiento
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('knowledgeBase').collect()
    for (const item of all) {
      await ctx.db.delete(item._id)
    }
    return { deleted: all.length }
  },
})

// ============================================
// QUERIES
// ============================================

// Buscar conocimiento por categoría
export const getByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('knowledgeBase')
      .withIndex('by_category', (q) => q.eq('category', args.category))
      .take(args.limit ?? 20)
  },
})

// Búsqueda vectorial para RAG
export const searchByVector = query({
  args: {
    embedding: v.array(v.float64()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('knowledgeBase')
      .withIndex('by_embedding', (q) => q.vector(args.embedding, args.limit ?? 5))
      .collect()

    return results
  },
})

// Búsqueda vectorial con filtros (internal para action)
export const searchByVectorInternal = internalQuery({
  args: {
    embedding: v.array(v.float64()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('knowledgeBase')
      .withIndex('by_embedding', (q) => q.vector(args.embedding, args.limit ?? 5))
      .collect()

    return results
  },
})

// Obtener todo el conocimiento
export const getAll = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('knowledgeBase')
      .order('desc')
      .take(args.limit ?? 100)
  },
})

// Obtener conocimiento por ID
export const getById = query({
  args: { id: v.id('knowledgeBase') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Obtener documentos sin embedding
export const getWithoutEmbedding = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query('knowledgeBase')
      .take(args.limit ?? 100)

    return all.filter(doc => !doc.embedding || doc.embedding.length === 0)
  },
})

// Obtener estadísticas de la base de conocimiento
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('knowledgeBase').collect()

    const byCategory: Record<string, number> = {}
    const byDifficulty: Record<string, number> = {}
    let withEmbeddings = 0

    for (const item of all) {
      byCategory[item.category] = (byCategory[item.category] ?? 0) + 1
      byDifficulty[item.difficulty] = (byDifficulty[item.difficulty] ?? 0) + 1
      if (item.embedding && item.embedding.length > 0) withEmbeddings++
    }

    return {
      total: all.length,
      byCategory,
      byDifficulty,
      withEmbeddings,
      withoutEmbeddings: all.length - withEmbeddings,
    }
  },
})

// ============================================
// ACTIONS (con llamadas HTTP externas)
// ============================================

// Generar embedding para un documento específico
export const generateEmbedding = action({
  args: {
    knowledgeId: v.id('knowledgeBase'),
  },
  handler: async (ctx, args) => {
    // Obtener el documento
    const doc = await ctx.runQuery(internal.knowledge.getByIdInternal, {
      id: args.knowledgeId,
    })

    if (!doc) {
      throw new Error('Documento no encontrado')
    }

    // Generar embedding con OpenRouter
    const textToEmbed = `${doc.title}\n\n${doc.content}`
    const embedding = await generateEmbeddingFromOpenRouter(textToEmbed)

    // Guardar embedding
    await ctx.runMutation(internal.knowledge.updateEmbedding, {
      id: args.knowledgeId,
      embedding,
    })

    return { success: true, documentId: args.knowledgeId }
  },
})

// Generar embeddings para todos los documentos sin embedding
export const generateAllEmbeddings = action({
  args: {},
  handler: async (ctx) => {
    const docsWithoutEmbedding = await ctx.runQuery(
      internal.knowledge.getWithoutEmbedding,
      { limit: 50 }
    )

    let processed = 0
    let errors = 0

    for (const doc of docsWithoutEmbedding) {
      try {
        const textToEmbed = `${doc.title}\n\n${doc.content}`
        const embedding = await generateEmbeddingFromOpenRouter(textToEmbed)

        await ctx.runMutation(internal.knowledge.updateEmbedding, {
          id: doc._id,
          embedding,
        })

        processed++

        // Rate limiting - esperar 100ms entre llamadas
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error generando embedding para ${doc._id}:`, error)
        errors++
      }
    }

    return {
      processed,
      errors,
      remaining: docsWithoutEmbedding.length - processed,
    }
  },
})

// Búsqueda semántica RAG completa
export const searchRAG = action({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    ageFilter: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Generar embedding de la consulta
    const queryEmbedding = await generateEmbeddingFromOpenRouter(args.query)

    // 2. Buscar documentos similares
    const results = await ctx.runQuery(internal.knowledge.searchByVectorInternal, {
      embedding: queryEmbedding,
      limit: (args.limit ?? 5) * 2, // Traer más para filtrar
    })

    // 3. Filtrar por edad si se especifica
    let filteredResults = results
    if (args.ageFilter) {
      filteredResults = results.filter(
        (doc) => doc.ageRange.min <= args.ageFilter! && doc.ageRange.max >= args.ageFilter!
      )
    }

    // 4. Tomar solo los necesarios
    const finalResults = filteredResults.slice(0, args.limit ?? 5)

    // 5. Formatear respuesta
    return finalResults.map((doc) => ({
      id: doc._id,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      difficulty: doc.difficulty,
      ageRange: doc.ageRange,
    }))
  },
})

// Agregar documento con generación automática de embedding
export const addKnowledgeAndEmbed = action({
  args: {
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
  },
  handler: async (ctx, args) => {
    // 1. Generar embedding
    const textToEmbed = `${args.title}\n\n${args.content}`
    const embedding = await generateEmbeddingFromOpenRouter(textToEmbed)

    // 2. Guardar documento con embedding
    const id = await ctx.runMutation(internal.knowledge.addKnowledgeInternal, {
      ...args,
      embedding,
    })

    return { id, success: true }
  },
})

// ============================================
// INTERNAL HELPERS
// ============================================

export const getByIdInternal = internalQuery({
  args: { id: v.id('knowledgeBase') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const addKnowledgeInternal = internalMutation({
  args: {
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
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    const id = await ctx.db.insert('knowledgeBase', {
      ...args,
      createdAt: now,
      updatedAt: now,
    })

    return id
  },
})

// ============================================
// FUNCIÓN HELPER PARA OPENROUTER
// ============================================

async function generateEmbeddingFromOpenRouter(text: string): Promise<number[]> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY no está configurada en las variables de entorno de Convex')
  }

  const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/text-embedding-3-small',
      input: text,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  if (!data.data?.[0]?.embedding) {
    throw new Error('No se pudo generar el embedding')
  }

  return data.data[0].embedding
}
