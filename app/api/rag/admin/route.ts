import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// POST /api/rag/admin - Ejecutar acciones administrativas
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'seed': {
        // Sembrar datos iniciales (sin embeddings)
        const result = await convex.mutation(api.seed.seedKnowledgeBase, {})
        return NextResponse.json(result)
      }

      case 'generate-embeddings': {
        // Generar embeddings para documentos que no tienen
        const result = await convex.action(api.knowledge.generateAllEmbeddings, {})
        return NextResponse.json(result)
      }

      case 'seed-and-embed': {
        // Sembrar y generar embeddings en un solo paso
        const result = await convex.action(api.seed.seedAndEmbed, {})
        return NextResponse.json(result)
      }

      case 'clear': {
        // Limpiar toda la base de conocimiento
        const result = await convex.mutation(api.knowledge.clearAll, {})
        return NextResponse.json(result)
      }

      case 'stats': {
        // Obtener estadísticas
        const stats = await convex.query(api.knowledge.getStats, {})
        return NextResponse.json({ stats })
      }

      default:
        return NextResponse.json(
          {
            error: 'Acción no reconocida',
            availableActions: ['seed', 'generate-embeddings', 'seed-and-embed', 'clear', 'stats'],
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error en admin RAG:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

    return NextResponse.json(
      { error: 'Error ejecutando acción', details: errorMessage },
      { status: 500 }
    )
  }
}

// GET /api/rag/admin - Obtener estado y documentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') ?? 'stats'

    switch (view) {
      case 'stats': {
        const stats = await convex.query(api.knowledge.getStats, {})
        return NextResponse.json({ stats })
      }

      case 'all': {
        const limit = parseInt(searchParams.get('limit') ?? '50')
        const documents = await convex.query(api.knowledge.getAll, { limit })
        return NextResponse.json({
          documents,
          count: documents.length,
        })
      }

      case 'category': {
        const category = searchParams.get('category')
        if (!category) {
          return NextResponse.json({ error: 'Se requiere parámetro category' }, { status: 400 })
        }
        const documents = await convex.query(api.knowledge.getByCategory, {
          category,
          limit: 50,
        })
        return NextResponse.json({ documents, count: documents.length })
      }

      default:
        return NextResponse.json(
          { error: 'Vista no reconocida', availableViews: ['stats', 'all', 'category'] },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error en GET admin RAG:', error)
    return NextResponse.json({ error: 'Error obteniendo datos' }, { status: 500 })
  }
}
