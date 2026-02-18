'use client'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const steps = [
  { number: 1, label: 'Visão' },
  { number: 2, label: 'Integração' },
  { number: 3, label: 'Viabilidade' },
  { number: 4, label: 'Execução' },
]

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number
          const isUpcoming = currentStep < step.number

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-bold text-sm transition-all duration-300
                  ${isCompleted ? 'bg-blue-600 text-white' : ''}
                  ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-600/30' : ''}
                  ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
                `}
                >
                  {step.number}
                </div>
                <span
                  className={`
                  mt-2 text-xs font-medium
                  ${isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'}
                `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                  flex-1 h-1 mx-2 transition-all duration-500
                  ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}
                `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
