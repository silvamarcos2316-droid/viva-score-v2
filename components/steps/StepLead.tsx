'use client'

import { FormData } from '@/lib/types'
import { useState } from 'react'
import { User, Mail, Phone, Building2, Info } from 'lucide-react'

interface StepLeadProps {
  formData: Partial<FormData>
  updateFormData: (data: Partial<FormData>) => void
}

export function StepLead({ formData, updateFormData }: StepLeadProps) {
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email é obrigatório')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Email inválido')
      return false
    }
    setEmailError('')
    return true
  }

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')

    // Aplica máscara brasileira
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }

  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '')
    if (!phone) {
      setPhoneError('Telefone é obrigatório')
      return false
    }
    if (numbers.length < 10) {
      setPhoneError('Telefone inválido (mínimo 10 dígitos)')
      return false
    }
    setPhoneError('')
    return true
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value)
    updateFormData({ phone: formatted })
    if (value) validatePhone(formatted)
  }

  const handleEmailChange = (value: string) => {
    updateFormData({ email: value })
    if (value) validateEmail(value)
  }

  const isValid =
    (formData.fullName?.length || 0) >= 3 &&
    validateEmail(formData.email || '') &&
    validatePhone(formData.phone || '')

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-full mb-4">
          <User className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Vamos nos conhecer?
        </h2>
        <p className="text-lg text-slate-400">
          Seus dados são seguros e usados apenas para enviar seu diagnóstico
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <User className="w-4 h-4" />
          Nome Completo
          <span className="text-red-400">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName || ''}
          onChange={(e) => updateFormData({ fullName: e.target.value })}
          placeholder="Ex: João Silva Santos"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          maxLength={100}
        />
        <p className="text-xs text-slate-500">
          {formData.fullName?.length || 0}/100 caracteres (mínimo 3)
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Mail className="w-4 h-4" />
          Email Profissional
          <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
          placeholder="seu.email@empresa.com"
          className={`w-full px-4 py-3 bg-slate-800 border ${
            emailError ? 'border-red-500' : 'border-slate-700'
          } text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 ${
            emailError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
          } focus:border-transparent transition-all`}
          maxLength={100}
        />
        {emailError ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>✕</span> {emailError}
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Usaremos este email para enviar seu diagnóstico
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Phone className="w-4 h-4" />
          Telefone/WhatsApp
          <span className="text-red-400">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={(e) => validatePhone(e.target.value)}
          placeholder="(11) 98765-4321"
          className={`w-full px-4 py-3 bg-slate-800 border ${
            phoneError ? 'border-red-500' : 'border-slate-700'
          } text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 ${
            phoneError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
          } focus:border-transparent transition-all`}
          maxLength={15}
        />
        {phoneError ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>✕</span> {phoneError}
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Formato: (DD) 9XXXX-XXXX
          </p>
        )}
      </div>

      {/* Company (Optional) */}
      <div className="space-y-2">
        <label htmlFor="company" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Building2 className="w-4 h-4" />
          Empresa
          <span className="text-xs text-slate-500 font-normal">(opcional)</span>
        </label>
        <input
          id="company"
          type="text"
          value={formData.company || ''}
          onChange={(e) => updateFormData({ company: e.target.value })}
          placeholder="Nome da sua empresa"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          maxLength={100}
        />
      </div>

      {/* Privacy Notice */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <p className="font-medium mb-1">Seus dados estão seguros</p>
          <p className="text-slate-400">
            Usamos suas informações apenas para personalizar seu diagnóstico e entrar em contato.
            Nunca compartilharemos com terceiros.
          </p>
        </div>
      </div>

      {/* Validation Message */}
      {!isValid && (
        <div className="text-sm text-slate-400 bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>Preencha os campos obrigatórios para continuar</span>
        </div>
      )}
    </div>
  )
}
