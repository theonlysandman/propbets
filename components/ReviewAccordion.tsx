'use client'

import { useState, useMemo } from 'react'
import { Category, Question } from '@/lib/types'

interface ReviewAccordionProps {
  categories: Category[]
  questionsByCategory: Record<string, Question[]>
  answers: Record<string, string>
  onEdit: (categoryIndex: number) => void
}

export function ReviewAccordion({ 
  categories, 
  questionsByCategory, 
  answers,
  onEdit 
}: ReviewAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {categories.map((category, index) => {
        const questions = questionsByCategory[category.id] || []
        const isExpanded = expandedIndex === index

        return (
          <div key={category.id} className="glass rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{(category as any).emoji || '🏈'}</span>
                <span className="font-semibold text-lg">{(category as any).title || category.name}</span>
                <span className="text-sm text-slate-400">({questions.length} questions)</span>
              </div>
              <span
                className="text-slate-400 transition-transform duration-200"
                style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                ▶
              </span>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-2 border-t border-slate-700/50 pt-3">
                {questions.map((question) => (
                  <div key={question.id} className="text-sm">
                    <span className="text-slate-400">Q{(question as any).question_number}.</span>{' '}
                    <span className="text-slate-300">{(question as any).question_text || question.prompt}</span>
                    <div className="ml-6 mt-1">
                      <span className="text-primary font-semibold">
                        {answers[question.id] || '(Not answered)'}
                      </span>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => onEdit(index)}
                  className="mt-3 text-sm text-accent hover:text-accent/80 font-semibold"
                >
                  ✏️ Edit answers
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ReviewAccordion
