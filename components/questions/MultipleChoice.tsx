'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface MultipleChoiceProps {
  choices: string[]
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
}

export function MultipleChoice({ choices, value, onChange, disabled = false }: MultipleChoiceProps) {
  return (
    <div className="space-y-5" role="radiogroup">
      {choices.map((choice, index) => {
        const isSelected = value === choice
        return (
          <motion.button
            key={choice}
            role="radio"
            aria-checked={isSelected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            onClick={() => !disabled && onChange(choice)}
            disabled={disabled}
            className={[
              'group w-full min-h-[56px] px-4 py-3 rounded-xl text-left border-2',
              'transition-all duration-200 touch-target flex items-center gap-3',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              isSelected
                ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : value
                  ? 'bg-slate-800/20 border-transparent opacity-50'
                  : 'bg-slate-800/20 border-transparent hover:bg-slate-800/40 hover:border-slate-600/60',
            ].join(' ')}
          >
            {/* radio indicator */}
            <span className={[
              'flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200',
              'flex items-center justify-center',
              isSelected
                ? 'border-emerald-400 bg-emerald-500'
                : 'border-slate-600 bg-transparent group-hover:border-slate-500',
            ].join(' ')}>
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </span>

            {/* label */}
            <span className={[
              'flex-1 text-base font-medium transition-colors duration-200',
              isSelected ? 'text-white' : 'text-slate-300 group-hover:text-slate-100',
            ].join(' ')}>
              {choice}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
