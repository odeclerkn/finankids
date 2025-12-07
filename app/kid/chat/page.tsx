'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/chat/chat-interface'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const SUGGESTIONS = [
  '¿Qué es el ahorro?',
  '¿Cómo puedo ganar dinero?',
  '¿Qué son los impuestos?',
  '¿Cómo funciona un banco?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock context - en producción vendría de Convex
  const mockContext = {
    userId: 'user123',
    userName: 'Sofía',
    userAge: 9,
    familyContext: {
      monthlyBudgetRange: 'medio',
      location: 'Ciudad de México',
      financialGoals: ['Ahorro para vacaciones', 'Fondo de emergencia'],
      typicalExpenses: [
        { category: 'Vivienda', description: 'Renta mensual' },
        { category: 'Alimentación', description: 'Supermercado' },
      ],
    },
    progress: {
      level: 5,
      xp: 75,
      streak: 5,
      completedLessons: ['ahorro_basico'],
      financialStats: {
        savingsHabit: 65,
        spendingWisdom: 45,
        investmentKnowledge: 30,
        taxUnderstanding: 20,
        budgetingSkill: 55,
      },
    },
    conversationHistory: messages,
  }

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'tutor',
          message: content,
          context: {
            ...mockContext,
            conversationHistory: [...messages, userMessage],
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      // Fallback response for demo
      const fallbackMessage: Message = {
        role: 'assistant',
        content: `¡Hola! 🐷 Gracias por tu pregunta sobre "${content}".

Como tu amigo Finu, me encanta ayudarte a aprender sobre el dinero.

Para darte una respuesta completa, necesito que configures tu clave de OpenRouter. ¡Mientras tanto, puedes explorar las lecciones en la sección "Aprender"!

¿Hay algo más en lo que pueda ayudarte? ✨`,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-200px)] lg:h-[calc(100vh-120px)]">
      <ChatInterface
        agentName="Finu"
        agentEmoji="🐷"
        agentDescription="Tu tutor financiero amigable"
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        suggestions={SUGGESTIONS}
      />
    </div>
  )
}
