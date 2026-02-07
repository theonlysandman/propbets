'use client'

import { motion } from 'framer-motion'

interface CategoryHeaderProps {
  emoji: string
  name: string
}

export function CategoryHeader({ emoji, name }: CategoryHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{emoji}</span>
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">
          {name}
        </h2>
      </div>
      <div className="h-1 bg-gradient-primary rounded-full w-32" />
    </motion.div>
  )
}
