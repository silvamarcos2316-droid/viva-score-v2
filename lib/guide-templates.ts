export interface GuideStep {
  title: string
  description: string
  icon: string // Material Symbol name
  tools?: string[] // Zapier, Make, n8n, etc.
  estimatedTime?: string
  difficulty?: 'fácil' | 'médio' | 'avançado'
}

export interface Guide {
  profession: string
  classification: 'alta-viabilidade' | 'potencial-alto' | 'potencial-moderado' | 'baixa-viabilidade'
  title: string
  subtitle: string
  hero: {
    headline: string
    subheadline: string
  }
  automation: GuideStep[]
  iaUse: GuideStep[]
  truthBomb: string // "80% vem de X, não IA"
  bottlenecks: string[]
  communityValue: string
}

// Example template
export const guideTemplates: Record<string, Partial<Guide>> = {
  mecanico: {
    profession: 'Mecânico',
    hero: {
      headline: 'Automação para Oficinas',
      subheadline: 'Do agendamento ao pós-venda, sem contratar TI',
    },
    automation: [
      {
        title: 'Agendamento Automático',
        description: 'Cliente agenda direto no WhatsApp, vai pro Google Calendar, confirma sozinho 1 dia antes.',
        icon: 'event',
        tools: ['Calendly', 'Google Calendar', 'WhatsApp Business API'],
        estimatedTime: '2h setup',
        difficulty: 'fácil',
      },
      {
        title: 'Catálogo de Peças Sincronizado',
        description: 'Estoque atualiza automaticamente quando você compra ou vende. Sem planilha manual.',
        icon: 'inventory',
        tools: ['Google Sheets', 'Zapier', 'Notion'],
        estimatedTime: '3h setup',
        difficulty: 'médio',
      },
    ],
    iaUse: [
      {
        title: 'Diagnóstico por Foto',
        description: 'Cliente manda foto do problema, IA sugere peças e serviço provável. Mas você valida.',
        icon: 'photo_camera',
        tools: ['ChatGPT Vision', 'WhatsApp'],
        estimatedTime: '1h setup',
        difficulty: 'médio',
      },
    ],
    truthBomb: '80% do ganho vem de:\n✔ Agendamento sem WhatsApp manual\n✔ Follow-up automático de revisão',
    bottlenecks: [
      'Cliente esquece de buscar o carro',
      'Você não lembra de ligar pra cobrar',
      'Orçamento demora 2 dias pra sair',
    ],
    communityValue: 'No grupo tem mecânicos que automatizaram 70% do atendimento com R$ 200/mês de ferramenta.',
  },

  advogado: {
    profession: 'Advogado',
    hero: {
      headline: 'Automação para Escritórios de Advocacia',
      subheadline: 'Dos prazos processuais à cobrança, sem perder prazos',
    },
    automation: [
      {
        title: 'Controle de Prazos Automatizado',
        description: 'Sistema notifica você 7, 3 e 1 dia antes de cada prazo. Integra com e-SAJ/PJe.',
        icon: 'gavel',
        tools: ['Google Calendar', 'Zapier', 'Todoist', 'Make'],
        estimatedTime: '3h setup',
        difficulty: 'médio',
      },
      {
        title: 'Cobrança Recorrente Sem Esquecimento',
        description: 'Cliente recebe email/WhatsApp automático quando pagamento atrasa. Você só age se não pagar.',
        icon: 'payments',
        tools: ['Stripe', 'Asaas', 'WhatsApp Business API'],
        estimatedTime: '2h setup',
        difficulty: 'fácil',
      },
    ],
    iaUse: [
      {
        title: 'Análise de Contratos com IA',
        description: 'IA lê contrato e aponta cláusulas problemáticas. Mas você revisa tudo antes de enviar pro cliente.',
        icon: 'description',
        tools: ['ChatGPT API', 'Claude API'],
        estimatedTime: '4h setup',
        difficulty: 'avançado',
      },
    ],
    truthBomb: '80% do ganho vem de:\n✔ Nunca perder prazo\n✔ Cobrar sem constrangimento',
    bottlenecks: [
      'Perder prazo processual (já aconteceu)',
      'Cliente não paga e você fica sem jeito de cobrar',
      'Tempo perdido formatando petições repetitivas',
    ],
    communityValue: 'Advogados no grupo compartilham templates de automação que economizam 10h/semana.',
  },

  contador: {
    profession: 'Contador',
    hero: {
      headline: 'Automação para Contabilidade',
      subheadline: 'Das obrigações fiscais à conciliação bancária',
    },
    automation: [
      {
        title: 'Conciliação Bancária Automática',
        description: 'Extrato bancário entra no sistema, concilia sozinho com notas fiscais. Você só confere.',
        icon: 'account_balance',
        tools: ['Pluggy', 'Zapier', 'Google Sheets', 'Notion'],
        estimatedTime: '4h setup',
        difficulty: 'avançado',
      },
      {
        title: 'Lembretes de Obrigações Fiscais',
        description: 'Sistema avisa cliente e você sobre prazos (DCTF, EFD, SPED). Cliente envia docs no prazo.',
        icon: 'calendar_month',
        tools: ['Google Calendar', 'WhatsApp Business API', 'Email'],
        estimatedTime: '2h setup',
        difficulty: 'fácil',
      },
    ],
    iaUse: [
      {
        title: 'Classificação de Despesas com IA',
        description: 'IA lê nota fiscal e classifica em plano de contas. Mas você valida antes de lançar.',
        icon: 'receipt_long',
        tools: ['ChatGPT API', 'Claude API', 'Google Vision'],
        estimatedTime: '5h setup',
        difficulty: 'avançado',
      },
    ],
    truthBomb: '80% do ganho vem de:\n✔ Cliente enviar docs no prazo\n✔ Conciliação sem planilha manual',
    bottlenecks: [
      'Cliente envia documentos atrasados',
      'Tempo perdido conciliando extrato manualmente',
      'Erros de digitação em lançamentos',
    ],
    communityValue: 'Contadores no grupo economizam 15h/mês automatizando conciliação e lembretes.',
  },

  vendedor: {
    profession: 'Vendedor',
    hero: {
      headline: 'Automação para Vendas',
      subheadline: 'Do lead ao pós-venda, sem perder oportunidade',
    },
    automation: [
      {
        title: 'Follow-up Automático de Propostas',
        description: 'Cliente recebe proposta. Sistema envia follow-up automático 2, 5 e 10 dias depois.',
        icon: 'mail',
        tools: ['Gmail', 'Zapier', 'Pipedrive', 'HubSpot'],
        estimatedTime: '2h setup',
        difficulty: 'fácil',
      },
      {
        title: 'Qualificação de Leads Sem Perder Tempo',
        description: 'Lead preenche formulário. Sistema pontua automaticamente (hot/warm/cold). Você só atende hot.',
        icon: 'star',
        tools: ['Typeform', 'Google Forms', 'Zapier', 'Notion'],
        estimatedTime: '3h setup',
        difficulty: 'médio',
      },
    ],
    iaUse: [
      {
        title: 'Respostas Personalizadas em Escala',
        description: 'IA gera resposta personalizada pra cada lead. Mas você revisa antes de enviar.',
        icon: 'smart_toy',
        tools: ['ChatGPT API', 'Claude API'],
        estimatedTime: '3h setup',
        difficulty: 'médio',
      },
    ],
    truthBomb: '80% do ganho vem de:\n✔ Nunca esquecer follow-up\n✔ Focar só em leads quentes',
    bottlenecks: [
      'Esquecer de dar follow-up em proposta',
      'Perder tempo com lead frio',
      'Não saber qual lead priorizar',
    ],
    communityValue: 'Vendedores no grupo aumentaram 40% de conversão automatizando follow-up e qualificação.',
  },

  padeiro: {
    profession: 'Padeiro',
    hero: {
      headline: 'Automação para Padarias',
      subheadline: 'Do pedido à entrega, sem papel e caneta',
    },
    automation: [
      {
        title: 'Pedidos por WhatsApp Organizados',
        description: 'Cliente pede no WhatsApp. Sistema organiza tudo numa planilha/Notion. Sem papel.',
        icon: 'shopping_cart',
        tools: ['WhatsApp Business API', 'Google Sheets', 'Notion', 'Zapier'],
        estimatedTime: '2h setup',
        difficulty: 'fácil',
      },
      {
        title: 'Confirmação de Pedido Automática',
        description: 'Cliente faz pedido. Sistema confirma automaticamente "Pedido recebido! Pronto às 18h".',
        icon: 'check_circle',
        tools: ['WhatsApp Business API', 'Twilio'],
        estimatedTime: '1h setup',
        difficulty: 'fácil',
      },
    ],
    iaUse: [
      {
        title: 'Previsão de Demanda',
        description: 'IA analisa vendas passadas e sugere quanto produzir. Reduz desperdício.',
        icon: 'analytics',
        tools: ['Google Sheets', 'ChatGPT API', 'Excel'],
        estimatedTime: '4h setup',
        difficulty: 'avançado',
      },
    ],
    truthBomb: '80% do ganho vem de:\n✔ Organização de pedidos sem papel\n✔ Cliente não precisa ligar',
    bottlenecks: [
      'Pedidos bagunçados no papel',
      'Cliente esquece de buscar',
      'Produz demais e sobra (ou de menos e falta)',
    ],
    communityValue: 'Padeiros no grupo reduziram 30% de desperdício organizando pedidos e prevendo demanda.',
  },
}
