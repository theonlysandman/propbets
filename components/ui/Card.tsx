"use client"

import { HTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'glass' | 'glass-strong'
  hover?: boolean
}

export function Card({ children, variant = 'glass', hover = false, className = '', ...props }: CardProps) {
  const variantClasses: Record<string,string> = {
    glass: 'glass',
    'glass-strong': 'glass-strong',
  }

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={`${variantClasses[variant]} rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
