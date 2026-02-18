'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ProgressBar } from '@/components/ProgressBar'
import { StepVisao } from '@/components/steps/StepVisao'
import { StepIntegracao } from '@/components/steps/StepIntegracao'
import { StepViabilidade } from '@/components/steps/StepViabilidade'
import { StepExecucao } from '@/components/steps/StepExecucao'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { FormData } from '@/lib/types'
import { trackStepCompleted, trackAnalysisSubmission, trackPageView } from '@/lib/tracking'
import { Sparkles, Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setError(null)
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.projectName &&
          formData.projectName.length >= 3 &&
          formData.problemStatement &&
          formData.problemStatement.length >= 50
        )
      case 2:
        return !!(
          formData.techStack &&
          formData.techStack.length >= 1 &&
          formData.integrationNeeds &&
          formData.integrationNeeds.length >= 30
        )
      case 3:
        return !!(
          formData.budgetRange &&
          formData.roiExpectation &&
          formData.roiExpectation.length >= 30
        )
      case 4:
        return !!(
          formData.timeline &&
          formData.blockers &&
          formData.blockers.length >= 20
        )
      default:
        return false
    }
  }

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      // Track step completion
      trackStepCompleted(currentStep)

      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erro ao analisar')
      }

      // Store results in sessionStorage
      sessionStorage.setItem('prisma-analysis', JSON.stringify(data.analysis))

      // Track analysis submission
      trackAnalysisSubmission({
        formData: formData as any,
        analysis: data.analysis,
      })

      // Navigate to results
      router.push('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Track page view on mount
  useEffect(() => {
    trackPageView('/calculator')
  }, [])

  // Handle Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && isStepValid(currentStep)) {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentStep, formData])

  return (
    <>
      <div className="min-h-screen bg-slate-950 py-6 md:py-12 px-4 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-sm border border-slate-700 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Diagnóstico Estruturado em 4 Dimensões</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4 tracking-tight">
            PRISMA
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light">
            Responda com precisão para obter o diagnóstico mais assertivo
          </p>
        </motion.div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={4} />

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-sm shadow-2xl p-6 md:p-12 mb-6 md:mb-8 border border-slate-200 dark:border-slate-800"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-500 rounded-sm text-red-900 dark:text-red-400 flex items-center gap-3"
            >
              <span className="text-xl">✕</span>
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          {/* Current Step */}
          <div className="min-h-[400px] md:min-h-[500px]">
            {currentStep === 1 && (
              <StepVisao formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 2 && (
              <StepIntegracao formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 3 && (
              <StepViabilidade formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 4 && (
              <StepExecucao formData={formData} updateFormData={updateFormData} />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200 gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 text-slate-700 rounded-sm font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
            >
              ← Voltar
            </button>

            <div className="text-xs sm:text-sm text-slate-500 hidden sm:block">
              {isStepValid(currentStep) && '↵ Enter para avançar'}
            </div>

            <motion.button
              onClick={handleNext}
              disabled={!isStepValid(currentStep) || isSubmitting}
              whileHover={isStepValid(currentStep) && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={isStepValid(currentStep) && !isSubmitting ? { scale: 0.98 } : {}}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm sm:text-base border border-blue-500 disabled:border-slate-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="hidden sm:inline">Processando diagnóstico...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : currentStep === 4 ? (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Gerar Diagnóstico</span>
                  <span className="sm:hidden">Gerar</span>
                </>
              ) : (
                'Próximo →'
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Testimonials Section */}
    {currentStep === 1 && <TestimonialsSection />}
  </>
  )
}
