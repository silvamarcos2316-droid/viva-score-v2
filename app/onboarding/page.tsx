'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingSlide } from '@/components/onboarding/OnboardingSlide'
import { PrismIcon } from '@/components/ui/PrismIcon'
import { GlassCard } from '@/components/ui/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 3

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      // Última tela: ir para chat com cookie
      router.push('/calculadora-chat?from_onboarding=true')
    }
  }

  const skipOnboarding = () => {
    router.push('/calculadora-chat?from_onboarding=true')
  }

  return (
    <AnimatePresence mode="wait">
      {currentSlide === 0 && (
        <motion.div
          key="slide-0"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingSlide slideNumber={0} totalSlides={totalSlides}>
            {/* Header / Logo */}
            <div className="flex flex-col items-center pt-8">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-4 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-3xl">
                  change_history
                </span>
              </div>
              <h2 className="text-slate-100 text-sm font-bold tracking-[0.3em] uppercase">
                PRISMA
              </h2>
            </div>

            {/* Manifesto Content */}
            <div className="flex flex-col items-center text-center space-y-8">
              <h1 className="text-slate-100 text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6 font-display">
                Nem tudo é IA.<br/>
                <span className="text-primary italic">Às vezes</span> é processo.
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-[280px]">
                O sistema de clareza operacional para decidir entre automação, IA ou processos.
              </p>

              {/* Prism Visual */}
              <div className="w-full aspect-square flex items-center justify-center relative py-8">
                <PrismIcon size="md" animate={true} />
              </div>
            </div>

            {/* Footer Actions */}
            <div>
              <button
                onClick={nextSlide}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center group mb-4"
              >
                <span className="text-lg">Continuar</span>
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <button
                onClick={skipOnboarding}
                className="w-full text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                Pular introdução
              </button>
            </div>
          </OnboardingSlide>
        </motion.div>
      )}

      {currentSlide === 1 && (
        <motion.div
          key="slide-1"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingSlide slideNumber={1} totalSlides={totalSlides}>
            {/* Header */}
            <div className="flex flex-col items-center pt-8">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-4 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-3xl">
                  warning
                </span>
              </div>
            </div>

            {/* Problem Content */}
            <div className="flex flex-col items-center text-center space-y-8">
              <h1 className="text-slate-100 text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight mb-6 font-display">
                A maioria dos projetos<br/>
                <span className="text-red-400">falha antes de começar</span>
              </h1>

              {/* 3 Problems */}
              <div className="w-full space-y-4 max-w-[350px]">
                <GlassCard className="p-4 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-2xl">❌</span>
                    <div>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        Compram IA antes de validar se o problema realmente existe
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-2xl">❌</span>
                    <div>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        Automatizam processo quebrado (garbage in, garbage out)
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-2xl">❌</span>
                    <div>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        Ignoram integração com sistemas atuais (vira Frankenstein)
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <p className="text-slate-400 text-base">
                Resultado: <span className="text-red-400 font-semibold">R$ 50k+ jogados fora</span> sem gerar valor.
              </p>
            </div>

            {/* Footer Actions */}
            <div>
              <button
                onClick={nextSlide}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center group mb-4"
              >
                <span className="text-lg">Entender Como Evitar</span>
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <button
                onClick={skipOnboarding}
                className="w-full text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                Pular introdução
              </button>
            </div>
          </OnboardingSlide>
        </motion.div>
      )}

      {currentSlide === 2 && (
        <motion.div
          key="slide-2"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingSlide slideNumber={2} totalSlides={totalSlides}>
            {/* Header */}
            <div className="flex flex-col items-center pt-8">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-4 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-3xl">
                  lightbulb
                </span>
              </div>
            </div>

            {/* Solution Content */}
            <div className="flex flex-col items-center text-center space-y-6">
              <h1 className="text-slate-100 text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight mb-4 font-display">
                <span className="text-primary">PRISMA</span> identifica<br/>
                o que você realmente precisa
              </h1>

              <p className="text-slate-400 text-base max-w-[300px] leading-relaxed">
                Framework V.I.V.A. em 4 dimensões críticas:
              </p>

              {/* V.I.V.A. Framework */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-[350px]">
                <GlassCard className="p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <span className="material-symbols-outlined text-blue-400 text-3xl">
                      visibility
                    </span>
                    <span className="text-white font-semibold text-sm">Visão</span>
                    <span className="text-slate-400 text-xs">Problema está claro?</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-3xl">
                      hub
                    </span>
                    <span className="text-white font-semibold text-sm">Integração</span>
                    <span className="text-slate-400 text-xs">Conecta com atual?</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-3xl">
                      paid
                    </span>
                    <span className="text-white font-semibold text-sm">Viabilidade</span>
                    <span className="text-slate-400 text-xs">ROI faz sentido?</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-3xl">
                      bolt
                    </span>
                    <span className="text-white font-semibold text-sm">Execução</span>
                    <span className="text-slate-400 text-xs">Tem recursos?</span>
                  </div>
                </GlassCard>
              </div>

              <p className="text-slate-300 text-sm max-w-[300px]">
                Em <span className="text-primary font-semibold">2 minutos</span>, você sabe se precisa de IA, automação simples ou só organização.
              </p>
            </div>

            {/* Footer Actions */}
            <div>
              <button
                onClick={nextSlide}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center group"
              >
                <span className="text-lg">Começar Diagnóstico</span>
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </OnboardingSlide>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
