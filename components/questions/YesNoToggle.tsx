'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface YesNoToggleProps {
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
}

const OPTIONS = ['YES', 'NO'] as const

export function YesNoToggle({ value, onChange, disabled = false }: YesNoToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-5" role="radiogroup" aria-label="Yes or No">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt
        return (
          <motion.button
            key={opt}
            role="radio"
            aria-checked={isSelected}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
            onClick={() => !disabled && onChange(opt)}
            disabled={disabled}
            className={[
              'group min-h-[56px] rounded-xl border-2',
              'transition-all duration-200 touch-target flex items-center justify-center gap-2.5',
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
              'text-base font-semibold transition-colors duration-200',
              isSelected ? 'text-white' : 'text-slate-300 group-hover:text-slate-100',
            ].join(' ')}>
              {opt}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
