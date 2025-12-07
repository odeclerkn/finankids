import { NextRequest } from 'next/server'
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
      return new Response(
        JSON.stringify({ error: 'Faltan parámetros requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Crear un stream de respuesta
    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    // Procesar en background
    ;(async () => {
      try {
        const response = await agentOrchestrator.streamChat(
          agentType,
          message,
          context,
          async (chunk) => {
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)
            )
          }
        )

        // Enviar respuesta final con metadata
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, ...response })}\n\n`
          )
        )
      } catch (error) {
        console.error('Error en streaming:', error)
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ error: 'Error en el streaming' })}\n\n`
          )
        )
      } finally {
        await writer.close()
      }
    })()

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error iniciando stream:', error)
    return new Response(
      JSON.stringify({ error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
