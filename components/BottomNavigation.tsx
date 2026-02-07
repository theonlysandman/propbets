'use client'

import { Button } from './ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

interface BottomNavigationProps {
  canGoBack: boolean
  canContinue: boolean
  onBack: () => void
  onContinue: () => void
  isLastCategory: boolean
}

export function BottomNavigation({ 
  canGoBack, 
  canContinue, 
  onBack, 
  onContinue,
  isLastCategory 
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-20">
      {/* shorter fade */}
      <div className="absolute bottom-full left-0 right-0 h-10 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />

      <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 px-4 pt-3 pb-safe-bottom">
        {/* inline hint above buttons */}
        <AnimatePresence>
          {!canContinue && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center text-xs text-slate-500 mb-2"
            >
              Answer all questions to continue
            </motion.p>
          )}
        </AnimatePresence>

        <div className="max-w-lg mx-auto flex gap-3">
          {canGoBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex-1"
              size="lg"
            >
              <span className="text-lg">←</span>
              <span>Back</span>
            </Button>
          )}

          <Button
            variant="primary"
            onClick={onContinue}
            disabled={!canContinue}
            className={canGoBack ? 'flex-[2]' : 'flex-1'}
            size="lg"
          >
            <span>{isLastCategory ? 'Review Picks' : 'Continue'}</span>
            <span className="text-lg">→</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BottomNavigation
