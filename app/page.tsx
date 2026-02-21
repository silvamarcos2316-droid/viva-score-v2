'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { trackPageView } from '@/lib/tracking'
import {
  BarChart3,
  Shield,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Layers
} from 'lucide-react'

export default function LandingPage() {
  useEffect(() => {
    trackPageView('/')
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen bg-slate-950 py-16 md:py-24 px-4">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"></div>

        <motion.div
          className="relative max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500"></div>
              <span className="text-sm font-medium text-blue-400 tracking-wider uppercase">
                Plataforma de Diagnóstico Estratégico
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500"></div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-slate-300 mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
              Você precisa de IA, automação simples ou só organizar processo?
            </h1>

            <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-8 tracking-tight">
              PRISMA
            </div>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-4 max-w-3xl mx-auto leading-relaxed"
            >
              Sistema de clareza operacional. Classificamos seu problema e mostramos o caminho mais direto — sem hype.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-blue-400 max-w-2xl mx-auto font-medium"
            >
              Nem tudo exige IA. Mas tudo exige clareza.
            </motion.p>
          </motion.div>

          {/* Value Props Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-8">
              <BarChart3 className="w-10 h-10 text-blue-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-2">4 Tipos</div>
              <div className="text-slate-400">Classificamos se é (A) Automação simples (B) IA aplicada (C) Processo (D) Estrutura de decisão</div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-8">
              <Shield className="w-10 h-10 text-blue-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Anti-Hype</div>
              <div className="text-slate-400">Educação antes de venda. Se não precisar de IA, falamos na lata.</div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-8">
              <Layers className="w-10 h-10 text-blue-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Clareza Primeiro</div>
              <div className="text-slate-400">Antes de pensar em tecnologia, clareza de processo vem primeiro</div>
            </div>
          </motion.div>

          {/* CTA Bifurcado */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Path 1: Filtro de Lucidez - Violeta */}
              <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 backdrop-blur-sm border-2 border-violet-500/50 rounded-lg p-8 flex flex-col hover:border-violet-400 transition-all">
                <div className="mb-4">
                  <div className="text-violet-300 text-sm font-semibold mb-2 uppercase tracking-wider">Filtro de Lucidez</div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Você está no hype ou tem problema real?
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    5 perguntas pra descobrir se você precisa de IA ou só de automação simples
                  </p>
                </div>
                <Link
                  href="/filtro-lucidez"
                  className="mt-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg text-base font-semibold hover:from-violet-500 hover:to-purple-500 transition-all"
                >
                  Fazer o filtro
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-slate-500 mt-3 text-xs text-center">
                  A maioria não precisa • Recomendação honesta • 2 minutos
                </p>
              </div>

              {/* Path 2: PRISMA Full - Rainbow */}
              <div className="bg-gradient-to-br from-blue-900/30 via-green-900/30 to-yellow-900/30 backdrop-blur-sm border-2 border-blue-500/50 rounded-lg p-8 flex flex-col hover:border-green-400 transition-all">
                <div className="mb-6">
                  <div className="text-blue-300 text-sm font-semibold mb-2 uppercase tracking-wider">PRISMA Full</div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Análise completa em 4 dimensões
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    Validação técnica e estratégica com score objetivo 0-40
                  </p>
                </div>

                {/* Choice: Conversational or Form */}
                <div className="mt-auto space-y-3">
                  <Link
                    href="/calculadora-chat"
                    className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 text-white rounded-lg text-base font-semibold hover:from-blue-500 hover:via-green-500 hover:to-yellow-500 transition-all text-center"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span>💬 Conversar com IA</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-white/70 mt-1">Recomendado • Mais natural</p>
                  </Link>

                  <Link
                    href="/calculator"
                    className="block w-full px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700/50 hover:border-slate-600 transition-all text-center"
                  >
                    Usar formulário tradicional
                  </Link>
                </div>

                <p className="text-slate-500 mt-4 text-xs text-center">
                  Visão • Integração • Viabilidade • Execução • 3 minutos
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-slate-800 pt-12"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">Diagnósticos Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">4</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">Dimensões de Análise</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">92%</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">Índice de Assertividade</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">0-40</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">Escala de Pontuação</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Por Que PRISMA vs ChatGPT/Gemini */}
      <div className="bg-slate-900 py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Por Que PRISMA Em Vez de ChatGPT?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              ChatGPT te dá opiniões genéricas. PRISMA classifica seu problema e mostra se você precisa de IA ou não — de verdade.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* ChatGPT/Gemini Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-8"
            >
              <h3 className="text-2xl font-bold text-slate-300 mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                ChatGPT / Gemini / LLMs
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-shrink-0"></div>
                  <span>Resposta genérica e não estruturada</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-shrink-0"></div>
                  <span>Opinião baseada em dados gerais da internet</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-shrink-0"></div>
                  <span>Sem baseline de comparação com mercado</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-shrink-0"></div>
                  <span>Resposta em texto livre (não apresentável)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-shrink-0"></div>
                  <span>Análise pontual sem continuidade</span>
                </li>
              </ul>
            </motion.div>

            {/* PRISMA Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/40 via-green-900/40 to-yellow-900/40 border-2 border-blue-500/50 rounded-lg p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                PRISMA Score
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-200">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Framework proprietário</strong> validado em 150+ projetos</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Score 0-40 objetivo</strong> e comparável entre projetos</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Benchmarking implícito</strong> vs mercado brasileiro</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Relatório executivo</strong> apresentável para stakeholders</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <CheckCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Plataforma evolutiva</strong> com histórico e acompanhamento</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 text-center"
          >
            <p className="text-lg text-slate-300 leading-relaxed">
              <span className="text-blue-400 font-semibold">ChatGPT te dá opiniões genéricas.</span>{' '}
              <span className="text-white font-semibold">PRISMA classifica seu problema</span>{' '}
              e diz se você precisa de automação simples, IA aplicada ou apenas organizar processo — sem hype.
            </p>
          </motion.div>
        </div>
      </div>

      {/* O Que É PRISMA */}
      <div className="bg-white py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              O Que É PRISMA
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Sistema de clareza operacional que identifica se seu problema precisa de (A) Automação simples (B) IA aplicada (C) Organização de processo ou (D) Estrutura de decisão
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border-l-4 border-blue-600 pl-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                PRISMA É
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Filtro de clareza operacional</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Sistema que classifica problemas antes de vender solução</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Educação antes de venda</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Recomendação honesta (mesmo que não seja IA)</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border-l-4 border-slate-300 pl-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                PRISMA NÃO É
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5"></div>
                  <span className="text-slate-600">Vendedor de IA disfarçado</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5"></div>
                  <span className="text-slate-600">Ferramenta hype que promete milagres</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5"></div>
                  <span className="text-slate-600">Consultoria cara que enrola 6 meses</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5"></div>
                  <span className="text-slate-600">Chatbot genérico com resposta pronta</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Método PRISMA */}
      <div className="bg-slate-50 py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Como PRISMA Classifica
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Identificamos se seu problema exige (A) Automação simples (B) IA aplicada (C) Processo claro ou (D) Estrutura de decisão
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "A",
                title: "Automação Simples",
                description: "Tarefas repetitivas que não exigem análise. Resolvem com scripts, Zapier, Make — sem IA."
              },
              {
                number: "B",
                title: "IA Aplicada",
                description: "Problemas com variação e contexto. Exigem interpretação, não só repetição."
              },
              {
                number: "C",
                title: "Organização de Processo",
                description: "Falta clareza no fluxo. Antes de automatizar, precisa organizar como funciona."
              },
              {
                number: "D",
                title: "Estrutura de Decisão",
                description: "Precisa de critérios claros para tomar decisões consistentes — não tecnologia."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-sm p-8"
              >
                <div className="text-blue-600 text-lg font-bold mb-4">{item.number}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="bg-white py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Como Funciona o Diagnóstico
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Entrada Estruturada",
                description: "Responda questões objetivas sobre as quatro dimensões estratégicas do seu projeto."
              },
              {
                step: "2",
                title: "Análise Sistemática",
                description: "Sistema processa informações através do framework PRISMA, identificando padrões e riscos."
              },
              {
                step: "3",
                title: "Relatório Executivo",
                description: "Receba pontuação objetiva (0-40), análise detalhada e recomendações estruturadas."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-600 text-white text-2xl font-bold flex items-center justify-center">
                  {item.step}
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-8 pt-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Para Quem É */}
      <div className="bg-slate-950 py-20 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Para Quem É PRISMA
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Para quem não quer ficar no hype e precisa de clareza sobre o que realmente resolver primeiro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Empresários",
                description: "Quer saber se sua ideia precisa de IA ou se resolve com algo mais simples (e barato)."
              },
              {
                title: "Gestores de Operação",
                description: "Cansado de ver gargalo e não saber se compensa automatizar ou só organizar processo."
              },
              {
                title: "Profissionais Liberais",
                description: "Advogados, contadores, vendedores querendo saber se IA resolve de verdade ou é hype."
              },
              {
                title: "Time de Produto",
                description: "Precisa validar se vale investir em IA ou se automação simples já resolve."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-sm p-8"
              >
                <Target className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <div className="bg-slate-950 border-t border-slate-800 py-20 md:py-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
            Clareza Antes de Tecnologia
          </h2>

          <p className="text-xl text-slate-400 mb-12">
            Descubra se você precisa de IA, automação simples ou só organizar processo — em 3 minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/calculadora-chat"
              className="inline-flex items-center gap-3 px-12 py-6 bg-blue-600 text-white rounded-sm text-xl font-semibold hover:bg-blue-700 transition-all border border-blue-500"
            >
              💬 Conversar com IA
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 text-slate-300 rounded-sm text-base font-medium hover:bg-slate-700 transition-all border border-slate-700"
            >
              Usar formulário
            </Link>
          </div>

          <p className="text-sm text-slate-500 mb-8">
            ✨ Novo: Converse naturalmente com nosso assistente de IA
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-8 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Sem cadastro</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Score 0-40</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>3 minutos</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
