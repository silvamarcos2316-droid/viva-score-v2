// Analytics and tracking utilities

// Check if user has given consent
export function hasTrackingConsent(): boolean {
  if (typeof window === 'undefined') return false
  const consent = localStorage.getItem('prisma-consent')
  return consent === 'accepted'
}

export interface TrackingEvent {
  event: string
  timestamp: string
  data?: Record<string, any>
  sessionId?: string
}

export interface AnalysisSubmission {
  id: string
  timestamp: string
  formData: {
    projectName: string
    problemStatement: string
    techStack: string[]
    integrationNeeds: string
    budgetRange: string
    roiExpectation: string
    timeline: string
    blockers: string
  }
  analysis: {
    scores: {
      vision: number
      integration: number
      viability: number
      execution: number
      total: number
    }
    classification: string
    risks: string[]
    strengths: string[]
    nextSteps: string[]
    questions: string[]
    missingInfo: string[]
  }
  userEmail?: string
  userName?: string
}

// Generate unique session ID
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem('prisma-session-id')
  if (!sessionId) {
    sessionId = generateSessionId()
    sessionStorage.setItem('prisma-session-id', sessionId)
  }
  return sessionId
}

// Track event (client-side)
export async function trackEvent(event: string, data?: Record<string, any>) {
  // Check consent before tracking
  if (!hasTrackingConsent()) {
    console.log('[Tracking] User has not given consent, skipping event:', event)
    return
  }

  try {
    const sessionId = getSessionId()
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        sessionId,
        data,
      }),
    })
  } catch (error) {
    console.error('Tracking error:', error)
  }
}

// Track step completion
export function trackStepCompleted(step: number) {
  trackEvent('step_completed', { step })
}

// Track analysis submission
export async function trackAnalysisSubmission(submission: Omit<AnalysisSubmission, 'id' | 'timestamp'>) {
  try {
    const sessionId = getSessionId()
    await fetch('/api/track/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: generateSessionId(),
        timestamp: new Date().toISOString(),
        sessionId,
        ...submission,
      }),
    })
  } catch (error) {
    console.error('Analysis tracking error:', error)
  }
}

// Track email capture
export function trackEmailCapture(email: string, name: string) {
  trackEvent('email_captured', { email, name })
}

// Track page view
export function trackPageView(page: string) {
  trackEvent('page_view', { page })
}
