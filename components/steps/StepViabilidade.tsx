'use client'

import { FormData } from '@/lib/types'

interface StepViabilidadeProps {
  formData: Partial<FormData>
  updateFormData: (data: Partial<FormData>) => void
}

const budgetOptions = [
  { value: '0-100', label: 'R$ 0 - 100', description: 'Testes e MVP' },
  { value: '100-500', label: 'R$ 100 - 500', description: 'Pequena escala' },
  { value: '500-2000', label: 'R$ 500 - 2.000', description: 'Média escala' },
  { value: '2000+', label: 'R$ 2.000+', description: 'Grande escala' },
]

export function StepViabilidade({ formData, updateFormData }: StepViabilidadeProps) {
  const isValid =
    !!formData.budgetRange && (formData.roiExpectation?.length || 0) >= 30

  return (
    <div className="space-y-5 md:space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
          Viabilidade: Custos e ROI
        </h2>
        <p className="text-base md:text-lg text-gray-600">Vamos falar de números</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Qual o orçamento mensal para IA (API costs)?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateFormData({ budgetRange: option.value as any })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                formData.budgetRange === option.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Considere custos de API, infraestrutura e manutenção
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="roiExpectation"
          className="block text-sm font-medium text-gray-700"
        >
          Que retorno você espera deste projeto?
        </label>
        <textarea
          id="roiExpectation"
          value={formData.roiExpectation || ''}
          onChange={(e) => updateFormData({ roiExpectation: e.target.value })}
          placeholder="Ex: Reduzir 50% do tempo de atendimento, aumentar conversão em 30%, economizar 3 colaboradores..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={5}
          maxLength={1000}
        />
        <p
          className={`text-sm ${
            (formData.roiExpectation?.length || 0) >= 30
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {formData.roiExpectation?.length || 0}/1000 caracteres (mínimo 30)
        </p>
      </div>

      {!isValid && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 Selecione um orçamento e descreva o ROI esperado
        </div>
      )}
    </div>
  )
}
