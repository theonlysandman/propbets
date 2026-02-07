'use client'

import { QuestionCard } from './questions/QuestionCard'
import { CategoryHeader } from './questions/CategoryHeader'
import { Question, Category } from '@/lib/types'

interface CategoryPageProps {
  category: Category
  questions: Question[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, answer: string) => void
}

export function CategoryPage({ 
  category, 
  questions, 
  answers, 
  onAnswerChange 
}: CategoryPageProps) {
  return (
    <div className="max-w-lg mx-auto px-4 pt-2 pb-32">
      <CategoryHeader emoji={(category as any).emoji || '🏈'} name={(category as any).title || (category as any).name || ''} />
      
      <div className="divide-y divide-slate-600/60">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={(question as any).question_number || index + 1}
            value={answers[question.id] || null}
            onChange={(value) => onAnswerChange(question.id, value)}
          />
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
