'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ProgressBar } from '@/components/ProgressBar'
import { StepLead } from '@/components/steps/StepLead'
import { StepVisao } from '@/components/steps/StepVisao'
import { StepIntegracao } from '@/components/steps/StepIntegracao'
import { StepViabilidade } from '@/components/steps/StepViabilidade'
import { StepExecucao } from '@/components/steps/StepExecucao'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { FormData } from '@/lib/types'
import { trackStepCompleted, trackAnalysisSubmission, trackPageView } from '@/lib/tracking'
import { saveLeadToDatabase } from '@/lib/supabase'
import { Sparkles, Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0) // Start at step 0 (lead capture)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingLead, setIsSavingLead] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setError(null)
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        // Lead validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneNumbers = (formData.phone || '').replace(/\D/g, '')
        return !!(
          formData.fullName &&
          formData.fullName.length >= 3 &&
          formData.email &&
          emailRegex.test(formData.email) &&
          formData.phone &&
          phoneNumbers.length >= 10
        )
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

  const handleNext = async () => {
    if (isStepValid(currentStep)) {
      // If step 0 (lead capture), save to database first
      if (currentStep === 0) {
        setIsSavingLead(true)
        setError(null)

        try {
          const success = await saveLeadToDatabase({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
          })

          if (!success) {
            throw new Error('Erro ao salvar seus dados. Tente novamente.')
          }

          // Track lead capture
          trackStepCompleted(0)

        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido')
          setIsSavingLead(false)
          return
        } finally {
          setIsSavingLead(false)
        }
      } else {
        // Track other step completions
        trackStepCompleted(currentStep)
      }

      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setError(null)
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
          className="bg-slate-900 rounded-sm shadow-2xl p-6 md:p-12 mb-6 md:mb-8 border border-slate-800"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-950/20 border border-red-500 rounded-sm text-red-400 flex items-center gap-3"
            >
              <span className="text-xl">✕</span>
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          {/* Current Step with AnimatePresence for smooth transitions */}
          <div className="min-h-[400px] md:min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <StepLead formData={formData} updateFormData={updateFormData} />
                )}
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-800 gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting || isSavingLead}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800 text-slate-300 rounded-sm font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base border border-slate-700"
            >
              ← Voltar
            </button>

            <div className="text-xs sm:text-sm text-slate-500 hidden sm:block">
              {isStepValid(currentStep) && !isSubmitting && !isSavingLead && '↵ Enter para avançar'}
            </div>

            <motion.button
              onClick={handleNext}
              disabled={!isStepValid(currentStep) || isSubmitting || isSavingLead}
              whileHover={isStepValid(currentStep) && !isSubmitting && !isSavingLead ? { scale: 1.02 } : {}}
              whileTap={isStepValid(currentStep) && !isSubmitting && !isSavingLead ? { scale: 0.98 } : {}}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm sm:text-base border border-blue-500 disabled:border-slate-700"
            >
              {isSavingLead ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="hidden sm:inline">Salvando dados...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : isSubmitting ? (
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

    {/* Testimonials Section - only show on step 0 */}
    {currentStep === 0 && <TestimonialsSection />}
  </>
  )
}
