'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, CheckCircle } from 'lucide-react'

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const hasConsent = localStorage.getItem('prisma-consent')
    if (!hasConsent) {
      // Mostra banner após 2 segundos (não ser intrusivo imediatamente)
      setTimeout(() => setShowBanner(true), 2000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('prisma-consent', 'accepted')
    localStorage.setItem('prisma-consent-date', new Date().toISOString())
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  const handleReject = () => {
    localStorage.setItem('prisma-consent', 'rejected')
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm shadow-2xl overflow-hidden">
              <div className="relative">
                {/* Top border */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600"></div>

                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-sm p-4">
                        <Shield className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Privacidade e Dados
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-3">
                        Utilizamos cookies e análise de uso para melhorar a experiência da plataforma PRISMA.
                        Seus dados são tratados com segurança conforme a <strong>LGPD</strong>.
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span>Dados anonimizados</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span>Sem venda de dados</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span>Controle total</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReject}
                        className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all whitespace-nowrap"
                      >
                        Rejeitar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAccept}
                        className="px-6 py-3 bg-blue-600 text-white rounded-sm font-semibold hover:bg-blue-700 transition-all whitespace-nowrap border border-blue-500"
                      >
                        Aceitar
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
