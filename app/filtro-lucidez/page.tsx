'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { trackPageView } from '@/lib/tracking'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Users,
  Zap,
  TrendingUp,
  BookOpen
} from 'lucide-react'

type Question = {
  id: string
  question: string
  subtitle: string
  options: {
    label: string
    value: number // Score: 0 = não precisa IA, 1 = talvez, 2 = precisa IA
    explanation: string
  }[]
}

const questions: Question[] = [
  {
    id: 'volume',
    question: 'Quantas vezes você precisa fazer essa tarefa?',
    subtitle: 'Volume e frequência ajudam a entender a complexidade real',
    options: [
      {
        label: 'Algumas vezes por mês (menos de 10x)',
        value: 0,
        explanation: 'Volume baixo geralmente não justifica IA'
      },
      {
        label: 'Toda semana, mas não todo dia (10-50x/mês)',
        value: 1,
        explanation: 'Automação simples pode resolver'
      },
      {
        label: 'Todo dia, várias vezes (mais de 100x/mês)',
        value: 2,
        explanation: 'Volume alto pode justificar IA'
      }
    ]
  },
  {
    id: 'data',
    question: 'Você precisa analisar ou entender conteúdo?',
    subtitle: 'IA é boa em interpretar textos, imagens e padrões',
    options: [
      {
        label: 'Não, só copiar/colar ou mover dados entre sistemas',
        value: 0,
        explanation: 'Automação simples resolve (Zapier, Make, n8n)'
      },
      {
        label: 'Às vezes preciso escolher com base no conteúdo',
        value: 1,
        explanation: 'Pode precisar de lógica simples ou IA básica'
      },
      {
        label: 'Sim, sempre preciso ler e decidir o que fazer',
        value: 2,
        explanation: 'IA é necessária para interpretação'
      }
    ]
  },
  {
    id: 'rules',
    question: 'As regras do que você faz são sempre as mesmas?',
    subtitle: 'Regras fixas = automação simples. Regras variáveis = IA',
    options: [
      {
        label: 'Sim, sempre faço igual (ex: se X então Y)',
        value: 0,
        explanation: 'Regras fixas = automação simples é suficiente'
      },
      {
        label: 'Na maioria das vezes é igual, mas tem exceções',
        value: 1,
        explanation: 'Automação com validação manual pode funcionar'
      },
      {
        label: 'Não, cada caso é diferente, preciso pensar',
        value: 2,
        explanation: 'Variabilidade exige IA'
      }
    ]
  },
  {
    id: 'creativity',
    question: 'Você precisa criar conteúdo novo ou só organizar?',
    subtitle: 'Criação = IA. Organização = automação',
    options: [
      {
        label: 'Só organizar/enviar/mover o que já existe',
        value: 0,
        explanation: 'Organização não precisa de IA'
      },
      {
        label: 'Adaptar um pouco o que já existe',
        value: 1,
        explanation: 'Templates podem resolver'
      },
      {
        label: 'Criar do zero (textos, resumos, análises)',
        value: 2,
        explanation: 'Criação de conteúdo precisa de IA'
      }
    ]
  },
  {
    id: 'cost',
    question: 'Quanto essa tarefa custa hoje em tempo/dinheiro?',
    subtitle: 'Soluções precisam valer o investimento',
    options: [
      {
        label: 'Alguns minutos por semana, não incomoda muito',
        value: 0,
        explanation: 'Custo baixo, solução simples é suficiente'
      },
      {
        label: 'Algumas horas por semana, dá pra otimizar',
        value: 1,
        explanation: 'Vale automação simples ou IA básica'
      },
      {
        label: 'Horas todo dia, é um problema real do negócio',
        value: 2,
        explanation: 'Problema caro justifica investimento em IA'
      }
    ]
  }
]

export default function SinceraoPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showDescriptionStep, setShowDescriptionStep] = useState(false)
  const [activityDescription, setActivityDescription] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    trackPageView('/filtro-lucidez')
  }, [])

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      // Última pergunta - ir para descrição livre
      setTimeout(() => setShowDescriptionStep(true), 300)
    }
  }

  const handleSubmitDescription = async () => {
    if (!activityDescription.trim()) {
      alert('Por favor, descreva sua atividade para continuar')
      return
    }

    setIsSaving(true)

    try {
      // Preparar dados para salvar
      const submissionData = {
        answers: answers,
        activityDescription: activityDescription,
        totalScore: totalScore,
        maxScore: maxScore,
        percentage: (totalScore / maxScore) * 100,
        recommendation: getRecommendation().type,
        timestamp: new Date().toISOString(),
      }

      // Salvar no endpoint de tracking
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'filtro_lucidez_completed',
          timestamp: new Date().toISOString(),
          data: submissionData,
        }),
      })

      // Mostrar resultado
      setTimeout(() => setShowResult(true), 300)
    } catch (error) {
      console.error('Error saving submission:', error)
      // Mostrar resultado mesmo se falhar o save
      setTimeout(() => setShowResult(true), 300)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
  const maxScore = questions.length * 2

  // Lógica de recomendação
  const getRecommendation = () => {
    const percentage = (totalScore / maxScore) * 100

    if (percentage < 35) {
      return {
        type: 'automation',
        title: 'Você NÃO precisa de IA',
        subtitle: '90% dos seus problemas podem ser resolvidos com automação simples',
        icon: Zap,
        color: 'green',
        description: 'Seu caso é mais sobre conectar sistemas e repetir tarefas do que sobre interpretar ou criar. Automação resolve.'
      }
    } else if (percentage < 70) {
      return {
        type: 'hybrid',
        title: 'Você precisa de automação + IA básica',
        subtitle: 'Comece simples e adicione IA onde realmente fizer diferença',
        icon: TrendingUp,
        color: 'yellow',
        description: 'Parte do seu problema resolve com automação. Use IA apenas nos pontos que exigem interpretação ou criação.'
      }
    } else {
      return {
        type: 'ai',
        title: 'Sim, você precisa de IA',
        subtitle: 'Seu problema exige interpretação e decisões complexas',
        icon: Sparkles,
        color: 'blue',
        description: 'Seu caso tem muita variabilidade, análise de conteúdo ou criação. IA é a solução certa.'
      }
    }
  }

  const recommendation = showResult ? getRecommendation() : null

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar para PRISMA
          </Link>

          <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-sm border border-slate-700 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Filtro de Lucidez PRISMA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Você está no hype ou tem um problema real?
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            5 perguntas pra descobrir se você precisa de IA ou só de automação simples
          </p>
        </motion.div>

        {!showResult && !showDescriptionStep ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">
                  Pergunta {currentQuestion + 1} de {questions.length}
                </span>
                <span className="text-sm text-slate-400">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900 rounded-sm border border-slate-800 p-8 md:p-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {questions[currentQuestion].question}
                </h2>
                <p className="text-slate-400 mb-8">
                  {questions[currentQuestion].subtitle}
                </p>

                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-6 bg-slate-800 hover:bg-slate-750 border-2 border-slate-700 hover:border-blue-500 rounded-sm transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
                        <div>
                          <div className="text-white font-semibold mb-1">{option.label}</div>
                          <div className="text-sm text-slate-500">{option.explanation}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {currentQuestion > 0 && (
                  <button
                    onClick={handleBack}
                    className="mt-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : showDescriptionStep ? (
          // Tela de descrição livre
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-sm border border-slate-800 p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 border-2 border-violet-500 mb-6">
                <BookOpen className="w-8 h-8 text-violet-500" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Agora, nas suas palavras...
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                Descreva qual atividade você quer automatizar ou melhorar com IA. Seja específico sobre o que você faz hoje.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <textarea
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
                placeholder="Exemplo: Hoje eu recebo emails de clientes pedindo orçamento, leio cada um, copio os dados pra planilha, busco o produto no sistema, calculo o preço e respondo o email. Isso toma umas 2 horas por dia..."
                className="w-full h-48 bg-slate-800 border-2 border-slate-700 rounded-sm p-6 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                autoFocus
              />

              <div className="text-sm text-slate-400 mt-3 mb-8">
                💡 Dica: Quanto mais detalhes você der, melhor conseguimos te ajudar depois
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDescriptionStep(false)}
                  className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-sm font-semibold hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Voltar
                </button>

                <button
                  onClick={handleSubmitDescription}
                  disabled={isSaving || !activityDescription.trim()}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-sm font-semibold hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Ver meu resultado
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-sm border border-slate-800 p-8 md:p-12"
          >
            {/* Result Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                recommendation?.color === 'green' ? 'bg-green-500/10 border-2 border-green-500' :
                recommendation?.color === 'yellow' ? 'bg-yellow-500/10 border-2 border-yellow-500' :
                'bg-blue-500/10 border-2 border-blue-500'
              } mb-6`}>
                {recommendation && <recommendation.icon className={`w-10 h-10 ${
                  recommendation.color === 'green' ? 'text-green-500' :
                  recommendation.color === 'yellow' ? 'text-yellow-500' :
                  'text-blue-500'
                }`} />}
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {recommendation?.title}
              </h2>
              <p className="text-xl text-slate-400 mb-6">
                {recommendation?.subtitle}
              </p>
              <p className="text-slate-300 max-w-2xl mx-auto">
                {recommendation?.description}
              </p>
            </div>

            {/* Score */}
            <div className="bg-slate-800 rounded-sm p-6 mb-8 text-center">
              <div className="text-sm text-slate-400 mb-2">Seu Score</div>
              <div className="text-5xl font-bold text-white mb-2">
                {totalScore}/{maxScore}
              </div>
              <div className="text-slate-400">
                {Math.round((totalScore / maxScore) * 100)}% de complexidade que justifica IA
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-6 mb-8">
              {recommendation?.type === 'automation' && (
                <>
                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-xl font-bold text-white mb-3">O que você realmente precisa:</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Zapier / Make / n8n:</strong> Conecta sistemas e automatiza tarefas repetitivas</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Google Sheets / Excel:</strong> Organiza dados e cria relatórios automáticos</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Typeform / Jotform:</strong> Coleta dados e envia para onde você precisa</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-800 rounded-sm p-6">
                    <div className="flex items-start gap-4">
                      <Users className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">Quer ajuda pra implementar?</h4>
                        <p className="text-slate-400 mb-4">
                          Entra na nossa comunidade. Lá tem passo a passo no Drive pra você fazer sozinho, sem gastar com IA.
                        </p>
                        <a
                          href="https://chat.whatsapp.com/example"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-sm font-semibold hover:bg-green-700 transition-all"
                        >
                          <Users className="w-5 h-5" />
                          Entrar na comunidade
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {recommendation?.type === 'hybrid' && (
                <>
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h3 className="text-xl font-bold text-white mb-3">Comece simples, adicione IA depois:</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Fase 1 (Automação):</strong> Use Zapier/Make pra conectar os sistemas</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Fase 2 (IA Básica):</strong> Adicione ChatGPT/Claude nos pontos que exigem análise</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Fase 3 (Validar):</strong> Se funcionar bem, aí sim vale investir em IA customizada</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800 rounded-sm p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="w-6 h-6 text-blue-400" />
                        <h4 className="text-white font-semibold">Comunidade</h4>
                      </div>
                      <p className="text-slate-400 mb-4 text-sm">
                        Tutoriais de automação simples no Drive
                      </p>
                      <a
                        href="https://chat.whatsapp.com/example"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Entrar no grupo
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="bg-slate-800 rounded-sm p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-blue-400" />
                        <h4 className="text-white font-semibold">Diagnóstico completo</h4>
                      </div>
                      <p className="text-slate-400 mb-4 text-sm">
                        Valide viabilidade técnica e estratégica
                      </p>
                      <Link
                        href="/calculator"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Fazer V.I.V.A.
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {recommendation?.type === 'ai' && (
                <>
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold text-white mb-3">Próximos passos:</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Passo 1:</strong> Faça o diagnóstico V.I.V.A. completo pra validar viabilidade</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Passo 2:</strong> Receba análise estruturada em 4 dimensões (Visão, Integração, Viabilidade, Execução)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Passo 3:</strong> Tenha um score objetivo (0-40) e recomendações práticas</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-2 border-blue-500 rounded-sm p-8 text-center">
                    <h4 className="text-2xl font-bold text-white mb-4">
                      Validar Viabilidade do Projeto
                    </h4>
                    <p className="text-slate-300 mb-6">
                      Diagnóstico estruturado em 4 dimensões • Score 0-40 • 3 minutos
                    </p>
                    <Link
                      href="/calculator"
                      className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-sm text-lg font-semibold hover:bg-blue-700 transition-all border border-blue-500"
                    >
                      Fazer diagnóstico V.I.V.A.
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Activity Description Display */}
            {activityDescription && (
              <div className="bg-slate-800/50 rounded-sm p-6 mb-8 border border-slate-700">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-400" />
                  Sua atividade descrita:
                </h4>
                <p className="text-slate-300 italic leading-relaxed">
                  "{activityDescription}"
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="border-t border-slate-800 pt-6 text-center">
              <button
                onClick={() => {
                  setCurrentQuestion(0)
                  setAnswers({})
                  setActivityDescription('')
                  setShowDescriptionStep(false)
                  setShowResult(false)
                }}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Refazer avaliação
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
