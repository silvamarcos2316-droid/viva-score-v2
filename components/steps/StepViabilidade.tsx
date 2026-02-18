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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Dimensão 3: Viabilidade
        </h2>
        <p className="text-lg text-slate-400">Vamos falar de números e retorno</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Qual o orçamento mensal para IA (API costs)?
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Considere custos de API (Claude, OpenAI), infraestrutura (servidor, banco) e manutenção
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateFormData({ budgetRange: option.value as any })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                formData.budgetRange === option.value
                  ? 'border-blue-600 bg-blue-600/10'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="font-semibold text-white">{option.label}</div>
              <div className="text-sm text-slate-400">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="roiExpectation"
          className="block text-sm font-medium text-slate-300"
        >
          Que retorno você espera deste projeto?
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Seja específico: economias de tempo, redução de custos, aumento de receita, etc.
        </p>
        <textarea
          id="roiExpectation"
          value={formData.roiExpectation || ''}
          onChange={(e) => updateFormData({ roiExpectation: e.target.value })}
          placeholder="Ex: Espero reduzir 60% do tempo de atendimento (de 2h para 45min), automatizar 70% das perguntas repetitivas, liberar 2 atendentes para focar em vendas complexas (aumentando receita em R$ 50k/mês), e melhorar satisfação do cliente com respostas instantâneas 24/7."
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={6}
          maxLength={1000}
        />
        <p
          className={`text-xs ${
            (formData.roiExpectation?.length || 0) >= 30
              ? 'text-green-400'
              : 'text-red-400'
          }`}
        >
          {formData.roiExpectation?.length || 0}/1000 caracteres (mínimo 30)
        </p>
      </div>

      {!isValid && (
        <div className="text-sm text-slate-400 bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>Selecione um orçamento e descreva o ROI esperado com métricas concretas</span>
        </div>
      )}
    </div>
  )
}
