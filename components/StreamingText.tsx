'use client'

import { useState, useEffect } from 'react'

interface StreamingTextProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export function StreamingText({ text, speed = 50, onComplete }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)

    let index = 0
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index + 1))
      index++

      if (index >= text.length) {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap">
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-1 h-5 ml-1 bg-blue-400 animate-pulse" />
      )}
    </p>
  )
}
