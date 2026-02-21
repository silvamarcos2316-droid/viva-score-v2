'use client'

export function PrismBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Top Left Prism Shape */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rotate-45 blur-3xl rounded-full" />

      {/* Center Refraction */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-2xl opacity-40"
        style={{
          background: 'linear-gradient(135deg, rgba(19, 127, 236, 0.15) 0%, rgba(16, 25, 34, 0) 50%, rgba(19, 127, 236, 0.05) 100%)'
        }}
      />

      {/* Bottom Right Prism Shape */}
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-primary/5 -rotate-12 blur-3xl rounded-full" />
    </div>
  )
}
