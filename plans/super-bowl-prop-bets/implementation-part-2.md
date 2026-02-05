# Super Bowl Prop Bets - Implementation Guide (Part 2)

## Steps 8-11: Success Page, Results, Admin Panel & Deployment

This document continues from [implementation.md](implementation.md) - complete Steps 1-7 first.

---

## Step 8: Success Page with Confetti

### Step 8.1: Create Confetti Animation Component
- [ ] Create file `components/ConfettiAnimation.tsx`:
```typescript
'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

export function ConfettiAnimation() {
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b']

    function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  return null
}
```

### Step 8.2: Create Submission Stats Component
- [ ] Create file `components/SubmissionStats.tsx`:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

interface SubmissionStatsProps {
  participantName: string
}

export function SubmissionStats({ participantName }: SubmissionStatsProps) {
  const [stats, setStats] = useState({
    totalQuestions: 30,
    submittedAt: new Date(),
    completedCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/submissions/check')
      const data = await res.json()
      
      if (data.participants) {
        const completedCount = data.participants.filter((p: any) => p.has_submitted).length
        setStats(prev => ({ ...prev, completedCount }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="glass-strong rounded-2xl p-6 space-y-3"
    >
      <div className="flex items-center gap-3 text-slate-300">
        <span className="text-2xl">✅</span>
        <span>
          <span className="font-semibold text-white">{stats.totalQuestions}</span> questions answered
        </span>
      </div>

      <div className="flex items-center gap-3 text-slate-300">
        <span className="text-2xl">⏰</span>
        <span>
          Submitted {format(stats.submittedAt, 'MMM d')} @ {format(stats.submittedAt, 'h:mm a')}
        </span>
      </div>

      {!loading && (
        <div className="flex items-center gap-3 text-slate-300">
          <span className="text-2xl">🎯</span>
          <span>
            <span className="font-semibold text-white">{stats.completedCount}/8</span> family members completed
          </span>
        </div>
      )}
    </motion.div>
  )
}
```

### Step 8.3: Create Success Page
- [ ] Create folder: `app/submit/[name]/success`
- [ ] Create file `app/submit/[name]/success/page.tsx`:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ConfettiAnimation } from '@/components/ConfettiAnimation'
import { SubmissionStats } from '@/components/SubmissionStats'
import { Button } from '@/components/ui/Button'

export default function SuccessPage() {
  const params = useParams()
  const router = useRouter()
  const participantName = decodeURIComponent(params.name as string)
  const [allSubmitted, setAllSubmitted] = useState(false)

  useEffect(() => {
    checkAllSubmissions()
  }, [])

  async function checkAllSubmissions() {
    try {
      const res = await fetch('/api/submissions/check')
      const data = await res.json()
      
      if (data.participants) {
        const completed = data.participants.filter((p: any) => p.has_submitted).length
        setAllSubmitted(completed === 8)
      }
    } catch (error) {
      console.error('Error checking submissions:', error)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <ConfettiAnimation />
      
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <svg
            className="w-32 h-32 mx-auto"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#10b981"
              strokeWidth="6"
              fill="none"
            />
            <motion.path
              d="M 30 50 L 45 65 L 70 35"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-4xl font-bold mb-3 text-gradient"
        >
          ✓ PICKS LOCKED IN!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xl text-slate-300 mb-8"
        >
          Great choices, {participantName}!
        </motion.p>

        <SubmissionStats participantName={participantName} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8 space-y-3"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!allSubmitted}
            onClick={() => router.push('/results')}
          >
            {allSubmitted ? (
              'VIEW ALL PICKS 🎉'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🔒</span>
                <span>Locked Until Everyone Submits</span>
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push('/')}
          >
            ← Back to Home
          </Button>
        </motion.div>
      </div>
    </main>
  )
}
```

### Step 8 Verification Checklist
- [ ] After submitting picks, verify redirect to success page
- [ ] Verify confetti animation plays for 3 seconds
- [ ] Verify animated checkmark draws in smoothly
- [ ] Verify "PICKS LOCKED IN!" title displays
- [ ] Verify personalized message with participant name
- [ ] Verify stats card shows:
  - [ ] 30 questions answered
  - [ ] Submission timestamp
  - [ ] X/8 family members completed
- [ ] If < 8 submissions, verify "VIEW ALL PICKS" button is disabled with lock icon
- [ ] If all 8 submitted, verify button is enabled
- [ ] Click "Back to Home" - verify navigates to landing page
- [ ] Test animation sequence timing (staggered appearance)
- [ ] Test on mobile viewport

### Step 8 STOP & COMMIT
**STOP & COMMIT:** Commit these changes:
```bash
git add .
git commit -m "feat: create success page with confetti animation"
```

---

## Step 9: Results Page - View All Picks

### Step 9.1: Create Results API Route
- [ ] Create folder: `app/api/results/picks`
- [ ] Create file `app/api/results/picks/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if all participants have submitted
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('id, name, emoji, abbreviation, has_submitted')
      .order('name')

    if (participantsError) throw participantsError

    const allSubmitted = participants.every(p => p.has_submitted)

    if (!allSubmitted) {
      const notSubmitted = participants.filter(p => !p.has_submitted)
      return NextResponse.json({
        allSubmitted: false,
        notSubmitted: notSubmitted.map(p => p.name),
        submittedCount: participants.filter(p => p.has_submitted).length,
      })
    }

    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('display_order')

    if (categoriesError) throw categoriesError

    // Fetch all questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .order('category_id, display_order')

    if (questionsError) throw questionsError

    // Fetch all responses
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('participant_id, question_id, answer')

    if (responsesError) throw responsesError

    // Structure data for easy lookup
    const responsesByParticipant = responses.reduce((acc, response) => {
      if (!acc[response.participant_id]) {
        acc[response.participant_id] = {}
      }
      acc[response.participant_id][response.question_id] = response.answer
      return acc
    }, {} as Record<string, Record<string, string>>)

    return NextResponse.json({
      allSubmitted: true,
      participants,
      categories,
      questions,
      responsesByParticipant,
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}
```

### Step 9.2: Create Results Locked Component
- [ ] Create file `components/ResultsLocked.tsx`:
```typescript
'use client'

import { motion } from 'framer-motion'
import { Button } from './ui/Button'

interface ResultsLockedProps {
  notSubmitted: string[]
  submittedCount: number
  onRefresh: () => void
}

export function ResultsLocked({ notSubmitted, submittedCount, onRefresh }: ResultsLockedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto text-center"
    >
      <div className="glass-strong rounded-2xl p-8">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-4">Results Locked</h2>
        
        <div className="mb-6 text-left">
          <p className="text-slate-400 mb-3">Waiting for picks from:</p>
          <ul className="space-y-2">
            {notSubmitted.map((name) => (
              <li key={name} className="text-slate-300 flex items-center gap-2">
                <span className="text-amber-400">•</span>
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">⏰</span>
            <span className="text-lg font-semibold">
              {8 - submittedCount} {8 - submittedCount === 1 ? 'person' : 'people'} left
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={onRefresh}
          className="w-full"
        >
          Check Again 🔄
        </Button>
      </div>
    </motion.div>
  )
}
```

### Step 9.3: Create Comparison Table Component
- [ ] Create file `components/ComparisonTable.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ComparisonTableProps {
  participants: any[]
  categories: any[]
  questions: any[]
  responsesByParticipant: Record<string, Record<string, string>>
}

export function ComparisonTable({
  participants,
  categories,
  questions,
  responsesByParticipant,
}: ComparisonTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredQuestions = selectedCategory
    ? questions.filter(q => q.category_id === selectedCategory)
    : questions

  function getAnswerStats(questionId: string) {
    const answers = participants.map(p => responsesByParticipant[p.id]?.[questionId])
    const counts = answers.reduce((acc, answer) => {
      if (answer) acc[answer] = (acc[answer] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const maxCount = Math.max(...Object.values(counts))
    return { counts, maxCount }
  }

  function getCellStyle(participantId: string, questionId: string) {
    const answer = responsesByParticipant[participantId]?.[questionId]
    if (!answer) return 'bg-slate-800/50'

    const { counts, maxCount } = getAnswerStats(questionId)
    const count = counts[answer]

    if (count === maxCount && maxCount >= 5) {
      return 'bg-green-500/20 text-green-300' // Majority
    } else if (count === 1) {
      return 'bg-amber-500/20 text-amber-300' // Unique
    } else if (count > 1 && count < 5) {
      return 'bg-purple-500/20 text-purple-300' // Tied
    }
    return 'bg-slate-700/50'
  }

  return (
    <div>
      {/* Category Filters */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              selectedCategory === null
                ? 'bg-gradient-primary text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gradient-primary text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 min-w-[200px] sticky left-0 bg-slate-800/90 backdrop-blur-sm z-10">
                  Question
                </th>
                {participants.map((p) => (
                  <th
                    key={p.id}
                    className="px-3 py-3 text-center font-semibold text-slate-300 min-w-[80px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">{p.emoji}</span>
                      <span className="text-xs">{p.abbreviation}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question, index) => (
                <tr
                  key={question.id}
                  className={index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40'}
                >
                  <td className="px-4 py-3 text-slate-300 sticky left-0 bg-inherit backdrop-blur-sm border-r border-slate-700/50">
                    <span className="text-slate-500 mr-2">Q{question.question_number}.</span>
                    {question.question_text}
                  </td>
                  {participants.map((p) => (
                    <td
                      key={p.id}
                      className={`px-3 py-3 text-center text-xs font-semibold ${getCellStyle(
                        p.id,
                        question.id
                      )}`}
                    >
                      {responsesByParticipant[p.id]?.[question.id] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/20 border border-green-500/30 rounded" />
          <span className="text-slate-400">Majority (5+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500/20 border border-purple-500/30 rounded" />
          <span className="text-slate-400">Tied (2-4)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500/20 border border-amber-500/30 rounded" />
          <span className="text-slate-400">Unique (1)</span>
        </div>
      </div>
    </div>
  )
}
```

### Step 9.4: Create Results Page
- [ ] Create folder: `app/results`
- [ ] Create file `app/results/page.tsx`:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResultsLocked } from '@/components/ResultsLocked'
import { ComparisonTable } from '@/components/ComparisonTable'

export default function ResultsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchResults, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchResults() {
    try {
      const res = await fetch('/api/results/picks')
      const jsonData = await res.json()
      setData(jsonData)
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-strong rounded-2xl p-8 text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-slate-300">Loading results...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 pb-8">
      <div className="max-w-6xl mx-auto">
        {!data?.allSubmitted ? (
          <ResultsLocked
            notSubmitted={data?.notSubmitted || []}
            submittedCount={data?.submittedCount || 0}
            onRefresh={fetchResults}
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-center"
            >
              <h1 className="text-4xl font-bold mb-2">🎯 Everyone's Picks</h1>
              <p className="text-slate-400">Compare all responses</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ComparisonTable
                participants={data.participants}
                categories={data.categories}
                questions={data.questions}
                responsesByParticipant={data.responsesByParticipant}
              />
            </motion.div>
          </>
        )}
      </div>
    </main>
  )
}
```

### Step 9 Verification Checklist
- [ ] With < 8 submissions, navigate to `/results`
- [ ] Verify shows locked state with list of people who haven't submitted
- [ ] Verify shows correct count (X people left)
- [ ] Click "Check Again" - verify re-fetches data
- [ ] Complete all 8 submissions (use different names)
- [ ] Navigate to `/results` - verify unlocks and shows comparison table
- [ ] Verify table shows all 8 participants with emojis and abbreviations
- [ ] Verify all 30 questions display in rows
- [ ] Verify all responses show in cells
- [ ] Check color coding:
  - [ ] Green background for majority picks (5+ same answer)
  - [ ] Amber background for unique picks (only one)
  - [ ] Purple background for tied picks (2-4 same)
- [ ] Test category filter chips - verify filters questions
- [ ] Test horizontal scroll on mobile (smooth, snap to columns)
- [ ] Verify sticky first column (question text stays visible)
- [ ] Verify legend displays at bottom
- [ ] Test auto-refresh (wait 30 seconds, verify re-fetches)

### Step 9 STOP & COMMIT
**STOP & COMMIT:** Commit these changes:
```bash
git add .
git commit -m "feat: implement results page with comparison table"
```

---

## Step 10: Admin Panel - Input Results & Scoring

### Step 10.1: Create Scoring Utility
- [ ] Create file `lib/scoring.ts`:
```typescript
export interface ScoreResult {
  participantId: string
  participantName: string
  correctAnswers: number
  totalQuestions: number
  percentage: number
  details: {
    questionId: string
    questionText: string
    participantAnswer: string
    correctAnswer: string
    isCorrect: boolean
  }[]
}

export function calculateScores(
  participants: any[],
  questions: any[],
  responsesByParticipant: Record<string, Record<string, string>>,
  correctAnswers: Record<string, string>
): ScoreResult[] {
  return participants.map(participant => {
    const details = questions.map(question => {
      const participantAnswer = responsesByParticipant[participant.id]?.[question.id] || ''
      const correctAnswer = correctAnswers[question.id] || ''
      const isCorrect = participantAnswer === correctAnswer && correctAnswer !== ''

      return {
        questionId: question.id,
        questionText: question.question_text,
        participantAnswer,
        correctAnswer,
        isCorrect,
      }
    })

    const correctCount = details.filter(d => d.isCorrect).length
    const totalWithAnswers = Object.keys(correctAnswers).length

    return {
      participantId: participant.id,
      participantName: participant.name,
      correctAnswers: correctCount,
      totalQuestions: totalWithAnswers,
      percentage: totalWithAnswers > 0 ? (correctCount / totalWithAnswers) * 100 : 0,
      details,
    }
  }).sort((a, b) => b.correctAnswers - a.correctAnswers || a.participantName.localeCompare(b.participantName))
}
```

### Step 10.2: Create Admin Auth API Route
- [ ] Create folder: `app/api/admin/auth`
- [ ] Create file `app/api/admin/auth/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    const correctPassword = process.env.ADMIN_PASSWORD || 'superbowl2026'

    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
```

### Step 10.3: Create Save Results API Route
- [ ] Create folder: `app/api/admin/save-results`
- [ ] Create file `app/api/admin/save-results/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionId, correctAnswer } = body

    if (!questionId || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('questions')
      .update({ correct_answer: correctAnswer })
      .eq('id', questionId)

    if (error) {
      console.error('Error saving result:', error)
      return NextResponse.json(
        { error: 'Failed to save result' },
        { status: 500 }
      )
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

### Step 10.4: Create Calculate Scores API Route
- [ ] Create folder: `app/api/admin/calculate-scores`
- [ ] Create file `app/api/admin/calculate-scores/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { calculateScores } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    // Fetch all necessary data
    const { data: participants } = await supabase
      .from('participants')
      .select('*')
      .order('name')

    const { data: questions } = await supabase
      .from('questions')
      .select('*')

    const { data: responses } = await supabase
      .from('responses')
      .select('participant_id, question_id, answer')

    if (!participants || !questions || !responses) {
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }

    // Build correct answers map
    const correctAnswers = questions.reduce((acc, q) => {
      if (q.correct_answer) {
        acc[q.id] = q.correct_answer
      }
      return acc
    }, {} as Record<string, string>)

    // Build responses by participant
    const responsesByParticipant = responses.reduce((acc, r) => {
      if (!acc[r.participant_id]) {
        acc[r.participant_id] = {}
      }
      acc[r.participant_id][r.question_id] = r.answer
      return acc
    }, {} as Record<string, Record<string, string>>)

    // Calculate scores
    const scores = calculateScores(
      participants,
      questions,
      responsesByParticipant,
      correctAnswers
    )

    // Update responses with is_correct
    for (const score of scores) {
      for (const detail of score.details) {
        if (detail.correctAnswer) {
          await supabase
            .from('responses')
            .update({ is_correct: detail.isCorrect })
            .eq('participant_id', score.participantId)
            .eq('question_id', detail.questionId)
        }
      }
    }

    // Update submissions with total_score
    for (const score of scores) {
      await supabase
        .from('submissions')
        .update({ total_score: score.correctAnswers })
        .eq('participant_id', score.participantId)
    }

    return NextResponse.json({ success: true, scores })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
```

### Step 10.5: Create Password Gate Component
- [ ] Create folder: `components/admin`
- [ ] Create file `components/admin/PasswordGate.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

interface PasswordGateProps {
  onAuthenticated: () => void
}

export function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        sessionStorage.setItem('admin-auth', 'true')
        toast.success('Access granted!')
        onAuthenticated()
      } else {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        toast.error('Incorrect password')
        setPassword('')
      }
    } catch (error) {
      toast.error('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="glass-strong rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold mb-6">Admin Access</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-center text-lg tracking-wider focus:outline-none focus:border-primary"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!password || loading}
          >
            {loading ? 'Checking...' : 'Enter'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
```

### Step 10.6: Create Result Entry Component
- [ ] Create file `components/admin/ResultEntry.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuestionCard } from '@/components/questions/QuestionCard'
import { CategoryHeader } from '@/components/questions/CategoryHeader'
import { toast } from 'react-hot-toast'

interface ResultEntryProps {
  categories: any[]
  questionsByCategory: Record<string, any[]>
  correctAnswers: Record<string, string>
  onSave: (questionId: string, answer: string) => void
}

export function ResultEntry({
  categories,
  questionsByCategory,
  correctAnswers,
  onSave,
}: ResultEntryProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(categories[0]?.id)
  const [saving, setSaving] = useState<string | null>(null)

  async function handleSave(questionId: string, answer: string) {
    setSaving(questionId)
    
    try {
      const res = await fetch('/api/admin/save-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, correctAnswer: answer }),
      })

      if (!res.ok) throw new Error('Failed to save')

      onSave(questionId, answer)
      toast.success('Result saved!')
    } catch (error) {
      toast.error('Failed to save result')
    } finally {
      setSaving(null)
    }
  }

  const totalQuestions = Object.values(questionsByCategory).flat().length
  const answeredQuestions = Object.keys(correctAnswers).length

  return (
    <div>
      {/* Progress */}
      <div className="glass-strong rounded-xl p-4 mb-6 text-center">
        <div className="text-3xl font-bold text-gradient mb-2">
          {answeredQuestions}/{totalQuestions}
        </div>
        <p className="text-slate-400 text-sm">Results Entered</p>
        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all duration-300"
            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {categories.map((category) => {
          const questions = questionsByCategory[category.id] || []
          const isExpanded = expandedCategory === category.id

          return (
            <div key={category.id} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.emoji}</span>
                  <span className="font-semibold">{category.name}</span>
                </div>
                <motion.span
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  className="text-slate-400"
                >
                  ▶
                </motion.span>
              </button>

              {isExpanded && (
                <div className="p-4 space-y-4 border-t border-slate-700/50">
                  {questions.map((question) => (
                    <div key={question.id}>
                      <QuestionCard
                        question={question}
                        questionNumber={question.question_number}
                        value={correctAnswers[question.id] || null}
                        onChange={(value) => handleSave(question.id, value)}
                        disabled={saving === question.id}
                      />
                      {correctAnswers[question.id] && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2 text-center text-sm text-green-400"
                        >
                          ✓ Saved
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

### Step 10.7: Create Leaderboard Component
- [ ] Create file `components/admin/Leaderboard.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScoreResult } from '@/lib/scoring'

interface LeaderboardProps {
  scores: ScoreResult[]
}

export function Leaderboard({ scores }: LeaderboardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="space-y-4">
      {scores.map((score, index) => {
        const isExpanded = expandedId === score.participantId
        const isTopThree = index < 3

        return (
          <div
            key={score.participantId}
            className={`glass rounded-xl overflow-hidden ${
              isTopThree ? 'border-2 border-amber-500/30' : ''
            }`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : score.participantId)}
              className={`w-full p-5 flex items-center justify-between hover:bg-slate-700/30 ${
                isTopThree ? 'bg-gradient-gold/10' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-slate-500 w-8">
                  {index < 3 ? medals[index] : `${index + 1}.`}
                </div>
                <div className="text-left">
                  <div className="font-bold text-xl">{score.participantName}</div>
                  <div className="text-slate-400 text-sm">
                    {score.correctAnswers}/{score.totalQuestions} correct
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-gradient">
                    {score.correctAnswers}
                  </div>
                  <div className="text-sm text-slate-400">
                    {score.percentage.toFixed(0)}%
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  className="text-slate-400"
                >
                  ▶
                </motion.span>
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-slate-700/50"
                >
                  <div className="p-5 space-y-2 max-h-96 overflow-y-auto">
                    {score.details
                      .filter(d => d.correctAnswer)
                      .map((detail, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            detail.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                          }`}
                        >
                          <span className="text-2xl">
                            {detail.isCorrect ? '✓' : '✗'}
                          </span>
                          <div className="flex-1 text-sm">
                            <p className="text-slate-300 mb-1">{detail.questionText}</p>
                            <p className="text-slate-400">
                              Their answer: <span className="font-semibold">{detail.participantAnswer}</span>
                            </p>
                            {!detail.isCorrect && (
                              <p className="text-green-400">
                                Correct: <span className="font-semibold">{detail.correctAnswer}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
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

### Step 10.8: Create Admin Page
- [ ] Create folder: `app/admin`
- [ ] Create file `app/admin/page.tsx`:
```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { PasswordGate } from '@/components/admin/PasswordGate'
import { ResultEntry } from '@/components/admin/ResultEntry'
import { Leaderboard } from '@/components/admin/Leaderboard'
import { Button } from '@/components/ui/Button'
import { ScoreResult } from '@/lib/scoring'

type Tab = 'results' | 'calculate' | 'leaderboard'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('results')
  const [categories, setCategories] = useState<any[]>([])
  const [questionsByCategory, setQuestionsByCategory] = useState<Record<string, any[]>>({})
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>({})
  const [scores, setScores] = useState<ScoreResult[]>([])
  const [calculating, setCalculating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin-auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchData() {
    try {
      const res = await fetch('/api/questions')
      const data = await res.json()
      
      setCategories(data.categories)
      setQuestionsByCategory(data.questionsByCategory)

      // Load existing correct answers
      const allQuestions = Object.values(data.questionsByCategory).flat()
      const existingAnswers = allQuestions.reduce((acc: any, q: any) => {
        if (q.correct_answer) {
          acc[q.id] = q.correct_answer
        }
        return acc
      }, {})
      setCorrectAnswers(existingAnswers)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function handleCalculateScores() {
    setCalculating(true)
    
    try {
      const res = await fetch('/api/admin/calculate-scores', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setScores(data.scores)
      setActiveTab('leaderboard')
      toast.success('Scores calculated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to calculate scores')
    } finally {
      setCalculating(false)
    }
  }

  function handleSaveResult(questionId: string, answer: string) {
    setCorrectAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  if (!isAuthenticated && !loading) {
    return <PasswordGate onAuthenticated={() => {
      setIsAuthenticated(true)
      fetchData()
    }} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong rounded-2xl p-8 text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-slate-300">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const totalQuestions = Object.values(questionsByCategory).flat().length
  const answeredQuestions = Object.keys(correctAnswers).length
  const allResultsEntered = answeredQuestions === totalQuestions

  return (
    <main className="min-h-screen p-4 pb-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl font-bold mb-2">⚙️ Admin Panel</h1>
          <p className="text-slate-400">Manage results and calculate scores</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="glass-strong rounded-xl p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'results'
                ? 'bg-gradient-primary text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Enter Results
          </button>
          <button
            onClick={() => setActiveTab('calculate')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'calculate'
                ? 'bg-gradient-primary text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Calculate Scores
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-primary text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'results' && (
            <ResultEntry
              categories={categories}
              questionsByCategory={questionsByCategory}
              correctAnswers={correctAnswers}
              onSave={handleSaveResult}
            />
          )}

          {activeTab === 'calculate' && (
            <div className="glass-strong rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">🧮</div>
              <h2 className="text-2xl font-bold mb-3">Calculate Final Scores</h2>
              <p className="text-slate-400 mb-6">
                {allResultsEntered
                  ? 'All results have been entered. Ready to calculate scores!'
                  : `${answeredQuestions}/${totalQuestions} results entered. Enter all results before calculating.`}
              </p>

              <Button
                variant="primary"
                size="lg"
                className="w-full max-w-md"
                disabled={!allResultsEntered || calculating}
                onClick={handleCalculateScores}
              >
                {calculating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚡</span>
                    Calculating...
                  </span>
                ) : (
                  'Calculate Scores'
                )}
              </Button>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <>
              {scores.length > 0 ? (
                <>
                  <div className="glass-strong rounded-xl p-6 mb-6 text-center">
                    <h2 className="text-2xl font-bold mb-2">🏆 Final Leaderboard</h2>
                    <p className="text-slate-400">Click each person to see detailed breakdown</p>
                  </div>
                  <Leaderboard scores={scores} />
                </>
              ) : (
                <div className="glass-strong rounded-xl p-8 text-center">
                  <div className="text-5xl mb-4">📊</div>
                  <p className="text-slate-400">
                    No scores calculated yet. Calculate scores first.
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </main>
  )
}
```

### Step 10 Verification Checklist
- [ ] Navigate to `/admin`
- [ ] Verify password gate displays with lock icon
- [ ] Try wrong password - verify error and shake animation
- [ ] Enter correct password (`superbowl2026`) - verify grants access
- [ ] Verify session persists (refresh page stays logged in)
- [ ] Test "Enter Results" tab:
  - [ ] Verify shows all 7 categories
  - [ ] Expand category - verify shows all questions
  - [ ] Select answer for a question - verify saves with checkmark
  - [ ] Verify progress indicator updates
- [ ] Test "Calculate Scores" tab:
  - [ ] Without all results - verify button is disabled
  - [ ] Enter all 30 results
  - [ ] Verify button becomes enabled
  - [ ] Click "Calculate Scores" - verify loading state
  - [ ] Verify redirects to leaderboard tab
- [ ] Test "Leaderboard" tab:
  - [ ] Verify shows all 8 participants ranked by score
  - [ ] Verify top 3 have medals (🥇🥈🥉)
  - [ ] Verify scores and percentages display
  - [ ] Click participant - verify expands to show details
  - [ ] Verify correct answers have green checkmark
  - [ ] Verify incorrect answers have red X with correct answer shown
- [ ] Verify Supabase database updated:
  - [ ] questions table: correct_answer field populated
  - [ ] responses table: is_correct field updated
  - [ ] submissions table: total_score field updated

### Step 10 STOP & COMMIT
**STOP & COMMIT:** Commit these changes:
```bash
git add .
git commit -m "feat: implement admin panel with result entry and scoring"
```

---

## Step 11: Polish, Performance & Azure Deployment

### Step 11.1: Add Error Boundary
- [ ] Create file `app/error.tsx`:
```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-strong rounded-2xl p-8 max-w-md text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
        <p className="text-slate-400 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  )
}
```

### Step 11.2: Add Loading States
- [ ] Create file `app/loading.tsx`:
```typescript
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-strong rounded-2xl p-8 text-center">
        <div className="animate-spin text-4xl mb-4">⚡</div>
        <p className="text-slate-300">Loading...</p>
      </div>
    </div>
  )
}
```

### Step 11.3: Add 404 Page
- [ ] Create file `app/not-found.tsx`:
```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-strong rounded-2xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">🏈</div>
        <h2 className="text-3xl font-bold mb-3">404 - Page Not Found</h2>
        <p className="text-slate-400 mb-6">
          This page doesn't exist. Maybe it got intercepted?
        </p>
        <Link href="/">
          <Button variant="primary">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
```

### Step 11.4: Add Favicon and OG Image
- [ ] Create or download favicon files and save to `public/`:
  - `favicon.ico` (16x16, 32x32)
  - `apple-touch-icon.png` (180x180)
  - `og-image.png` (1200x630)

### Step 11.5: Update Metadata
- [ ] Update `app/layout.tsx` metadata:
```typescript
export const metadata: Metadata = {
  title: 'Super Bowl Prop Bets | Family Challenge',
  description: 'Family Super Bowl prop bet challenge - predict the outcomes and compete for bragging rights!',
  keywords: ['Super Bowl', 'prop bets', 'family game', 'predictions'],
  authors: [{ name: 'Sandy' }],
  openGraph: {
    title: 'Super Bowl Prop Bets',
    description: 'Join our family Super Bowl prop bet challenge!',
    type: 'website',
    siteName: 'Super Bowl Prop Bets',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Super Bowl Prop Bets Challenge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Super Bowl Prop Bets',
    description: 'Family Super Bowl prop bet challenge',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}
```

### Step 11.6: Create PWA Manifest
- [ ] Create file `public/manifest.json`:
```json
{
  "name": "Super Bowl Prop Bets",
  "short_name": "Prop Bets",
  "description": "Family Super Bowl prop bet challenge",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ]
}
```

### Step 11.7: Create Azure Static Web Apps Configuration
- [ ] Create file `azure-static-web-apps-config.json` in project root:
```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/admin",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/_next/*", "/static/*"]
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html",
      "statusCode": 404
    }
  },
  "globalHeaders": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "platform": {
    "apiRuntime": "node:18"
  }
}
```

### Step 11.8: Create GitHub Actions Workflow
- [ ] Create folder: `.github/workflows`
- [ ] Create file `.github/workflows/azure-static-web-apps.yml`:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: ".next"
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

### Step 11.9: Create README Documentation
- [ ] Create file `README.md`:
```markdown
# Super Bowl Prop Bets Family Challenge

Mobile-first web app for family Super Bowl prop bet challenge with 8 participants and 30 fun questions.

## 🏈 Features

- **Participant Selection**: 8 family members can select their name and submit picks
- **30 Questions**: Across 7 categories (Pregame, Game Outcome, Scoring, Halftime Show, Commercials, Player Props, Fun Props)
- **Multi-Page Form**: Smooth animated form with progress tracking
- **Results Comparison**: View all picks after everyone submits
- **Admin Panel**: Enter actual results and calculate scores automatically
- **Modern UI**: Dark theme with glass-morphism, smooth animations, mobile-optimized

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Azure Static Web Apps
- **Domain**: propbets.theonlysandman.ca

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/propbets.git
cd propbets

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

## 🗄️ Database Setup

1. Create a Supabase project at https://supabase.com
2. Run migrations in SQL Editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_questions.sql`
3. Copy project URL and anon key to `.env.local`

## 🔐 Admin Access

- Navigate to `/admin`
- Default password: `superbowl2026` (change in `.env.local`)

## 🚢 Deployment to Azure

1. Create Azure Static Web App in Azure Portal
2. Connect to GitHub repository
3. Set environment variables in Azure:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
4. Push to main branch - auto-deploys via GitHub Actions
5. Configure custom domain in Azure portal

## 📝 Project Structure

```
propbets/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── submit/[name]/        # Submission flow
│   ├── results/              # Results page
│   └── admin/                # Admin panel
├── components/               # React components
│   ├── ui/                   # Base UI components
│   ├── questions/            # Question components
│   └── admin/                # Admin components
├── lib/                      # Utilities
│   ├── supabase.ts           # Supabase client
│   ├── types.ts              # TypeScript types
│   └── hooks/                # Custom hooks
├── supabase/migrations/      # Database migrations
└── public/                   # Static assets
```

## 🎮 Usage Flow

1. **Landing Page**: Select your name from 8 participants
2. **Submit Picks**: Answer 30 questions across 7 categories
3. **Review**: Check all answers before final submission
4. **Success**: Confetti celebration, wait for others
5. **Results**: View everyone's picks (unlocks when all 8 submit)
6. **Admin**: Enter actual results, calculate scores, view leaderboard

## 🎯 Game Day Checklist

- [ ] Verify all 8 participants can access site
- [ ] Test submission flow end-to-end
- [ ] Admin panel login works
- [ ] Database backups enabled
- [ ] Monitor for any errors

## 📄 License

Private family project - All rights reserved

## 👨‍💻 Author

Sandy - February 2026
```

### Step 11.10: Performance Optimization
- [ ] Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### Step 11.11: Build and Test Production
- [ ] Run production build:
```bash
npm run build
```
- [ ] Test production build locally:
```bash
npm run start
```
- [ ] Run Lighthouse audit:
```bash
# Open Chrome DevTools
# Run Lighthouse on mobile
# Target: 90+ performance score
```

### Step 11.12: Deploy to Azure

#### Create Azure Static Web App:
- [ ] Go to Azure Portal: https://portal.azure.com
- [ ] Click "Create a resource" → Search "Static Web Apps"
- [ ] Click "Create"
- [ ] Fill in details:
  - **Subscription**: Select your subscription
  - **Resource Group**: Create new or select existing
  - **Name**: `propbets-family-challenge`
  - **Region**: Choose closest region
  - **Deployment source**: GitHub
- [ ] Authorize GitHub and select repository
- [ ] Build settings:
  - **App location**: `/`
  - **API location**: (leave empty)
  - **Output location**: `.next`
- [ ] Click "Review + Create" → "Create"

#### Configure Environment Variables:
- [ ] In Azure Static Web App, go to "Configuration"
- [ ] Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`: (your Supabase URL)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (your Supabase anon key)
  - `ADMIN_PASSWORD`: (your admin password)
- [ ] Save configuration

#### Configure Custom Domain:
- [ ] In Azure Static Web App, go to "Custom domains"
- [ ] Click "Add"
- [ ] Enter: `propbets.theonlysandman.ca`
- [ ] Follow instructions to add DNS records at your domain provider
- [ ] Wait for SSL certificate to provision (~10 minutes)

#### Add GitHub Secrets:
- [ ] Go to GitHub repository → Settings → Secrets and variables → Actions
- [ ] Add secrets:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN`: (copy from Azure deployment)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `ADMIN_PASSWORD`

#### Deploy:
- [ ] Push to main branch:
```bash
git add .
git commit -m "feat: add Azure deployment configuration"
git push origin main
```
- [ ] GitHub Actions will automatically build and deploy
- [ ] Monitor deployment in Actions tab
- [ ] Once complete, visit: https://propbets.theonlysandman.ca

### Step 11 Verification Checklist
- [ ] Production build completes without errors
- [ ] Lighthouse mobile performance score > 90
- [ ] All pages load correctly in production
- [ ] Environment variables work in production
- [ ] Custom domain works with SSL (https)
- [ ] Test complete flow on production:
  - [ ] Landing page loads
  - [ ] Can submit picks
  - [ ] Results page works
  - [ ] Admin panel accessible
- [ ] Test on multiple devices:
  - [ ] iPhone (Safari)
  - [ ] Android (Chrome)
  - [ ] Desktop (Chrome/Firefox/Safari)
- [ ] No console errors on any page
- [ ] All animations run smoothly
- [ ] Database queries work in production
- [ ] Error boundaries catch errors properly

### Step 11 STOP & COMMIT
**STOP & COMMIT:** Commit final changes:
```bash
git add .
git commit -m "feat: add production optimizations and Azure deployment"
git push origin main
```

---

## 🎉 IMPLEMENTATION COMPLETE!

You've successfully built and deployed the Super Bowl Prop Bets Family Challenge app!

### Final Pre-Launch Checklist:

**Technical:**
- [ ] All 8 participants can access site
- [ ] Database has correct data (8 participants, 7 categories, 30 questions)
- [ ] Environment variables configured correctly
- [ ] SSL certificate active
- [ ] Admin password is secure and shared with authorized person

**Testing:**
- [ ] Complete end-to-end test with 2-3 people
- [ ] Test on iPhone and Android
- [ ] Verify results unlock after all submissions
- [ ] Test admin panel result entry
- [ ] Test score calculation
- [ ] Verify leaderboard displays correctly

**Game Day Preparation:**
- [ ] Send link to all participants: https://propbets.theonlysandman.ca
- [ ] Set submission deadline (before game starts)
- [ ] Prepare to enter results during game
- [ ] Have admin password ready

### Support & Troubleshooting:

**Common Issues:**
- **"Can't connect to database"**: Check Supabase credentials in Azure environment variables
- **"Results not showing"**: Verify all 8 participants have submitted
- **"Admin login not working"**: Check ADMIN_PASSWORD environment variable

**Monitoring:**
- Azure provides logs in "Log Stream"
- Supabase shows query logs in dashboard
- Check browser console for client-side errors

### Next Year:
This app can be reused for future Super Bowls! Just update:
1. Game date in landing page countdown
2. Halftime show questions (admin can update)
3. Reset database (clear responses/submissions tables)

---

**🏈 Ready for Super Bowl LX! Good luck to all participants! 🎉**

