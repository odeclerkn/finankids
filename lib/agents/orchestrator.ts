import { AGENT_CONFIGS, interpolatePrompt } from './config'
import { chatCompletion, streamChatCompletion } from './openrouter'
import { AgentContext, AgentResponse, AgentType, Message } from './types'

interface RagResult {
  id: string
  content: string
  category: string
  title: string
  difficulty: string
  ageRange: { min: number; max: number }
}

export class AgentOrchestrator {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  }

  /**
   * Busca contexto relevante en la base de conocimiento RAG
   */
  private async queryRAG(query: string, userAge: number): Promise<RagResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/rag/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          age: userAge,
          limit: 3,
        }),
      })

      if (!response.ok) {
        console.warn('RAG search failed:', await response.text())
        return []
      }

      const data = await response.json()
      return data.results ?? []
    } catch (error) {
      console.warn('Error querying RAG:', error)
      return []
    }
  }

  /**
   * Formatea los resultados de RAG para incluir en el prompt
   */
  private formatRAGContext(results: RagResult[]): string {
    if (results.length === 0) {
      return 'No se encontró información adicional relevante.'
    }

    return results
      .map((r, i) => `[${i + 1}] ${r.category.toUpperCase()} - ${r.title}\n${r.content}`)
      .join('\n\n---\n\n')
  }

  /**
   * Chat con un agente (sin streaming)
   */
  async chat(
    agentType: AgentType,
    userMessage: string,
    context: AgentContext
  ): Promise<AgentResponse> {
    const config = AGENT_CONFIGS[agentType]

    // Obtener contexto RAG si está habilitado
    let ragContext = ''
    if (config.useRag) {
      const ragResults = await this.queryRAG(userMessage, context.userAge)
      ragContext = this.formatRAGContext(ragResults)
    }

    // Construir el prompt del sistema con contexto
    const systemPrompt = this.buildSystemPrompt(agentType, context, ragContext)

    // Preparar mensajes
    const messages: Message[] = [
      ...context.conversationHistory,
      { role: 'user', content: userMessage },
    ]

    // Llamar a OpenRouter
    const response = await chatCompletion(messages, systemPrompt, {
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    })

    // Procesar respuesta
    return this.processResponse(response, agentType)
  }

  /**
   * Chat con streaming
   */
  async streamChat(
    agentType: AgentType,
    userMessage: string,
    context: AgentContext,
    onChunk: (chunk: string) => void
  ): Promise<AgentResponse> {
    const config = AGENT_CONFIGS[agentType]

    // Obtener contexto RAG
    let ragContext = ''
    if (config.useRag) {
      const ragResults = await this.queryRAG(userMessage, context.userAge)
      ragContext = this.formatRAGContext(ragResults)
    }

    const systemPrompt = this.buildSystemPrompt(agentType, context, ragContext)

    const messages: Message[] = [
      ...context.conversationHistory,
      { role: 'user', content: userMessage },
    ]

    const response = await streamChatCompletion(
      messages,
      systemPrompt,
      {
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      },
      onChunk
    )

    return this.processResponse(response, agentType)
  }

  /**
   * Construye el prompt del sistema con todo el contexto
   */
  private buildSystemPrompt(
    agentType: AgentType,
    context: AgentContext,
    ragContext: string
  ): string {
    const config = AGENT_CONFIGS[agentType]

    const templateContext: Record<string, unknown> = {
      userName: context.userName,
      userAge: context.userAge,
      level: context.progress.level,
      streak: context.progress.streak,
      familyContext: JSON.stringify(context.familyContext, null, 2),
      savingsHabit: context.progress.financialStats.savingsHabit,
      spendingWisdom: context.progress.financialStats.spendingWisdom,
      investmentKnowledge: context.progress.financialStats.investmentKnowledge,
      taxUnderstanding: context.progress.financialStats.taxUnderstanding,
      budgetingSkill: context.progress.financialStats.budgetingSkill,
      completedLessons: context.progress.completedLessons.join(', ') || 'Ninguna aún',
      financialStats: JSON.stringify(context.progress.financialStats, null, 2),
      ragContext: ragContext || 'No hay información adicional disponible.',
    }

    // Agregar contexto de simulación si existe
    if (context.simulationState) {
      Object.assign(templateContext, {
        virtualAge: context.simulationState.virtualAge,
        currentMonth: context.simulationState.currentMonth,
        currentYear: context.simulationState.currentYear,
        job: context.simulationState.job
          ? `${context.simulationState.job.title} en ${context.simulationState.job.company} ($${context.simulationState.job.monthlySalary}/mes)`
          : 'Sin empleo',
        cash: context.simulationState.finances.cash,
        savings: context.simulationState.finances.savings,
        debt: context.simulationState.finances.debt,
        expenses: 'Ver detalles en el juego',
      })
    }

    return interpolatePrompt(config.systemPrompt, templateContext)
  }

  /**
   * Procesa la respuesta del LLM
   */
  private processResponse(response: string, agentType: AgentType): AgentResponse {
    // Extraer sugerencias si las hay (marcadas con [SUGERENCIA])
    const suggestions: string[] = []
    const suggestionRegex = /\[SUGERENCIA\](.*?)\[\/SUGERENCIA\]/g
    let match
    while ((match = suggestionRegex.exec(response)) !== null) {
      suggestions.push(match[1].trim())
    }

    // Limpiar el contenido de las marcas de sugerencia
    const content = response.replace(/\[SUGERENCIA\].*?\[\/SUGERENCIA\]/g, '').trim()

    // Calcular XP ganado basado en el tipo de interacción
    let xpGained = 5 // XP base por interacción
    if (agentType === 'tutor') {
      // Más XP si la respuesta es educativa
      if (content.includes('¿Sabías que') || content.includes('Dato curioso')) {
        xpGained += 5
      }
    } else if (agentType === 'simulator') {
      xpGained = 10 // Más XP por usar el simulador
    }

    return {
      content,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      xpGained,
    }
  }
}

// Instancia singleton
export const agentOrchestrator = new AgentOrchestrator()
