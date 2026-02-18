// VIVA Score Types
export interface FormData {
  // Step 1: Visão
  projectName: string
  problemStatement: string

  // Step 2: Integração
  techStack: string[]
  integrationNeeds: string

  // Step 3: Viabilidade
  budgetRange: string
  roiExpectation: string

  // Step 4: Execução
  timeline: string
  blockers: string
}

export interface DimensionScore {
  score: number // 0-10
  analysis: string
}

export interface VivaScores {
  visao: DimensionScore
  integracao: DimensionScore
  viabilidade: DimensionScore
  execucao: DimensionScore
  total: number // 0-40
}

export interface AnalysisResult {
  scores: VivaScores
  risks: string[] // 3 critical risks
  strengths: string[] // 3 key strengths
  nextSteps: string[] // 3 action items
  classification: Classification
  questions: string[] // 3-5 clarifying questions
  missingInfo: string[] // What's missing for better analysis
}

export type Classification =
  | 'baixa-viabilidade' // 0-15
  | 'potencial-moderado' // 16-25
  | 'potencial-alto' // 26-35
  | 'alta-viabilidade' // 36-40
