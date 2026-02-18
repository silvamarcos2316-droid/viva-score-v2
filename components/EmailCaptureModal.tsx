'use client'

import { useState } from 'react'
import { trackEmailCapture } from '@/lib/tracking'

interface EmailCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string, name: string) => void
}

export function EmailCaptureModal({ isOpen, onClose, onSubmit }: EmailCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return

    setIsSubmitting(true)

    // Track email capture
    trackEmailCapture(email, name)

    await onSubmit(email, name)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Receba seu Relatório Completo
          </h2>
          <p className="text-gray-600">
            Enviaremos sua análise detalhada por email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Seu Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Seu Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-900">
              ✅ Análise completa em PDF<br />
              ✅ Sem spam, apenas conteúdo relevante<br />
              ✅ Acesso ao grupo VIP
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email || !name}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : 'Receber Relatório'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Seus dados estão seguros e não serão compartilhados.
        </p>
      </div>
    </div>
  )
}
