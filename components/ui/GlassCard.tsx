import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-white/[0.03] backdrop-blur-[10px] border border-white/[0.05] rounded-xl',
        className
      )}
    >
      {children}
    </div>
  )
}
