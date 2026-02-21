'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Loader2, Bot, User } from 'lucide-react'
import { FormData } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { trackEmailCapture, trackAnalysisSubmission } from '@/lib/tracking'
import { TypingIndicator } from './TypingIndicator'
import { StreamingText } from './StreamingText'
import Confetti from 'react-confetti'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatAgentProps {
  onComplete?: (data: FormData) => void
}

export function ChatAgent({ onComplete }: ChatAgentProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! 👋 Sou o PRISMA.\nA maioria das pessoas que testam IA falha pelos mesmos 3 motivos. Em 2 minutos, vou diagnosticar qual é o seu.\nPrimeiro, qual sua profissão?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Send to chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          formData,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erro ao processar mensagem')
      }

      // Update form data with extracted information
      if (data.extractedData && Object.keys(data.extractedData).length > 0) {
        const newData = { ...formData, ...data.extractedData }
        setFormData(newData)

        // Track lead capture if email was just collected
        if (data.leadSaved && newData.email && newData.fullName) {
          trackEmailCapture(newData.email, newData.fullName)
        }
      }

      // Update progress
      if (data.progress !== undefined) {
        setProgress(data.progress)
      }

      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      // If conversation is complete, trigger analysis
      if (data.completed) {
        setShowConfetti(true)

        // Celebration message
        const celebrationMessage: Message = {
          role: 'assistant',
          content: '🎉 Diagnóstico completo! Gerando seu relatório...',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, celebrationMessage])

        // Wait 2 seconds with confetti before analyzing
        setTimeout(async () => {
          setIsAnalyzing(true)
          const finalData = { ...formData, ...data.extractedData } as FormData

          // Call analyze API
          const analysisResponse = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData),
          })

          const analysisData = await analysisResponse.json()

          if (!analysisData.success) {
            throw new Error(analysisData.error || 'Erro ao gerar diagnóstico')
          }

          // Store results in sessionStorage
          sessionStorage.setItem('prisma-analysis', JSON.stringify(analysisData.analysis))

          // Track analysis submission
          trackAnalysisSubmission({
            formData: finalData as any,
            analysis: analysisData.analysis,
          })

          // Generate personalized guide
          try {
            // Extract profession from conversation (first user message after greeting)
            const userMessages = messages.filter(m => m.role === 'user')
            const professionMessage = userMessages.length > 0 ? userMessages[0].content : ''

            const guideResponse = await fetch('/api/generate-guide', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                profession: professionMessage, // First user response (profession)
                classification: analysisData.analysis.classification,
                conversationHistory: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
              }),
            })

            const guideData = await guideResponse.json()

            if (guideData.success) {
              // Store guide in sessionStorage
              const guideId = Date.now().toString()
              sessionStorage.setItem(`guide-${guideId}`, JSON.stringify(guideData.guide))
              sessionStorage.setItem('latest-guide-id', guideId)
            }
          } catch (guideError) {
            console.error('Guide generation error:', guideError)
            // Don't block navigation if guide generation fails
          }

          // Navigate to results
          router.push('/results')
        }, 2000)
      }
    } catch (err) {
      console.error('Chat error:', err)
      setError(err instanceof Error ? err.message : 'Erro ao processar mensagem')

      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Pode tentar novamente? Se o problema persistir, tente recarregar a página.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // Auto-focus input after response
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Confetti celebration */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      {/* Progress Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progresso do Diagnóstico</span>
            <span className="text-sm font-semibold text-blue-400">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: index > 0 ? 0.05 : 0
                }}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <motion.div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'assistant'
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                  animate={message.role === 'assistant' ? { scale: [1, 1.08, 1] } : undefined}
                  transition={message.role === 'assistant' ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </motion.div>

                {/* Message Bubble */}
                <div
                  className={`flex-1 max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-lg ${
                      message.role === 'assistant'
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <StreamingText text={message.content} speed={15} />
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 px-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <motion.div
                className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bot className="w-5 h-5" />
              </motion.div>
              <div className="bg-slate-800 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <TypingIndicator />
                  <span className="text-sm text-slate-400">
                    {isAnalyzing ? 'Gerando seu diagnóstico...' : 'Digitando...'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-950/20 border border-red-500 rounded-lg p-4 text-red-400 text-sm"
            >
              <strong>Erro:</strong> {error}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isAnalyzing}
              placeholder={isAnalyzing ? 'Gerando diagnóstico...' : 'Digite sua mensagem...'}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isAnalyzing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 border border-blue-500"
            >
              {isLoading || isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Pressione Enter para enviar • Shift+Enter para quebra de linha
          </p>
        </div>
      </div>
    </div>
  )
}
