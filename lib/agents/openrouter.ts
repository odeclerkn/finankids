import { Message } from './types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_EMBEDDINGS_URL = 'https://openrouter.ai/api/v1/embeddings'

interface OpenRouterConfig {
  model: string
  temperature: number
  maxTokens: number
}

interface ChatCompletionResponse {
  id: string
  choices: {
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface EmbeddingResponse {
  data: {
    embedding: number[]
    index: number
  }[]
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}

export async function chatCompletion(
  messages: Message[],
  systemPrompt: string,
  config: OpenRouterConfig
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY no está configurada')
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'FinanKids',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
  }

  const data: ChatCompletionResponse = await response.json()

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Respuesta vacía de OpenRouter')
  }

  return data.choices[0].message.content
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY no está configurada')
  }

  const response = await fetch(OPENROUTER_EMBEDDINGS_URL, {
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
    const error = await response.text()
    throw new Error(`OpenRouter Embeddings error: ${response.status} - ${error}`)
  }

  const data: EmbeddingResponse = await response.json()

  if (!data.data?.[0]?.embedding) {
    throw new Error('No se pudo generar el embedding')
  }

  return data.data[0].embedding
}

export async function streamChatCompletion(
  messages: Message[],
  systemPrompt: string,
  config: OpenRouterConfig,
  onChunk: (chunk: string) => void
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY no está configurada')
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'FinanKids',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No se pudo obtener el reader del stream')
  }

  const decoder = new TextDecoder()
  let fullContent = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6) // Remove 'data: ' prefix
      if (data === '[DONE]') continue

      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content
        if (content) {
          fullContent += content
          onChunk(content)
        }
      } catch {
        // Ignorar errores de parsing en chunks incompletos
      }
    }
  }

  return fullContent
}
