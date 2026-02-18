'use client'

import { FormData } from '@/lib/types'

interface StepVisaoProps {
  formData: Partial<FormData>
  updateFormData: (data: Partial<FormData>) => void
}

export function StepVisao({ formData, updateFormData }: StepVisaoProps) {
  const isValid =
    (formData.projectName?.length || 0) >= 3 &&
    (formData.problemStatement?.length || 0) >= 50

  return (
    <div className="space-y-5 md:space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
          Visão: Entenda o Problema
        </h2>
        <p className="text-base md:text-lg text-gray-600">Vamos começar pelo básico</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
          Nome do Projeto
        </label>
        <input
          id="projectName"
          type="text"
          value={formData.projectName || ''}
          onChange={(e) => updateFormData({ projectName: e.target.value })}
          placeholder="Ex: Chatbot de Atendimento ao Cliente"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={200}
        />
        <p className="text-sm text-gray-500">
          {formData.projectName?.length || 0}/200 caracteres
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="problemStatement"
          className="block text-sm font-medium text-gray-700"
        >
          Que problema específico seu projeto resolve?
        </label>
        <textarea
          id="problemStatement"
          value={formData.problemStatement || ''}
          onChange={(e) => updateFormData({ problemStatement: e.target.value })}
          placeholder="Descreva o problema que você está enfrentando e como a IA pode ajudar..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={6}
          maxLength={1000}
        />
        <p
          className={`text-sm ${
            (formData.problemStatement?.length || 0) >= 50
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {formData.problemStatement?.length || 0}/1000 caracteres (mínimo 50)
        </p>
      </div>

      {!isValid && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 Complete os campos para avançar
        </div>
      )}
    </div>
  )
}
