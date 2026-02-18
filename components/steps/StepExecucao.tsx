'use client'

import { FormData } from '@/lib/types'

interface StepExecucaoProps {
  formData: Partial<FormData>
  updateFormData: (data: Partial<FormData>) => void
}

const timelineOptions = [
  { value: '1-week', label: '1 semana', description: 'Urgente' },
  { value: '2-4-weeks', label: '2-4 semanas', description: 'Rápido' },
  { value: '1-3-months', label: '1-3 meses', description: 'Planejado' },
  { value: '3-months+', label: '3+ meses', description: 'Longo prazo' },
]

export function StepExecucao({ formData, updateFormData }: StepExecucaoProps) {
  const isValid = !!formData.timeline && (formData.blockers?.length || 0) >= 20

  return (
    <div className="space-y-5 md:space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
          Execução: Próximos Passos
        </h2>
        <p className="text-base md:text-lg text-gray-600">Hora de executar</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Qual o prazo para o MVP funcional?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {timelineOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateFormData({ timeline: option.value as any })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                formData.timeline === option.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">Seja realista com os recursos disponíveis</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="blockers" className="block text-sm font-medium text-gray-700">
          O que pode impedir você de começar hoje?
        </label>
        <textarea
          id="blockers"
          value={formData.blockers || ''}
          onChange={(e) => updateFormData({ blockers: e.target.value })}
          placeholder="Ex: Falta de conhecimento técnico, falta de orçamento aprovado, preciso contratar desenvolvedor..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={5}
          maxLength={1000}
        />
        <p
          className={`text-sm ${
            (formData.blockers?.length || 0) >= 20 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {formData.blockers?.length || 0}/1000 caracteres (mínimo 20)
        </p>
      </div>

      {!isValid && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 Selecione um prazo e identifique os bloqueadores
        </div>
      )}
    </div>
  )
}
