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
              Decida com a lógica de negócios AI-First.
            </h1>

            <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-8 tracking-tight">
              PRISMA
            </div>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-4 max-w-3xl mx-auto leading-relaxed"
            >
              Framework estruturado com os critérios das empresas que constroem IA desde a fundação.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-blue-400 max-w-2xl mx-auto font-medium"
            >
              Clareza objetiva. Decisão informada.
            </motion.p>
          </motion.div>

          {/* Value Props Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-8">
              <BarChart3 className="w-10 h-10 text-blue-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-2">4 Dimensões</div>
              <div className="text-slate-400">Análise estruturada em Visão, Integração, Viabilidade e Execução</div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-8">
              <Shield className="w-10 h-10 text-blue-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Método PRISMA</div>
              <div className="text-slate-400">Framework proprietário para diagnóstico de projetos AI-First</div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-8">
              <Layers className="w-10 h-10 text-blue-400 mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Plataforma Contínua</div>
              <div className="text-slate-400">Sistema evolutivo, não ferramenta pontual</div>
            </div>
          </motion.div>

          {/* CTA Bifurcado */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Path 1: Iniciante - Filtro de Lucidez */}
              <div className="bg-slate-900/50 backdrop-blur-sm border-2 border-blue-500 rounded-sm p-8 flex flex-col">
                <div className="mb-4">
                  <div className="text-blue-400 text-sm font-semibold mb-2 uppercase tracking-wider">Filtro de Lucidez</div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Você está no hype ou tem problema real?
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    5 perguntas pra descobrir se você precisa de IA ou só de automação simples
                  </p>
                </div>
                <Link
                  href="/filtro-lucidez"
                  className="mt-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-sm text-base font-semibold hover:bg-blue-700 transition-all border border-blue-500"
                >
                  Fazer o filtro
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-slate-600 mt-3 text-xs text-center">
                  A maioria não precisa • Recomendação honesta • 2 minutos
                </p>
              </div>

              {/* Path 2: Avançado - V.I.V.A. */}
              <div className="bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700 rounded-sm p-8 flex flex-col">
                <div className="mb-4">
                  <div className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wider">Diagnóstico Completo</div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Já sei o que quero validar
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    Tenho um projeto de IA definido e quero validar viabilidade técnica e estratégica
                  </p>
                </div>
                <Link
                  href="/calculator"
                  className="mt-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-sm text-base font-semibold hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Fazer V.I.V.A.
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-slate-600 mt-3 text-xs text-center">
                  4 dimensões • Score 0-40 • 3 minutos
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
              Plataforma de diagnóstico estratégico para empresas que buscam evolução estruturada na lógica AI-First
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
                  <span className="text-slate-700">Sistema estruturado de análise estratégica</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Instrumento executivo de decisão</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Plataforma com ecossistema embutido</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Framework de diagnóstico contínuo</span>
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
                  <span className="text-slate-600">Mentoria ou grupo de networking</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5"></div>
                  <span className="text-slate-600">Ferramenta hype de inteligência artificial</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5"></div>
                  <span className="text-slate-600">Curso ou conteúdo educacional</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5"></div>
                  <span className="text-slate-600">Solução pontual sem continuidade</span>
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
              Método PRISMA
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Framework estruturado em quatro dimensões estratégicas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Visão",
                description: "Clareza sobre o problema central e proposta de valor. Validação da hipótese estratégica."
              },
              {
                number: "02",
                title: "Integração",
                description: "Arquitetura técnica e integrações necessárias. Viabilidade de implementação."
              },
              {
                number: "03",
                title: "Viabilidade",
                description: "Recursos financeiros, ROI esperado e sustentabilidade econômica do projeto."
              },
              {
                number: "04",
                title: "Execução",
                description: "Cronograma realista, riscos identificados e plano de ação estruturado."
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
              Plataforma desenvolvida para perfis empresariais que buscam clareza estratégica
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Fundadores e CEOs",
                description: "Validação estratégica antes de alocar recursos significativos em projetos de IA."
              },
              {
                title: "Líderes de Produto",
                description: "Análise estruturada de viabilidade técnica e alinhamento estratégico."
              },
              {
                title: "Executivos de Inovação",
                description: "Framework para apresentação de projetos com dados objetivos."
              },
              {
                title: "Investidores e Advisors",
                description: "Due diligence estruturada de projetos AI-First em estágio inicial."
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
            Decida com Critérios AI-First
          </h2>

          <p className="text-xl text-slate-400 mb-12">
            Framework estruturado de análise em quatro dimensões. Clareza objetiva para decisões complexas.
          </p>

          <Link
            href="/calculator"
            className="inline-flex items-center gap-3 px-12 py-6 bg-blue-600 text-white rounded-sm text-xl font-semibold hover:bg-blue-700 transition-all border border-blue-500"
          >
            Analisar meu projeto agora
            <ArrowRight className="w-6 h-6" />
          </Link>

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
