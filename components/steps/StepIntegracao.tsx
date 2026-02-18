'use client'

import { FormData } from '@/lib/types'
import { useState } from 'react'

interface StepIntegracaoProps {
  formData: Partial<FormData>
  updateFormData: (data: Partial<FormData>) => void
}

const techOptions = [
  'Não sei ainda, me ajuda!',
  'Claude API',
  'OpenAI API',
  'Gemini',
  'LangChain',
  'LlamaIndex',
  'Python',
  'TypeScript',
  'Node.js',
  'Next.js',
  'FastAPI',
  'Supabase',
  'PostgreSQL',
  'MongoDB',
  'Pinecone',
  'Weaviate',
]

export function StepIntegracao({ formData, updateFormData }: StepIntegracaoProps) {
  const [customTech, setCustomTech] = useState('')

  const toggleTech = (tech: string) => {
    const currentStack = formData.techStack || []
    if (currentStack.includes(tech)) {
      updateFormData({ techStack: currentStack.filter((t) => t !== tech) })
    } else {
      updateFormData({ techStack: [...currentStack, tech] })
    }
  }

  const addCustomTech = () => {
    if (customTech.trim()) {
      const currentStack = formData.techStack || []
      updateFormData({ techStack: [...currentStack, customTech.trim()] })
      setCustomTech('')
    }
  }

  const isValid =
    (formData.techStack?.length || 0) >= 1 &&
    (formData.integrationNeeds?.length || 0) >= 30

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Dimensão 2: Integração
        </h2>
        <p className="text-lg text-slate-400">Como você vai construir isso?</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Quais tecnologias você planeja usar?
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Selecione uma ou mais. Não sabe? Escolha "Não sei ainda, me ajuda!"
        </p>
        <div className="flex flex-wrap gap-2">
          {techOptions.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                formData.techStack?.includes(tech)
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTech())}
            placeholder="Outra tecnologia... (ex: Dialogflow, Rasa)"
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addCustomTech}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Adicionar
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Selecionadas: {formData.techStack?.length || 0}
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="integrationNeeds"
          className="block text-sm font-medium text-slate-300"
        >
          Quais sistemas ou APIs você precisa integrar?
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Liste todos os sistemas que a IA precisa "conversar": WhatsApp, CRMs, bancos de dados, etc.
        </p>
        <textarea
          id="integrationNeeds"
          value={formData.integrationNeeds || ''}
          onChange={(e) => updateFormData({ integrationNeeds: e.target.value })}
          placeholder="Ex: Preciso integrar com WhatsApp Business API para receber mensagens, Salesforce CRM para buscar dados de clientes, PostgreSQL para histórico de conversas, e API de pagamentos PagSeguro para consultar status de pedidos."
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={6}
          maxLength={1000}
        />
        <p
          className={`text-xs ${
            (formData.integrationNeeds?.length || 0) >= 30
              ? 'text-green-400'
              : 'text-red-400'
          }`}
        >
          {formData.integrationNeeds?.length || 0}/1000 caracteres (mínimo 30)
        </p>
      </div>

      {!isValid && (
        <div className="text-sm text-slate-400 bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>Selecione pelo menos 1 tecnologia e descreva as integrações necessárias</span>
        </div>
      )}
    </div>
  )
}
