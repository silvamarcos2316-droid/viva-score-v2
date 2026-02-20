'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChatAgent } from '@/components/ChatAgent'
import { Sparkles } from 'lucide-react'
import { trackPageView } from '@/lib/tracking'

export default function CalculadoraChatPage() {
  // Track page view on mount
  useEffect(() => {
    trackPageView('/calculadora-chat')
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Header */}
      <div className="relative z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-sm border border-slate-700 mb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Diagnóstico Conversacional com IA</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
              PRISMA
            </h1>
            <p className="text-sm md:text-base text-slate-400 font-light">
              Converse com nosso assistente de IA para obter seu diagnóstico personalizado
            </p>
          </motion.div>
        </div>
      </div>

      {/* Chat Agent - takes remaining height */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col min-h-0"
        >
          <ChatAgent />
        </motion.div>
      </div>

      {/* Footer hint */}
      <div className="relative z-10 bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/50 px-4 py-2">
        <p className="text-xs text-slate-500 text-center max-w-4xl mx-auto">
          🔒 Suas informações são confidenciais e usadas apenas para gerar seu diagnóstico PRISMA
        </p>
      </div>
    </div>
  )
}
