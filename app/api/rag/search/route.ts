import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

// Cliente HTTP de Convex para server-side
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

interface SearchParams {
  query: string
  age?: number
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  limit?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchParams = await request.json()
    const { query, age, limit = 5 } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro query' },
        { status: 400 }
      )
    }

    // Usar la action de Convex para búsqueda RAG
    const results = await convex.action(api.knowledge.searchRAG, {
      query,
      limit,
      ageFilter: age,
    })

    return NextResponse.json({
      results,
      source: 'convex',
      count: results.length,
    })
  } catch (error) {
    console.error('Error en búsqueda RAG:', error)

    // Si Convex falla, dar mensaje de error útil
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

    return NextResponse.json(
      {
        error: 'Error al realizar la búsqueda RAG',
        details: errorMessage,
        hint: 'Asegúrate de que Convex esté corriendo y la base de conocimiento tenga datos con embeddings.',
      },
      { status: 500 }
    )
  }
}

// Endpoint para obtener estadísticas
export async function GET() {
  try {
    const stats = await convex.query(api.knowledge.getStats, {})

    return NextResponse.json({
      stats,
      status: 'ok',
    })
  } catch (error) {
    console.error('Error obteniendo stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
