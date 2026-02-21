'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PrismBackground } from '@/components/ui/PrismBackground'
import { GlassCard } from '@/components/ui/GlassCard'
import { PrismIcon } from '@/components/ui/PrismIcon'
import { motion } from 'framer-motion'
import type { Guide } from '@/lib/guide-templates'

export default function GuidePage() {
  const params = useParams()
  const router = useRouter()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load guide from sessionStorage
    const storedGuide = sessionStorage.getItem(`guide-${params.id}`)
    if (storedGuide) {
      setGuide(JSON.parse(storedGuide))
      setLoading(false)
    } else {
      // If no guide found, redirect to results
      router.push('/results')
    }
  }, [params.id, router])

  if (loading || !guide) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <PrismIcon size="md" animate={true} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-dark relative">
      <PrismBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
            <span className="material-symbols-outlined text-primary text-sm">
              change_history
            </span>
            <span className="text-primary text-sm font-bold tracking-wider uppercase">
              PRISMA
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 font-display">
            {guide.hero.headline}
          </h1>
          <p className="text-xl text-slate-400">
            {guide.hero.subheadline}
          </p>
        </motion.div>

        {/* Automation Section */}
        {guide.automation.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
              <span className="material-symbols-outlined text-primary text-3xl">
                rocket_launch
              </span>
              🔎 Automação Resolve
            </h2>

            <div className="space-y-6">
              {guide.automation.map((step, i) => (
                <GlassCard key={i} className="p-6 hover:bg-white/[0.06] transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        {step.icon}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {i + 1}️⃣ {step.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed mb-3">
                        {step.description}
                      </p>

                      {step.tools && step.tools.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {step.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-3 py-1 bg-slate-800/50 text-slate-300 text-sm rounded-full border border-slate-700"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4 text-sm text-slate-500">
                        {step.estimatedTime && (
                          <span>⏱️ {step.estimatedTime}</span>
                        )}
                        {step.difficulty && (
                          <span className={
                            step.difficulty === 'fácil' ? 'text-green-400' :
                            step.difficulty === 'médio' ? 'text-yellow-400' :
                            'text-red-400'
                          }>
                            🎯 {step.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* IA Section */}
        {guide.iaUse.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
              <span className="material-symbols-outlined text-primary text-3xl">
                psychology
              </span>
              🤖 IA Entra Aqui
            </h2>

            <div className="space-y-6">
              {guide.iaUse.map((step, i) => (
                <GlassCard key={i} className="p-6 border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                      <span className="material-symbols-outlined text-purple-400 text-2xl">
                        {step.icon}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        • {step.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed mb-3">
                        {step.description}
                      </p>

                      {step.tools && step.tools.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {step.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full border border-purple-700/50"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4 text-sm text-slate-500">
                        {step.estimatedTime && (
                          <span>⏱️ {step.estimatedTime}</span>
                        )}
                        {step.difficulty && (
                          <span className={
                            step.difficulty === 'fácil' ? 'text-green-400' :
                            step.difficulty === 'médio' ? 'text-yellow-400' :
                            'text-red-400'
                          }>
                            🎯 {step.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Truth Bomb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <GlassCard className="p-8 bg-amber-950/10 border-amber-500/20">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-amber-400 text-4xl">
                wb_incandescent
              </span>
              <div>
                <h2 className="text-xl font-bold text-white mb-3 font-display">
                  🧠 A Verdade
                </h2>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                  {guide.truthBomb}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Bottlenecks */}
        {guide.bottlenecks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
              <span className="material-symbols-outlined text-red-400 text-3xl">
                warning
              </span>
              🔥 Gargalos Reais
            </h2>

            <GlassCard className="p-6">
              <ul className="space-y-3">
                {guide.bottlenecks.map((bottleneck, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-red-400">•</span>
                    <span>{bottleneck}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        )}

        {/* Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-12"
        >
          <GlassCard className="p-8 bg-primary/10 border-primary/30">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4 font-display">
                ⚠️ Problemas que Você VAI Enfrentar
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {guide.communityValue}
              </p>

              <button
                onClick={() => router.push('/calculadora-chat')}
                className="w-full sm:w-auto px-8 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group mx-auto"
              >
                <span className="text-lg">Refazer Diagnóstico</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>PRISMA Score - Clareza operacional para projetos AI-First</p>
        </div>
      </div>
    </div>
  )
}
