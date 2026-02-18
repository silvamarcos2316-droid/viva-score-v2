'use client'

const testimonials = [
  {
    name: 'Carolina Mendes',
    role: 'CEO @ ChatFlow AI',
    score: 34,
    classification: 'Alta Maturidade',
    quote: 'O diagnóstico PRISMA identificou 2 gaps estratégicos críticos na nossa arquitetura de integração. Ajustamos o roadmap antes do investimento.',
    initials: 'CM',
  },
  {
    name: 'Rafael Costa',
    role: 'CTO @ FinanceAI',
    score: 28,
    classification: 'Maturidade Moderada',
    quote: 'As dimensões do framework nos forçaram a estruturar melhor nosso plano de viabilidade técnica e financeira.',
    initials: 'RC',
  },
  {
    name: 'Juliana Oliveira',
    role: 'Head of Product @ LegalTech',
    score: 37,
    classification: 'Alta Maturidade',
    quote: 'Utilizamos o diagnóstico PRISMA como base para apresentação ao board. A análise estruturada deu credibilidade técnica à proposta.',
    initials: 'JO',
  },
  {
    name: 'Marcos Silva',
    role: 'Founder @ DataFlow',
    score: 22,
    classification: 'Baixa Maturidade',
    quote: 'Score baixo revelou necessidade de reestruturação na fase de execução. Ajustamos stack e governança. Diagnóstico preciso.',
    initials: 'MS',
  },
]

export function TestimonialsSection() {
  return (
    <div className="bg-slate-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Diagnósticos Realizados
          </h2>
          <p className="text-xl text-slate-400 font-light">
            Empresas que utilizaram a plataforma PRISMA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-sm p-6 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-700 rounded-sm flex items-center justify-center text-slate-300 font-bold">
                  {testimonial.initials}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-100">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-500">
                      {testimonial.score}/40
                    </span>
                    <span className="text-xs bg-blue-950/50 text-blue-400 px-2 py-1 rounded-sm border border-blue-800">
                      {testimonial.classification}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-block bg-slate-800/50 border border-slate-700 rounded-sm p-8">
            <div className="text-5xl font-bold text-white mb-2">150+</div>
            <div className="text-lg text-slate-400">Diagnósticos Estruturados</div>
          </div>
        </div>
      </div>
    </div>
  )
}
