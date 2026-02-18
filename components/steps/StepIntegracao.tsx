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
    <div className="space-y-5 md:space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
          Integração: Stack Técnica
        </h2>
        <p className="text-base md:text-lg text-gray-600">Como você vai construir isso?</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Quais tecnologias você planeja usar?
        </label>
        <div className="flex flex-wrap gap-2">
          {techOptions.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                formData.techStack?.includes(tech)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            placeholder="Outra tecnologia..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addCustomTech}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Selecionadas: {formData.techStack?.length || 0}
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="integrationNeeds"
          className="block text-sm font-medium text-gray-700"
        >
          Quais sistemas ou APIs você precisa integrar?
        </label>
        <textarea
          id="integrationNeeds"
          value={formData.integrationNeeds || ''}
          onChange={(e) => updateFormData({ integrationNeeds: e.target.value })}
          placeholder="Ex: Preciso integrar com WhatsApp Business API, CRM interno, e banco de dados de clientes..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={5}
          maxLength={1000}
        />
        <p
          className={`text-sm ${
            (formData.integrationNeeds?.length || 0) >= 30
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {formData.integrationNeeds?.length || 0}/1000 caracteres (mínimo 30)
        </p>
      </div>

      {!isValid && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 Selecione pelo menos 1 tecnologia e descreva as integrações
        </div>
      )}
    </div>
  )
}
