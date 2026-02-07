'use client'

import { motion } from 'framer-motion'
import { Question } from '@/lib/types'
import { YesNoToggle } from './YesNoToggle'
import { MultipleChoice } from './MultipleChoice'
import { OverUnder } from './OverUnder'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
}

export function QuestionCard({ 
  question, 
  questionNumber, 
  value, 
  onChange, 
  disabled = false 
}: QuestionCardProps) {
  function renderAnswerComponent() {
    const { question_type, options } = question

    switch (question_type) {
      case 'YES_NO':
        return <YesNoToggle value={value} onChange={onChange} disabled={disabled} />
      
      case 'MULTIPLE_CHOICE':
        return (
          <MultipleChoice
            choices={options.choices || []}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )
      
      case 'OVER_UNDER':
        return (
          <OverUnder
            value={value}
            onChange={onChange}
            overUnder={options.overUnder || { value: 0, label: '' }}
            disabled={disabled}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-5 first:pt-0"
    >
      {/* question label row */}
      <div className="flex items-start gap-2.5 mb-3">
        <span className="mt-0.5 text-sm font-bold text-slate-500 tabular-nums">
          {questionNumber}.
        </span>
        <h3 className="flex-1 text-[0.95rem] font-semibold text-slate-100 leading-snug">
          {question.question_text}
        </h3>
      </div>

      {/* answer component */}
      {renderAnswerComponent()}
    </motion.div>
  )
}
