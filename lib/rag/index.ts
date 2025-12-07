import { generateEmbedding } from '../agents/openrouter'

interface KnowledgeItem {
  _id: string
  title: string
  content: string
  category: string
  subcategory?: string
  tags: string[]
  ageRange: { min: number; max: number }
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  embedding?: number[]
}

interface SearchResult {
  item: KnowledgeItem
  score: number
}

export class RAGService {
  private convexClient: {
    query: (fn: unknown, args: unknown) => Promise<unknown>
    mutation: (fn: unknown, args: unknown) => Promise<unknown>
  } | null = null

  setConvexClient(client: typeof this.convexClient) {
    this.convexClient = client
  }

  async generateAndStoreEmbedding(knowledgeId: string, content: string): Promise<void> {
    if (!this.convexClient) {
      throw new Error('Convex client no configurado')
    }

    const embedding = await generateEmbedding(content)

    // Actualizar en Convex
    // Esta llamada se hará desde el API route
    return
  }

  async searchSimilar(
    query: string,
    options: {
      age?: number
      category?: string
      difficulty?: 'beginner' | 'intermediate' | 'advanced'
      limit?: number
    } = {}
  ): Promise<SearchResult[]> {
    const { age, category, difficulty, limit = 5 } = options

    // Generar embedding de la consulta
    const queryEmbedding = await generateEmbedding(query)

    // La búsqueda vectorial se hace a través del API de Convex
    // Por ahora retornamos un placeholder
    return []
  }

  formatContextForPrompt(results: SearchResult[]): string {
    if (results.length === 0) {
      return 'No se encontró información relevante en la base de conocimiento.'
    }

    return results
      .map((r, i) => {
        const { item, score } = r
        return `[${i + 1}] ${item.category} - ${item.title} (relevancia: ${Math.round(score * 100)}%)\n${item.content}`
      })
      .join('\n\n---\n\n')
  }
}

// Calcular similitud coseno entre dos vectores
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Los vectores deben tener la misma dimensión')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export const ragService = new RAGService()
