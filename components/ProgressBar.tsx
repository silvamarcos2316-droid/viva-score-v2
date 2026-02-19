'use client'

import { User, Eye, Boxes, DollarSign, Zap } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const steps = [
  { number: 0, label: 'Contato', icon: User, bgColor: 'bg-violet-600', textColor: 'text-violet-400', ringColor: 'ring-violet-600/30' },
  { number: 1, label: 'Visão', icon: Eye, bgColor: 'bg-blue-600', textColor: 'text-blue-400', ringColor: 'ring-blue-600/30' },
  { number: 2, label: 'Integração', icon: Boxes, bgColor: 'bg-green-600', textColor: 'text-green-400', ringColor: 'ring-green-600/30' },
  { number: 3, label: 'Viabilidade', icon: DollarSign, bgColor: 'bg-yellow-600', textColor: 'text-yellow-400', ringColor: 'ring-yellow-600/30' },
  { number: 4, label: 'Execução', icon: Zap, bgColor: 'bg-orange-600', textColor: 'text-orange-400', ringColor: 'ring-orange-600/30' },
]

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-300">
            Etapa {currentStep + 1} de {totalSteps + 1}
          </span>
          <span className="text-sm text-slate-400">
            {Math.round(((currentStep + 1) / (totalSteps + 1)) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 via-blue-600 via-green-600 via-yellow-600 to-orange-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / (totalSteps + 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Progress Bar */}
      <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number
          const isUpcoming = currentStep < step.number
          const Icon = step.icon

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  font-bold text-sm transition-all duration-300 relative
                  ${isCompleted ? step.bgColor + ' text-white' : ''}
                  ${isActive ? step.bgColor + ' text-white ring-4 ' + step.ringColor + ' scale-110' : ''}
                  ${isUpcoming ? 'bg-slate-800 text-slate-500 border-2 border-slate-700' : ''}
                `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`
                  mt-2 text-xs font-medium transition-all duration-300
                  ${isActive || isCompleted ? step.textColor : 'text-slate-500'}
                `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 relative">
                  <div className="absolute inset-0 bg-slate-800 rounded-full" />
                  <div
                    className={`
                    absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400
                    transition-all duration-500 ease-out rounded-full
                    ${isCompleted ? 'scale-x-100' : 'scale-x-0'}
                  `}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
