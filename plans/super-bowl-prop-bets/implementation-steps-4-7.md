````markdown
# Super Bowl Prop Bets Family Challenge - Implementation Guide (Steps 4–7)

## Step 4: Landing Page - Name Selection

### Step 4.1: Create UI Components Directory
- [ ] Create folder: `components/ui`

### Step 4.2: Create Button Component
- [ ] Create file `components/ui/Button.tsx`:
```typescript
'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }, ref) => {
    const baseClasses = 'font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'border-2 border-slate-600 text-slate-300 hover:bg-slate-800/50 active:scale-95',
    }

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-4 text-base',
      lg: 'px-8 py-5 text-lg',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
```

### Step 4.3: Create Card Component
- [ ] Create file `components/ui/Card.tsx`:
```typescript
'use client'

import { HTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'glass' | 'glass-strong'
  hover?: boolean
}

export function Card({ children, variant = 'glass', hover = false, className = '', ...props }: CardProps) {
  const variantClasses = {
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
```

### Step 4.4: Create Countdown Timer Component
- [ ] Create file `components/CountdownTimer.tsx`:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  targetDate: Date
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const now = new Date().getTime()
    const target = targetDate.getTime()
    const difference = target - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isLessThan24h: false }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
    const isLessThan24h = days === 0

    return { days, hours, minutes, seconds, isLessThan24h }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const { days, hours, minutes, seconds, isLessThan24h } = timeLeft

  return (
    <motion.div
      animate={isLessThan24h ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className="flex items-center gap-2 text-slate-300"
    >
      <span className="text-2xl">⏰</span>
      <span className="text-lg font-semibold">
        {days > 0 && `${days}d `}
        {hours}h {minutes}m {seconds}s
      </span>
    </motion.div>
  )
}
```

### Step 4.5: Create API Route to Check Submission Status
- [ ] Create folder: `app/api/submissions/check`
- [ ] Create file `app/api/submissions/check/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: participants, error } = await supabase
      .from('participants')
      .select('id, name, emoji, abbreviation, has_submitted')
      .order('name')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch participants' },
        { status: 500 }
      )
    }

    return NextResponse.json({ participants })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
```

### Step 4.6: Create Participant Selector Component
- [ ] Create file `components/ParticipantSelector.tsx`:
```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from './ui/Card'
import { Participant } from '@/lib/types'

interface ParticipantSelectorProps {
  onSelect: (name: string) => void
  selectedName: string | null
}

export function ParticipantSelector({ onSelect, selectedName }: ParticipantSelectorProps) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParticipants()
    // Poll every 30 seconds
    const interval = setInterval(fetchParticipants, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchParticipants() {
    try {
      const res = await fetch('/api/submissions/check')
      const data = await res.json()
      if (data.participants) {
        setParticipants(data.participants)
      }
    } catch (error) {
      console.error('Error fetching participants:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedCount = participants.filter(p => p.has_submitted).length

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass rounded-2xl h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {participants.map((participant, index) => (
          <motion.button
            key={participant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => !participant.has_submitted && onSelect(participant.name)}
            disabled={participant.has_submitted}
            className={`
              relative min-h-[80px] rounded-2xl p-4 transition-all duration-200
              ${participant.has_submitted 
                ? 'glass opacity-50 cursor-not-allowed' 
                : selectedName === participant.name
                  ? 'glass-strong border-2 border-primary shadow-lg shadow-primary/25'
                  : 'glass hover:scale-102 active:scale-98 cursor-pointer'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-3xl mb-1">{participant.emoji}</span>
              <span className="font-semibold text-sm text-center">
                {participant.name}
              </span>
            </div>
            
            {participant.has_submitted && (
              <div className="absolute top-2 right-2">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-xs">✓</span>
                </motion.span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="text-center text-slate-400">
        <span className="text-lg font-semibold text-slate-300">{completedCount}/8</span> Completed 🎯
      </div>
    </div>
  )
}
```

### Step 4.7: Update Landing Page
- [ ] Replace `app/page.tsx` with:
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ParticipantSelector } from '@/components/ParticipantSelector'
import { CountdownTimer } from '@/components/CountdownTimer'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const router = useRouter()
  const [selectedName, setSelectedName] = useState<string | null>(null)

  // Super Bowl LX date: February 8, 2026 at 6:30 PM ET
  const gameDate = new Date('2026-02-08T18:30:00-05:00')

  function handleStart() {
    if (selectedName) {
      router.push(`/submit/${encodeURIComponent(selectedName)}`)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 pb-8">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-bold mb-3 text-gradient"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🏈 SUPER BOWL LX
          </motion.h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-300 mb-2">
            Prop Bets Challenge
          </h2>
          <p className="text-slate-400">Family Edition</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-strong rounded-2xl p-6 mb-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            👤 Select Your Name
          </h3>
          <ParticipantSelector
            onSelect={setSelectedName}
            selectedName={selectedName}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full mb-4"
            disabled={!selectedName}
            onClick={handleStart}
          >
            START PICKS →
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <CountdownTimer targetDate={gameDate} />
          <p className="text-sm text-slate-500 mt-2">Game starts Feb 8 at 6:30pm ET</p>
        </motion.div>
      </div>
    </main>
  )
}
```

### Step 4 Verification Checklist
- [ ] Run `npm run dev`
- [ ] Navigate to `http://localhost:3000`
- [ ] Verify gradient animated title displays correctly
- [ ] Verify all 8 participant cards display in 2x4 grid
- [ ] Verify emoji and names show correctly for each participant
- [ ] Click on a participant card - verify border turns primary color
- [ ] Verify "START PICKS" button is disabled when no name selected
- [ ] Select a name - verify button becomes enabled
- [ ] Verify countdown timer shows and updates every second
- [ ] Verify completion status shows "0/8 Completed"
- [ ] Test responsive design (resize to mobile width)
- [ ] Verify touch targets are large enough (56px+ height)
- [ ] Check browser console for no errors

### Step 4 STOP & COMMIT
**STOP & COMMIT:** Commit these changes:
```bash
git add .
git commit -m "feat: create landing page with participant selection"
```

---

## Step 5: Question Components Library

### Step 5.1: Create Questions Components Directory
- [ ] Create folder: `components/questions`

### Step 5.2: Create Yes/No Toggle Component
- [ ] Create file `components/questions/YesNoToggle.tsx`:
```typescript
'use client'

import { motion } from 'framer-motion'

interface YesNoToggleProps {
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
}

export function YesNoToggle({ value, onChange, disabled = false }: YesNoToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.button
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        onClick={() => !disabled && onChange('YES')}
        disabled={disabled}
        className={`
          h-16 rounded-xl font-semibold text-lg transition-all duration-200
          ${value === 'YES'
            ? 'bg-gradient-primary text-white shadow-lg shadow-primary/25'
            : 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        YES
      </motion.button>

      <motion.button
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        onClick={() => !disabled && onChange('NO')}
        disabled={disabled}
        className={`
          h-16 rounded-xl font-semibold text-lg transition-all duration-200
          ${value === 'NO'
            ? 'bg-gradient-primary text-white shadow-lg shadow-primary/25'
            : 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        NO
      </motion.button>
    </div>
  )
}
```

### Step 5.3: Create Multiple Choice Component
- [ ] Create file `components/questions/MultipleChoice.tsx`:
```typescript
'use client'

import { motion } from 'framer-motion'

interface MultipleChoiceProps {
  choices: string[]
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
}

export function MultipleChoice({ choices, value, onChange, disabled = false }: MultipleChoiceProps) {
  return (
    <div className="space-y-3">
      {choices.map((choice, index) => (
        <motion.button
          key={choice}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileTap={!disabled ? { scale: 0.98 } : undefined}
          onClick={() => !disabled && onChange(choice)}
          disabled={disabled}
          className={`
            w-full min-h-[56px] px-4 py-3 rounded-xl font-semibold text-left transition-all duration-200
            ${value === choice
              ? 'bg-gradient-primary text-white shadow-lg shadow-primary/25'
              : 'bg-slate-700/30 border border-slate-600 text-slate-300 hover:bg-slate-700/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex items-center justify-between">
            <span>{choice}</span>
            {value === choice && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-white"
              >
                ✓
              </motion.span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  )
}
```

### Step 5.4: Create Over/Under Component
- [ ] Create file `components/questions/OverUnder.tsx`:
```typescript
'use client'

import { motion } from 'framer-motion'

interface OverUnderProps {
  value: string | null
  onChange: (value: string) => void
  overUnder: {
    value: number
    label: string
  }
  disabled?: boolean
}

export function OverUnder({ value, onChange, overUnder, disabled = false }: OverUnderProps) {
  return (
    <div className="flex items-center gap-4">
      <motion.button
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        onClick={() => !disabled && onChange('OVER')}
        disabled={disabled}
        className={`
          flex-1 h-20 rounded-xl font-bold text-lg transition-all duration-200
          ${value === 'OVER'
            ? 'bg-gradient-primary text-white shadow-lg shadow-primary/25'
            : 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl">▲</span>
          <span>OVER</span>
        </div>
      </motion.button>

      <div className="text-center px-2">
        <div className="text-3xl font-bold text-white">{overUnder.value}</div>
        <div className="text-xs text-slate-400 mt-1">{overUnder.label}</div>
      </div>

      <motion.button
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        onClick={() => !disabled && onChange('UNDER')}
        disabled={disabled}
        className={`
          flex-1 h-20 rounded-xl font-bold text-lg transition-all duration-200
          ${value === 'UNDER'
            ? 'bg-gradient-primary text-white shadow-lg shadow-primary/25'
            : 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl">▼</span>
          <span>UNDER</span>
        </div>
      </motion.button>
    </div>
  )
}
```

### Step 5.5: Create Question Card Component
- [ ] Create file `components/questions/QuestionCard.tsx`:
```typescript
'use client'

import { ReactNode } from 'react'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 relative"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="inline-block px-3 py-1 rounded-full bg-slate-700/50 text-slate-400 text-xs font-semibold">
          Q{questionNumber}
        </span>
        {value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 bg-green-500 rounded-full"
          />
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-6 leading-snug">
        {question.question_text}
      </h3>

      {renderAnswerComponent()}
    </motion.div>
  )
}
```

### Step 5.6: Create Category Header Component
- [ ] Create file `components/questions/CategoryHeader.tsx`:
```typescript
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
```

### Step 5.7: Create Test Page for Components
- [ ] Create file `app/components-test/page.tsx`:
```typescript
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
```

### Step 5 Verification Checklist
- [ ] Navigate to `http://localhost:3000/components-test`
- [ ] Verify category header displays with emoji and gradient underline
- [ ] Test Yes/No toggle - click both options, verify selection highlights
- [ ] Test Multiple Choice - click each option, verify only one can be selected
- [ ] Test Over/Under - click OVER and UNDER, verify selection highlights
- [ ] Verify number displays correctly between over/under buttons
- [ ] Verify green dot appears on answered questions
- [ ] Verify question number badge displays
- [ ] Test tap animations (buttons should scale on press)
- [ ] Verify glass-morphism styling on cards
- [ ] Check "Current Answers" section updates when selections change
- [ ] Test on mobile viewport (375px width)
- [ ] Verify all touch targets are 56px+ height

### Step 5 STOP & COMMIT
**STOP & COMMIT:** Commit these changes:
```bash
git add .
git commit -m "feat: create question component library (YesNo, MultipleChoice, OverUnder)"
```

---

## Step 6: Multi-Page Form Flow

### Step 6.1: Create Form State Hook with Zustand
- [ ] Create folder: `lib/hooks`
- [ ] Create file `lib/hooks/useFormState.ts`:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FormState {
  participantName: string
  answers: Record<string, string>
  currentCategoryIndex: number
  setParticipantName: (name: string) => void
  setAnswer: (questionId: string, answer: string) => void
  setCurrentCategoryIndex: (index: number) => void
  reset: () => void
  getAnswersForCategory: (questionIds: string[]) => Record<string, string>
  getCategoryProgress: (questionIds: string[]) => { answered: number; total: number }
}

export const useFormState = create<FormState>()(
  persist(
    (set, get) => ({
      participantName: '',
      answers: {},
      currentCategoryIndex: 0,
      
      setParticipantName: (name) => set({ participantName: name }),
      
      setAnswer: (questionId, answer) => 
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        })),
      
      setCurrentCategoryIndex: (index) => set({ currentCategoryIndex: index }),
      
      reset: () => set({ participantName: '', answers: {}, currentCategoryIndex: 0 }),
      
      getAnswersForCategory: (questionIds) => {
        const state = get()
        return questionIds.reduce((acc, id) => {
          if (state.answers[id]) {
            acc[id] = state.answers[id]
          }
          return acc
        }, {} as Record<string, string>)
      },
      
      getCategoryProgress: (questionIds) => {
        const state = get()
        const answered = questionIds.filter(id => state.answers[id]).length
        return { answered, total: questionIds.length }
      },
    }),
    {
      name: 'propbets-form-storage',
    }
  )
)
```

### Step 6.2: Create Progress Bar Component
- [ ] Create file `components/ProgressBar.tsx`:
```typescript
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
    <div className="sticky top-0 z-10 glass-strong backdrop-blur-lg border-b border-slate-700/50 p-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-slate-300 mb-3">
          Hi {participantName}! 👋
        </p>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2">
            {[...Array(totalCategories)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`w-3 h-3 rounded-full ${
                  index < currentIndex
                    ? 'bg-gradient-primary'
                    : index === currentIndex
                    ? 'bg-primary animate-pulse'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
          
          <span className="text-sm text-slate-400">
            {categoryName} ({currentIndex + 1}/{totalCategories})
          </span>
        </div>

        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}
```

### Step 6.3: Create Category Page Component
- [ ] Create file `components/CategoryPage.tsx`:
```typescript
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
    <div className="max-w-2xl mx-auto p-4 pb-32">
      <CategoryHeader emoji={category.emoji} name={category.name} />
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={question.question_number}
            value={answers[question.id] || null}
            onChange={(value) => onAnswerChange(question.id, value)}
          />
        ))}
      </div>
    </div>
  )
}
```

### Step 6.4: Create Bottom Navigation Component
- [ ] Create file `components/BottomNavigation.tsx`:
```typescript
'use client'

import { Button } from './ui/Button'
import { motion } from 'framer-motion'

interface BottomNavigationProps {
  canGoBack: boolean
  canContinue: boolean
  onBack: () => void
  onContinue: () => void
  isLastCategory: boolean
}

export function BottomNavigation({ 
  canGoBack, 
  canContinue, 
  onBack, 
  onContinue,
  isLastCategory 
}: BottomNavigationProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-20 pb-safe"
    >
      {/* Shadow gradient for depth */}
      <div className="absolute bottom-full left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent" />
      
      <div className="glass-strong backdrop-blur-lg border-t border-slate-700/50 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          {canGoBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex-1"
            >
              ← BACK
            </Button>
          )}
          
          <Button
            variant="primary"
            onClick={onContinue}
            disabled={!canContinue}
            className={canGoBack ? 'flex-[2]' : 'flex-1'}
          >
            {isLastCategory ? 'REVIEW →' : 'CONTINUE →'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
```

### Step 6.5: Create Main Submission Page
- [ ] Create folder: `app/submit/[name]`
- [ ] Create file `app/submit/[name]/page.tsx`:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useFormState } from '@/lib/hooks/useFormState'
import { ProgressBar } from '@/components/ProgressBar'
import { CategoryPage } from '@/components/CategoryPage'
import { BottomNavigation } from '@/components/BottomNavigation'
import { Category, Question } from '@/lib/types'

export default function SubmitPage() {
  const router = useRouter()
  const params = useParams()
  const participantName = decodeURIComponent(params.name as string)

  const {
    answers,
    currentCategoryIndex,
    setParticipantName,
    setAnswer,
    setCurrentCategoryIndex,
    getCategoryProgress,
  } = useFormState()

  const [categories, setCategories] = useState<Category[]>([])
  const [questionsByCategory, setQuestionsByCategory] = useState<Record<string, Question[]>>({})
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    setParticipantName(participantName)
    fetchQuestionsData()
  }, [participantName])

  async function fetchQuestionsData() {
    try {
      const res = await fetch('/api/questions')
      if (!res.ok) throw new Error('Failed to fetch questions')
      
      const data = await res.json()
      setCategories(data.categories)
      setQuestionsByCategory(data.questionsByCategory)
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    const currentCategory = categories[currentCategoryIndex]
    const questions = questionsByCategory[currentCategory.id] || []
    const { answered, total } = getCategoryProgress(questions.map(q => q.id))

    if (answered < total) {
      toast.error('Please answer all questions before continuing')
      return
    }

    if (currentCategoryIndex < categories.length - 1) {
      setDirection(1)
      setCurrentCategoryIndex(currentCategoryIndex + 1)
    } else {
      router.push(`/submit/${encodeURIComponent(participantName)}/review`)
    }
  }

  function handleBack() {
    if (currentCategoryIndex > 0) {
      setDirection(-1)
      setCurrentCategoryIndex(currentCategoryIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-slate-300">Loading questions...</p>
        </div>
      </div>
    )
  }

  const currentCategory = categories[currentCategoryIndex]
  const currentQuestions = questionsByCategory[currentCategory?.id] || []
  const { answered, total } = getCategoryProgress(currentQuestions.map(q => q.id))

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen">
      <ProgressBar
        participantName={participantName}
        currentIndex={currentCategoryIndex}
        totalCategories={categories.length}
        categoryName={currentCategory?.name || ''}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentCategoryIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <CategoryPage
            category={currentCategory}
            questions={currentQuestions}
            answers={answers}
            onAnswerChange={setAnswer}
          />
        </motion.div>
      </AnimatePresence>

      <BottomNavigation
        canGoBack={currentCategoryIndex > 0}
        canContinue={answered === total}
        onBack={handleBack}
        onContinue={handleNext}
        isLastCategory={currentCategoryIndex === categories.length - 1}
      />
    </div>
  )
}
```

### Step 6.6: Create API Route for Questions
- [ ] Create folder: `app/api/questions`
- [ ] Create file `app/api/questions/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('display_order')

    if (catError) throw catError

    // Fetch all questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .order('display_order')

    if (questionsError) throw questionsError

    // Group questions by category
    const questionsByCategory = questions.reduce((acc, question) => {
      const catId = question.category_id
      if (!acc[catId]) acc[catId] = []
      acc[catId].push(question)
      return acc
    }, {} as Record<string, any[]>)

    return NextResponse.json({
      categories,
      questionsByCategory,
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
```

### Step 6 Verification Checklist
- [ ] From homepage, select a name and click "START PICKS"
- [ ] Verify redirects to `/submit/[name]`
- [ ] Verify progress bar shows at top with greeting
- [ ] Verify progress dots show (7 dots for 7 categories)
- [ ] Verify first category loads with questions
- [ ] Answer all questions in first category
- [ ] Verify "CONTINUE" button becomes enabled
- [ ] Click "CONTINUE" - verify slides to next category
- [ ] Verify progress bar updates (dot fills in, percentage increases)
- [ ] Try clicking "CONTINUE" without answering all questions - verify error toast
- [ ] Click "BACK" button - verify returns to previous category
- [ ] Verify answers are preserved when navigating back
- [ ] Test slide animations (should be smooth, no jank)
- [ ] Navigate through all 7 categories
- [ ] Verify last category shows "REVIEW →" instead of "CONTINUE →"
- [ ] Refresh page mid-form - verify answers persist (Zustand localStorage)
- [ ] Test on mobile viewport (375px width)

### Step 6 STOP & COMMIT
**STOP & COMMIT:** Commit these changes:
```bash
git add .
git commit -m "feat: implement multi-page form flow with progress tracking"
```

---

## Step 7: Review Screen & Submission

### Step 7.1: Create Review Accordion Component
- [ ] Create file `components/ReviewAccordion.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
                <span className="text-2xl">{category.emoji}</span>
                <span className="font-semibold text-lg">{category.name}</span>
                <span className="text-sm text-slate-400">
                  ({questions.length} questions)
                </span>
              </div>
              <motion.span
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-slate-400"
              >
                ▶
              </motion.span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-slate-700/50 pt-3">
                    {questions.map((question) => (
                      <div key={question.id} className="text-sm">
                        <span className="text-slate-400">
                          Q{question.question_number}.
                        </span>{' '}
                        <span className="text-slate-300">{question.question_text}</span>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
```

### Step 7.2: Create Confirmation Modal Component
- [ ] Create file `components/ConfirmationModal.tsx`:
```typescript
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading = false 
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-strong rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold mb-2">Submit Your Picks?</h2>
                <p className="text-slate-300">
                  Once submitted, you cannot edit your picks.
                  Make sure all your answers are correct!
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⚡</span>
                      Submitting...
                    </span>
                  ) : (
                    'Confirm Submit'
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Step 7.3: Create Submission API Route
- [ ] Create folder: `app/api/submissions/submit`
- [ ] Create file `app/api/submissions/submit/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { participantName, answers } = body

    if (!participantName || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get participant
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('id, has_submitted')
      .eq('name', participantName)
      .single()

    if (participantError || !participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      )
    }

    // Check if already submitted
    if (participant.has_submitted) {
      return NextResponse.json(
        { error: 'You have already submitted your picks' },
        { status: 400 }
      )
    }

    // Prepare responses for insert
    const responses = Object.entries(answers).map(([questionId, answer]) => ({
      participant_id: participant.id,
      question_id: questionId,
      answer: answer as string,
    }))

    // Insert all responses
    const { error: responsesError } = await supabase
      .from('responses')
      .insert(responses)

    if (responsesError) {
      console.error('Error inserting responses:', responsesError)
      return NextResponse.json(
        { error: 'Failed to save responses' },
        { status: 500 }
      )
    }

    // Create submission record
    const { error: submissionError } = await supabase
      .from('submissions')
      .insert({
        participant_id: participant.id,
      })

    if (submissionError) {
      console.error('Error creating submission:', submissionError)
      return NextResponse.json(
        { error: 'Failed to create submission record' },
        { status: 500 }
      )
    }

    // Update participant as submitted
    const { error: updateError } = await supabase
      .from('participants')
      .update({
        has_submitted: true,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', participant.id)

    if (updateError) {
      console.error('Error updating participant:', updateError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
```

### Step 7.4: Create Review Page
- [ ] Create folder: `app/submit/[name]/review`
- [ ] Create file `app/submit/[name]/review/page.tsx`:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useFormState } from '@/lib/hooks/useFormState'
import { ReviewAccordion } from '@/components/ReviewAccordion'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { Button } from '@/components/ui/Button'
import { Category, Question } from '@/lib/types'

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const participantName = decodeURIComponent(params.name as string)

  const { answers, setCurrentCategoryIndex, reset } = useFormState()

  const [categories, setCategories] = useState<Category[]>([])
  const [questionsByCategory, setQuestionsByCategory] = useState<Record<string, Question[]>>({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuestionsData()
  }, [])

  async function fetchQuestionsData() {
    try {
      const res = await fetch('/api/questions')
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      setCategories(data.categories)
      setQuestionsByCategory(data.questionsByCategory)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(categoryIndex: number) {
    setCurrentCategoryIndex(categoryIndex)
    router.push(`/submit/${encodeURIComponent(participantName)}`)
  }

  async function handleSubmit() {
    setSubmitting(true)
    
    try {
      const res = await fetch('/api/submissions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantName,
          answers,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      toast.success('Picks submitted successfully! 🎉')
      reset() // Clear form state
      router.push(`/submit/${encodeURIComponent(participantName)}/success`)
    } catch (error: any) {
      console.error('Submission error:', error)
      toast.error(error.message || 'Failed to submit picks')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  const totalQuestions = Object.values(questionsByCategory).reduce(
    (sum, questions) => sum + questions.length,
    0
  )
  const answeredQuestions = Object.keys(answers).length
  const allAnswered = answeredQuestions === totalQuestions

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">📋 Review Your Picks</h1>
          <div className="h-1 bg-gradient-primary rounded-full w-32" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <ReviewAccordion
            categories={categories}
            questionsByCategory={questionsByCategory}
            answers={answers}
            onEdit={handleEdit}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-xl p-6 mb-6 text-center"
        >
          {allAnswered ? (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">
                All {totalQuestions} questions answered
              </span>
            </div>
          ) : (
            <div className="text-amber-400">
              <span className="font-semibold">
                {answeredQuestions}/{totalQuestions} questions answered
              </span>
              <p className="text-sm text-slate-400 mt-1">
                Please answer all questions before submitting
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!allAnswered}
            onClick={() => setShowModal(true)}
          >
            SUBMIT FINAL PICKS 🎯
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push(`/submit/${encodeURIComponent(participantName)}`)}
          >
            ← Back to Questions
          </Button>
        </motion.div>

        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleSubmit}
          loading={submitting}
        />
      </div>
    </div>
  )
}
```

### Step 7 Verification Checklist
- [ ] Complete form flow through all 7 categories
- [ ] Verify redirects to review page after last category
- [ ] Verify all categories display in accordion
- [ ] Click category to expand - verify shows all questions and answers
- [ ] Verify "All 30 questions answered" message shows
- [ ] Click "Edit answers" on a category - verify navigates back to that category
- [ ] Edit an answer and return to review - verify change is reflected
- [ ] Click "SUBMIT FINAL PICKS" - verify confirmation modal appears
- [ ] Click "Cancel" on modal - verify modal closes without submitting
- [ ] Click "Confirm Submit" - verify loading state shows
- [ ] Verify success toast appears after submission
- [ ] Verify redirects to success page
- [ ] Try submitting same participant again - verify error prevents duplicate
- [ ] Check Supabase database:
  - [ ] Verify responses table has 30 new rows
  - [ ] Verify submissions table has 1 new row
  - [ ] Verify participant has_submitted = true

### Step 7 STOP & COMMIT
**STOP & COMMIT:** Commit these changes:
```bash
git add .
git commit -m "feat: implement review screen and submission flow"
```

---

Due to length constraints, I'll create a second message with Steps 8-11. Please proceed with testing Steps 1-7 first, then I'll provide the remaining implementation steps.

Would you like me to continue with Steps 8-11 (Success Page, Results Page, Admin Panel, and Deployment)?
````