'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  participantName: string
  currentIndex: number
  totalCategories: number
  categoryName: string
}

export function ProgressBar({ 
  participantName, 
  currentIndex, 
  totalCategories, 
  categoryName 
}: ProgressBarProps) {
  const progress = ((currentIndex + 1) / totalCategories) * 100

  return (
    <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-2.5">
        <p className="text-sm font-semibold text-slate-200 truncate">
          {categoryName}
        </p>
        <span className="flex-shrink-0 text-xs font-bold text-slate-400 bg-slate-800/60 px-2.5 py-0.5 rounded-full tabular-nums">
          {currentIndex + 1} / {totalCategories}
        </span>
      </div>

      {/* thin segmented progress */}
      <div className="flex gap-[3px] px-4 pb-1.5">
        {[...Array(totalCategories)].map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${
              index < currentIndex
                ? 'bg-primary-400'
                : index === currentIndex
                ? 'bg-primary-400'
                : 'bg-slate-700/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default ProgressBar
