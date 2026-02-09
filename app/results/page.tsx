'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const RANKINGS = [
  { name: 'Grand-Dad', emoji: '👴' },
  { name: 'Aunt Kira', emoji: '👩‍🦱' },
  { name: 'Jacob', emoji: '👧' },
  { name: 'Erica', emoji: '👩' },
  { name: 'Finely', emoji: '👦' },
  { name: 'Sandy', emoji: '👨' },
  { name: 'Mema', emoji: '👵' },
  { name: 'Grammie', emoji: '👵' },
]

const MEDAL_EMOJIS = ['🥇', '🥈', '🥉']

export default function ResultsPage() {
  const winner = RANKINGS[0]

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
        </div>
      </motion.div>

      {/* Leaderboard */}
      <div className="px-4 max-w-lg lg:mx-auto pb-28">
        <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-3 px-1">
          Leaderboard
        </h2>
        <div className="space-y-3">
          {RANKINGS.map((person, idx) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-800/60 backdrop-blur"
            >
              <div className="flex items-center gap-3 p-4">
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
              </div>
            </motion.div>
          ))}
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
