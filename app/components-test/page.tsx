'use client'

import { useState } from 'react'
import { QuestionCard } from '@/components/questions/QuestionCard'
import { CategoryHeader } from '@/components/questions/CategoryHeader'
import { Question } from '@/lib/types'

export default function ComponentsTest() {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const sampleQuestions: Question[] = [
    {
      id: '1',
      category_id: 'cat1',
      question_text: 'Will there be overtime?',
      question_number: 1,
      question_type: 'YES_NO',
      options: { type: 'YES_NO' },
      correct_answer: null,
      display_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      category_id: 'cat1',
      question_text: 'Which team will win?',
      question_number: 2,
      question_type: 'MULTIPLE_CHOICE',
      options: { 
        type: 'MULTIPLE_CHOICE', 
        choices: ['Team A', 'Team B', 'It will be a tie'] 
      },
      correct_answer: null,
      display_order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      category_id: 'cat1',
      question_text: 'Total points scored',
      question_number: 3,
      question_type: 'OVER_UNDER',
      options: { 
        type: 'OVER_UNDER', 
        overUnder: { value: 50.5, label: '50.5 points' } 
      },
      correct_answer: null,
      display_order: 3,
      created_at: new Date().toISOString(),
    },
  ]

  return (
    <main className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Component Library Test</h1>
        <p className="text-slate-400 text-center mb-8">
          Testing all question component types
        </p>

        <CategoryHeader emoji="🏈" name="Sample Category" />

        <div className="space-y-6">
          {sampleQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              value={answers[question.id] || null}
              onChange={(value) => setAnswers(prev => ({ ...prev, [question.id]: value }))}
            />
          ))}
        </div>

        <div className="mt-8 glass-strong rounded-xl p-6">
          <h3 className="font-semibold mb-2">Current Answers:</h3>
          <pre className="text-xs text-slate-400 overflow-auto">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  )
}
