import { Classification, VivaScores } from './types'

export function calculateTotalScore(scores: VivaScores): number {
  return (
    scores.visao.score +
    scores.integracao.score +
    scores.viabilidade.score +
    scores.execucao.score
  )
}

export function classifyScore(total: number): Classification {
  if (total >= 36) return 'alta-viabilidade' // 36-40
  if (total >= 26) return 'potencial-alto' // 26-35
  if (total >= 16) return 'potencial-moderado' // 16-25
  return 'baixa-viabilidade' // 0-15
}

export function getClassificationLabel(classification: Classification): string {
  const labels: Record<Classification, string> = {
    'alta-viabilidade': 'Alta Viabilidade Estratégica',
    'potencial-alto': 'Potencial Alto com Ajustes',
    'potencial-moderado': 'Potencial Moderado',
    'baixa-viabilidade': 'Baixa Viabilidade',
  }
  return labels[classification]
}

export function getClassificationColor(classification: Classification): string {
  const colors: Record<Classification, string> = {
    'alta-viabilidade': 'text-green-600 bg-green-50 border-green-200',
    'potencial-alto': 'text-blue-600 bg-blue-50 border-blue-200',
    'potencial-moderado': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'baixa-viabilidade': 'text-red-600 bg-red-50 border-red-200',
  }
  return colors[classification]
}

export function validateScores(scores: VivaScores): boolean {
  return (
    scores.visao.score >= 0 &&
    scores.visao.score <= 10 &&
    scores.integracao.score >= 0 &&
    scores.integracao.score <= 10 &&
    scores.viabilidade.score >= 0 &&
    scores.viabilidade.score <= 10 &&
    scores.execucao.score >= 0 &&
    scores.execucao.score <= 10
  )
}
