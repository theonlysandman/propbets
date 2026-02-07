"use client"

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', disabled, isLoading = false, ...props }, ref) => {
    const baseClasses = 'font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-target inline-flex items-center justify-center gap-2'
    
    const variantClasses: Record<string,string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'border-2 border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
      success: 'bg-gradient-secondary text-white shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:scale-[1.02] active:scale-95 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
      danger: 'bg-error text-white shadow-lg shadow-error/25 hover:shadow-error/40 hover:scale-[1.02] active:scale-95 focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    }

    const sizeClasses: Record<string,string> = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    }

    return (
      <motion.button
        ref={ref as any}
        whileHover={!disabled && !isLoading ? { scale: variant === 'primary' ? 1.02 : 1.01 } : undefined}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            ⚡
          </motion.span>
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
