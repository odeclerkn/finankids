import { NextRequest, NextResponse } from 'next/server'
import { agentOrchestrator, AgentType, AgentContext } from '@/lib/agents'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      agentType,
      message,
      context,
    }: {
      agentType: AgentType
      message: string
      context: AgentContext
    } = body

    if (!agentType || !message || !context) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos: agentType, message, context' },
        { status: 400 }
      )
    }

    if (!['tutor', 'simulator', 'advisor'].includes(agentType)) {
      return NextResponse.json(
        { error: 'Tipo de agente inválido' },
        { status: 400 }
      )
    }

    const response = await agentOrchestrator.chat(agentType, message, context)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error en chat con agente:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
