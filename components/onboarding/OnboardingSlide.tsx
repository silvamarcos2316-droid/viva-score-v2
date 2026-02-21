'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PrismBackground } from '@/components/ui/PrismBackground'

interface OnboardingSlideProps {
  children: ReactNode
  slideNumber: number
  totalSlides: number
}

export function OnboardingSlide({ children, slideNumber, totalSlides }: OnboardingSlideProps) {
  return (
    <div className="relative min-h-screen bg-background-dark flex flex-col items-center overflow-hidden">
      <PrismBackground />

      <div className="relative z-10 w-full max-w-[430px] min-h-screen flex flex-col px-6 py-12 justify-between">
        {children}

        {/* Progress Dots */}
        <div className="flex justify-center items-center space-x-2 pb-4">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === slideNumber
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-slate-700'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: i === slideNumber ? 1 : 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
