'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatInterfaceProps {
  agentName: string
  agentEmoji: string
  agentDescription: string
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
}

export function ChatInterface({
  agentName,
  agentEmoji,
  agentDescription,
  messages,
  isLoading,
  onSendMessage,
  suggestions = [],
  onSuggestionClick,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion)
    } else {
      onSendMessage(suggestion)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-4xl"
          >
            {agentEmoji}
          </motion.div>
          <div>
            <h2 className="font-display font-bold text-gray-800">{agentName}</h2>
            <p className="text-sm text-gray-500">{agentDescription}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-4"
            >
              {agentEmoji}
            </motion.div>
            <p className="text-gray-600 font-display">
              ¡Hola! Soy {agentName}. ¿En qué puedo ayudarte hoy?
            </p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-kid-purple to-kid-pink text-white rounded-br-none'
                    : 'bg-white shadow-md rounded-bl-none'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{agentEmoji}</span>
                    <span className="text-xs font-medium text-kid-purple">
                      {agentName}
                    </span>
                  </div>
                )}
                <p
                  className={cn(
                    'whitespace-pre-wrap',
                    message.role === 'user' ? 'text-white' : 'text-gray-700'
                  )}
                >
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white shadow-md rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{agentEmoji}</span>
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-kid-purple rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-kid-pink rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-kid-yellow rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length === 0 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Sugerencias
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm bg-white border border-orange-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-orange-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white/80 backdrop-blur-sm border-t border-orange-100"
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-white border-2 border-orange-200 rounded-full focus:outline-none focus:border-kid-purple transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-all',
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-kid-purple to-kid-pink text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-400'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
