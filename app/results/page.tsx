'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AnalysisResult } from '@/lib/types'
import { getClassificationLabel, getClassificationColor } from '@/lib/scoring'
import { EmailCaptureModal } from '@/components/EmailCaptureModal'
import { trackPageView } from '@/lib/tracking'
import { PrismBackground } from '@/components/ui/PrismBackground'
import { GlassCard } from '@/components/ui/GlassCard'
import { PrismIcon } from '@/components/ui/PrismIcon'

export default function ResultsPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('prisma-analysis')
    if (!stored) {
      router.push('/calculator')
      return
    }
    setAnalysis(JSON.parse(stored))
    trackPageView('/results')
  }, [router])

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <PrismBackground />
        <div className="relative z-10">
          <PrismIcon size="md" animate={true} />
        </div>
      </div>
    )
  }

  const { scores, classification, risks, strengths, nextSteps, questions, missingInfo } = analysis

  const handleEmailSubmit = async (email: string, name: string) => {
    // TODO: Send email via API
    console.log('Email submitted:', { email, name, analysis })
    setEmailSent(true)

    // Simular envio
    alert(`Relatório enviado para ${email}! Verifique sua caixa de entrada.`)
  }

  const whatsappGroupLink = 'https://chat.whatsapp.com/SEU_LINK_AQUI'
  const telegramGroupLink = 'https://t.me/SEU_GRUPO_AQUI'

  // Check for personalized guide
  const latestGuideId = typeof window !== 'undefined' ? sessionStorage.getItem('latest-guide-id') : null

  return (
    <div className="min-h-screen bg-background-dark relative">
      <PrismBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section with Prism Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="mb-6">
            <PrismIcon size="sm" animate={true} />
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4 font-display text-center">
            Seu Diagnóstico PRISMA
          </h1>

          {/* Score Badge - Glass Effect */}
          <GlassCard className="px-8 py-6 text-center">
            <div className="text-7xl font-bold text-white mb-2">
              {scores.total}
              <span className="text-4xl opacity-60">/40</span>
            </div>
            <div className="text-xl font-semibold text-primary">
              {getClassificationLabel(classification)}
            </div>
          </GlassCard>
        </motion.div>

        {/* Dimension Cards - Glass Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { name: 'Visão', score: scores.visao.score, icon: 'visibility', color: 'blue' },
            { name: 'Integração', score: scores.integracao.score, icon: 'hub', color: 'cyan' },
            { name: 'Viabilidade', score: scores.viabilidade.score, icon: 'paid', color: 'emerald' },
            { name: 'Execução', score: scores.execucao.score, icon: 'bolt', color: 'amber' },
          ].map((dim, i) => (
            <motion.div
              key={dim.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
            >
              <GlassCard className="p-6 hover:bg-white/[0.05] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className={`material-symbols-outlined text-${dim.color}-500 text-3xl`}>
                    {dim.icon}
                  </span>
                  <div className="text-3xl font-bold text-white">
                    {dim.score}
                    <span className="text-lg text-slate-500">/10</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  {dim.name}
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-3">
                  <motion.div
                    className={`h-full bg-${dim.color}-600`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(dim.score / 10) * 100}%` }}
                    transition={{ delay: 0.3 + 0.1 * i, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Analysis Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Detailed Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">
                  analytics
                </span>
                <h2 className="text-2xl font-bold text-white font-display">
                  Análise Detalhada
                </h2>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-blue-600 pl-4 py-2">
                  <div className="font-semibold text-slate-200 mb-1">Visão</div>
                  <div className="text-slate-400 text-sm leading-relaxed">{scores.visao.analysis}</div>
                </div>
                <div className="border-l-2 border-cyan-600 pl-4 py-2">
                  <div className="font-semibold text-slate-200 mb-1">Integração</div>
                  <div className="text-slate-400 text-sm leading-relaxed">{scores.integracao.analysis}</div>
                </div>
                <div className="border-l-2 border-emerald-600 pl-4 py-2">
                  <div className="font-semibold text-slate-200 mb-1">Viabilidade</div>
                  <div className="text-slate-400 text-sm leading-relaxed">{scores.viabilidade.analysis}</div>
                </div>
                <div className="border-l-2 border-amber-600 pl-4 py-2">
                  <div className="font-semibold text-slate-200 mb-1">Execução</div>
                  <div className="text-slate-400 text-sm leading-relaxed">{scores.execucao.analysis}</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-emerald-400 text-4xl">
                  verified
                </span>
                <h2 className="text-2xl font-bold text-white font-display">
                  Pontos Fortes
                </h2>
              </div>
              <div className="space-y-4">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-sm bg-emerald-950/50 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-800">
                      {index + 1}
                    </div>
                    <div className="text-slate-300 text-sm leading-relaxed">{strength}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Questions and Missing Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-4xl">
                help
              </span>
              <h2 className="text-2xl font-bold text-white font-display">
                Refinamento do Diagnóstico
              </h2>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Responder estas questões pode aumentar a precisão da análise estratégica:
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Questions */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-sm p-5">
                <h3 className="font-bold text-lg text-slate-200 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">
                    quiz
                  </span>
                  Questões Estratégicas
                </h3>
                <div className="space-y-3">
                  {questions?.map((question, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-sm bg-blue-950/50 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-800">
                        {index + 1}
                      </div>
                      <div className="text-slate-300 text-sm leading-relaxed">{question}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Info */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-sm p-5">
                <h3 className="font-bold text-lg text-slate-200 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">
                    info
                  </span>
                  Informações Ausentes
                </h3>
                <div className="space-y-3">
                  {missingInfo?.map((info, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-sm bg-amber-950/50 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-800">
                        !
                      </div>
                      <div className="text-slate-300 text-sm leading-relaxed">{info}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Risks and Next Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-red-400 text-4xl">
                  warning
                </span>
                <h2 className="text-2xl font-bold text-white font-display">
                  Riscos Identificados
                </h2>
              </div>
              <div className="space-y-4">
                {risks.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-sm bg-red-950/50 text-red-400 flex items-center justify-center font-bold text-sm border border-red-800">
                      {index + 1}
                    </div>
                    <div className="text-slate-300 text-sm leading-relaxed">{risk}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-blue-400 text-4xl">
                  arrow_forward
                </span>
                <h2 className="text-2xl font-bold text-white font-display">
                  Próximas Ações
                </h2>
              </div>
              <div className="space-y-4">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-sm bg-blue-950/50 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-800">
                      {index + 1}
                    </div>
                    <div className="text-slate-300 text-sm leading-relaxed">{step}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* CTA Section - Main Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <GlassCard className="p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-3 text-white tracking-tight font-display">
                Próximos Passos
              </h2>
              <p className="text-lg text-slate-400">
                Continue sua jornada com ferramentas práticas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {latestGuideId && (
                <button
                  onClick={() => router.push(`/guide/${latestGuideId}`)}
                  className="px-8 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined">menu_book</span>
                  <span className="text-lg">Ver Guia Personalizado</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              )}
              <button
                onClick={() => {
                  sessionStorage.removeItem('prisma-analysis')
                  router.push('/')
                }}
                className="px-8 py-4 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-all"
              >
                Refazer Diagnóstico
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                className="px-8 py-4 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-all"
              >
                Receber Relatório
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <GlassCard className="p-8 mb-8 bg-primary/10 border-primary/30">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">
                  groups
                </span>
                <h2 className="text-3xl font-bold text-white tracking-tight font-display">
                  Comunidade PRISMA
                </h2>
              </div>
              <p className="text-lg text-slate-300">
                Conecte-se com executivos e líderes que utilizam metodologia estruturada
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-emerald-700 text-white rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-all border border-emerald-600 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={telegramGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-sky-700 text-white rounded-xl font-semibold text-lg hover:bg-sky-600 transition-all border border-sky-600 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
            </div>
          </GlassCard>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>PRISMA Score - Clareza operacional para projetos AI-First</p>
        </div>
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
      />
    </div>
  )
}
