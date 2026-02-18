'use client'

import { FormData } from '@/lib/types'
import { Eye, HelpCircle } from 'lucide-react'
import { useState } from 'react'

interface StepVisaoProps {
  formData: Partial<FormData>
  updateFormData: (data: Partial<FormData>) => void
}

export function StepVisao({ formData, updateFormData }: StepVisaoProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const isValid =
    (formData.projectName?.length || 0) >= 3 &&
    (formData.problemStatement?.length || 0) >= 50

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-full mb-4">
          <Eye className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Dimensão 1: Visão
        </h2>
        <p className="text-lg text-slate-400">
          Entenda o problema que seu projeto resolve
        </p>
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <label htmlFor="projectName" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          Nome do Projeto
          <button
            type="button"
            onMouseEnter={() => setShowTooltip('projectName')}
            onMouseLeave={() => setShowTooltip(null)}
            className="relative"
          >
            <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-400" />
            {showTooltip === 'projectName' && (
              <div className="absolute left-6 top-0 w-64 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 z-10 shadow-xl">
                Dê um nome descritivo ao seu projeto de IA. Ex: "Assistente Virtual de Vendas", "Chatbot de Suporte"
              </div>
            )}
          </button>
        </label>
        <input
          id="projectName"
          type="text"
          value={formData.projectName || ''}
          onChange={(e) => updateFormData({ projectName: e.target.value })}
          placeholder="Ex: Assistente Virtual de Atendimento ao Cliente"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          maxLength={200}
        />
        <p className="text-xs text-slate-500">
          {formData.projectName?.length || 0}/200 caracteres (mínimo 3)
        </p>
      </div>

      {/* Problem Statement */}
      <div className="space-y-2">
        <label
          htmlFor="problemStatement"
          className="flex items-center gap-2 text-sm font-medium text-slate-300"
        >
          Que problema específico seu projeto resolve?
          <button
            type="button"
            onMouseEnter={() => setShowTooltip('problem')}
            onMouseLeave={() => setShowTooltip(null)}
            className="relative"
          >
            <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-400" />
            {showTooltip === 'problem' && (
              <div className="absolute left-6 top-0 w-64 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 z-10 shadow-xl">
                Descreva em detalhes: Qual dor dos clientes? Qual processo é lento? Onde há desperdício de tempo/recursos?
              </div>
            )}
          </button>
        </label>
        <textarea
          id="problemStatement"
          value={formData.problemStatement || ''}
          onChange={(e) => updateFormData({ problemStatement: e.target.value })}
          placeholder="Ex: Nossa equipe de suporte recebe 500+ mensagens/dia no WhatsApp. 70% são perguntas repetitivas sobre horário, preços e rastreamento. Isso sobrecarrega a equipe e aumenta tempo de resposta de 15min para 2h nos picos. Precisamos automatizar as perguntas simples para focar nos casos complexos."
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
          rows={7}
          maxLength={1000}
        />
        <p
          className={`text-xs ${
            (formData.problemStatement?.length || 0) >= 50
              ? 'text-green-400'
              : 'text-red-400'
          }`}
        >
          {formData.problemStatement?.length || 0}/1000 caracteres (mínimo 50)
        </p>
      </div>

      {/* Validation Message */}
      {!isValid && (
        <div className="text-sm text-slate-400 bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>Seja específico e detalhado. Quanto mais contexto, melhor o diagnóstico.</span>
        </div>
      )}
    </div>
  )
}
