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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Dimensão 4: Execução
        </h2>
        <p className="text-lg text-slate-400">Hora de colocar em prática</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Qual o prazo para o MVP funcional?
        </label>
        <p className="text-xs text-slate-500 mb-3">
          MVP = Versão mínima funcional do produto. Seja realista com os recursos disponíveis.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {timelineOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateFormData({ timeline: option.value as any })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                formData.timeline === option.value
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
        <label htmlFor="blockers" className="block text-sm font-medium text-slate-300">
          O que pode impedir você de começar hoje?
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Identifique obstáculos: falta de conhecimento, orçamento, equipe, aprovações, etc.
        </p>
        <textarea
          id="blockers"
          value={formData.blockers || ''}
          onChange={(e) => updateFormData({ blockers: e.target.value })}
          placeholder="Ex: Não tenho conhecimento técnico em IA, preciso de aprovação do orçamento pela diretoria (demora 2 semanas), não sei qual API de WhatsApp usar, e não tenho desenvolvedor na equipe (preciso contratar freelancer ou agência)."
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={6}
          maxLength={1000}
        />
        <p
          className={`text-xs ${
            (formData.blockers?.length || 0) >= 20 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {formData.blockers?.length || 0}/1000 caracteres (mínimo 20)
        </p>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-lg p-6 mt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Quase lá!
            </h3>
            <p className="text-sm text-slate-300">
              Com base nas suas respostas, vamos gerar um diagnóstico completo com scores detalhados,
              pontos de atenção e recomendações práticas para seu projeto de IA.
            </p>
          </div>
        </div>
      </div>

      {!isValid && (
        <div className="text-sm text-slate-400 bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>Selecione um prazo e identifique os bloqueadores antes de gerar o diagnóstico</span>
        </div>
      )}
    </div>
  )
}
