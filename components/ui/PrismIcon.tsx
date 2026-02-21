'use client'

import { motion } from 'framer-motion'

interface PrismIconProps {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

const sizes = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
}

export function PrismIcon({ size = 'md', animate = true }: PrismIconProps) {
  return (
    <div className={`${sizes[size]} relative`}>
      {/* Outer rotating square */}
      <motion.div
        className="absolute inset-0 bg-primary/20 rotate-45 rounded-xl border border-primary/40"
        animate={animate ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner rotating square */}
      <div className="absolute inset-4 bg-primary/10 rotate-[15deg] rounded-lg border border-primary/30" />

      {/* Center diamond icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-6xl opacity-80">
          diamond
        </span>
      </div>

      {/* Light beams */}
      <div className="absolute top-1/2 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent to-primary opacity-30" />
      <div className="absolute top-1/2 right-0 w-1/3 h-[1px] bg-gradient-to-l from-transparent to-primary opacity-30" />
    </div>
  )
}
