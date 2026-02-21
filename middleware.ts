import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hasSeenOnboarding = request.cookies.get('prisma_onboarding_seen')

  // Se acessar /calculadora-chat pela primeira vez, redirecionar para onboarding
  if (request.nextUrl.pathname === '/calculadora-chat' && !hasSeenOnboarding) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Se completar onboarding, setar cookie
  if (request.nextUrl.pathname === '/calculadora-chat' && request.nextUrl.searchParams.get('from_onboarding')) {
    const response = NextResponse.next()
    response.cookies.set('prisma_onboarding_seen', 'true', { maxAge: 30 * 24 * 60 * 60 }) // 30 dias
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/calculadora-chat', '/onboarding'],
}
