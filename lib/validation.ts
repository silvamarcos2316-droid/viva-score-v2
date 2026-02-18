import { z } from 'zod'

export const FormDataSchema = z.object({
  // Step 1: Visão
  projectName: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  problemStatement: z
    .string()
    .min(50, 'Descrição deve ter no mínimo 50 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),

  // Step 2: Integração
  techStack: z
    .array(z.string())
    .min(1, 'Selecione pelo menos uma tecnologia'),
  integrationNeeds: z
    .string()
    .min(30, 'Descreva as integrações com no mínimo 30 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),

  // Step 3: Viabilidade
  budgetRange: z.enum(['0-100', '100-500', '500-2000', '2000+']),
  roiExpectation: z
    .string()
    .min(30, 'Descreva o ROI esperado com no mínimo 30 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),

  // Step 4: Execução
  timeline: z.enum(['1-week', '2-4-weeks', '1-3-months', '3-months+']),
  blockers: z
    .string()
    .min(20, 'Descreva os bloqueadores com no mínimo 20 caracteres')
    .max(1000, 'Máximo 1000 caracteres'),
})

export type FormData = z.infer<typeof FormDataSchema>
