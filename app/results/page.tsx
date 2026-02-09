'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface QuestionResult {
  questionId: string
  questionNumber: number
  questionText: string
  categoryId: string
  userAnswer: string | null
  correctAnswer: string | null
  isCorrect: boolean
}

interface ParticipantResult {
  name: string
  emoji: string
  correct: number
  wrong: number
  total: number
  percentage: number
  questionResults: QuestionResult[]
}

interface CategoryInfo {
  id: string
  title: string
  emoji: string
}

interface ResultsData {
  results: ParticipantResult[]
  categories: CategoryInfo[]
  totalQuestions: number
}

const MEDAL_EMOJIS = ['🥇', '🥈', '🥉']

export default function ResultsPage() {
  const [data, setData] = useState<ResultsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/results')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch results')
        return res.json()
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-4 animate-bounce">🏈</div>
          <p className="text-slate-400 text-lg">Tallying the scores…</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">😵</div>
          <p className="text-red-400 text-lg mb-4">Something went wrong</p>
          <p className="text-slate-500 text-sm">{error}</p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            ← Back Home
          </Link>
        </div>
      </div>
    )
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">📭</div>
          <h1 className="text-2xl font-bold text-white mb-3">No Submissions Yet</h1>
          <p className="text-slate-400 mb-6">
            Nobody has submitted their picks yet. Once participants lock in their
            answers, scores will appear here!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all"
          >
            ← Back Home
          </Link>
        </motion.div>
      </div>
    )
  }

  const winner = data.results[0]

  // Group question results by category
  function groupByCategory(questionResults: QuestionResult[]) {
    const grouped: Record<string, QuestionResult[]> = {}
    for (const qr of questionResults) {
      if (!grouped[qr.categoryId]) grouped[qr.categoryId] = []
      grouped[qr.categoryId].push(qr)
    }
    return grouped
  }

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      {/* Hero */}
      <div className="relative px-4 pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 via-slate-900 to-slate-900" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-lg mx-auto"
        >
          <h1 className="text-4xl font-extrabold text-white mb-1">🏆 Results</h1>
          <p className="text-slate-400">Super Bowl LX Prop Bets</p>
        </motion.div>
      </div>

      {/* Winner spotlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="mx-4 mb-6 max-w-lg lg:mx-auto"
      >
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-500/20 via-amber-600/10 to-transparent border border-yellow-500/30 p-6 text-center">
          <div className="text-5xl mb-2">{winner.emoji}</div>
          <p className="text-xs uppercase tracking-widest text-yellow-400/70 mb-1">
            Winner
          </p>
          <p className="text-2xl font-extrabold text-white">{winner.name}</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="text-3xl font-black text-emerald-400">
              {winner.correct}/{winner.total}
            </span>
            <span className="text-slate-500 text-sm">
              ({winner.percentage}%)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <div className="px-4 max-w-lg lg:mx-auto pb-28">
        <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-3 px-1">
          Leaderboard
        </h2>
        <div className="space-y-3">
          {data.results.map((person, idx) => {
            const isExpanded = expandedPerson === person.name
            const grouped = groupByCategory(person.questionResults)

            return (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-800/60 backdrop-blur"
              >
                {/* Row (always visible) */}
                <button
                  onClick={() =>
                    setExpandedPerson(isExpanded ? null : person.name)
                  }
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-700/30 transition-colors"
                >
                  {/* Rank */}
                  <span className="text-2xl w-9 text-center shrink-0">
                    {idx < 3 ? MEDAL_EMOJIS[idx] : (
                      <span className="text-slate-500 text-lg font-bold">
                        {idx + 1}
                      </span>
                    )}
                  </span>

                  {/* Avatar + Name */}
                  <span className="text-2xl shrink-0">{person.emoji}</span>
                  <span className="font-semibold text-white text-left flex-1 truncate">
                    {person.name}
                  </span>

                  {/* Score */}
                  <div className="text-right shrink-0 mr-2">
                    <span className="text-lg font-bold text-emerald-400">
                      {person.correct}
                    </span>
                    <span className="text-slate-500 text-sm">/{person.total}</span>
                  </div>

                  {/* Chevron */}
                  <span
                    className="text-slate-500 transition-transform duration-200 shrink-0"
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▶
                  </span>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-700/50 px-4 pb-4 pt-3 space-y-4">
                        {/* Summary bar */}
                        <div className="flex gap-4 text-sm">
                          <span className="text-emerald-400">
                            ✅ {person.correct} correct
                          </span>
                          <span className="text-red-400">
                            ❌ {person.wrong} wrong
                          </span>
                          <span className="text-slate-500">
                            {person.percentage}%
                          </span>
                        </div>

                        {/* Score bar */}
                        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                            style={{ width: `${person.percentage}%` }}
                          />
                        </div>

                        {/* Questions grouped by category */}
                        {data.categories.map((cat) => {
                          const catQuestions = grouped[cat.id]
                          if (!catQuestions || catQuestions.length === 0) return null

                          return (
                            <div key={cat.id}>
                              <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                                {cat.emoji} {cat.title}
                              </h3>
                              <div className="space-y-2">
                                {catQuestions.map((qr) => (
                                  <div
                                    key={qr.questionId}
                                    className={`rounded-lg p-3 text-sm ${
                                      qr.isCorrect
                                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                                        : 'bg-red-500/10 border border-red-500/20'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <span className="shrink-0 mt-0.5">
                                        {qr.isCorrect ? '✅' : '❌'}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-slate-300 leading-snug">
                                          <span className="text-slate-500">
                                            Q{qr.questionNumber}.{' '}
                                          </span>
                                          {qr.questionText}
                                        </p>
                                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                          <span>
                                            <span className="text-slate-500">
                                              Their pick:{' '}
                                            </span>
                                            <span
                                              className={
                                                qr.isCorrect
                                                  ? 'text-emerald-400 font-semibold'
                                                  : 'text-red-400 font-semibold'
                                              }
                                            >
                                              {qr.userAnswer ?? '—'}
                                            </span>
                                          </span>
                                          {!qr.isCorrect && (
                                            <span>
                                              <span className="text-slate-500">
                                                Answer:{' '}
                                              </span>
                                              <span className="text-emerald-400 font-semibold">
                                                {qr.correctAnswer ?? '—'}
                                              </span>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Back home sticky footer */}
      <div className="fixed bottom-0 inset-x-0 z-20">
        <div className="absolute bottom-full left-0 right-0 h-10 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
        <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 px-4 pt-4 pb-safe-bottom">
          <div className="max-w-lg mx-auto">
            <Link
              href="/"
              className="block w-full text-center px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
            >
              ← Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
