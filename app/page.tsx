"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
      router.push('/submit/' + encodeURIComponent(selectedName))
    }
  }

  return (
    <main className="min-h-[100dvh] flex flex-col safe-area-pad">
      {/* scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-32 sm:pt-10">
        <div className="w-full max-w-lg mx-auto">
          {/* ── hero ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 mb-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CountdownTimer targetDate={gameDate} />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl font-extrabold mb-2 text-gradient leading-tight"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Super Bowl LX
            </motion.h1>
            <p className="text-base sm:text-lg font-medium text-slate-400">
              Prop Bets Challenge · <span className="text-slate-300">Family Edition</span>
            </p>
          </motion.div>

          {/* ── section label ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-3 px-1"
          >
            Who&apos;s playing?
          </motion.p>

          {/* ── participant selector (no wrapper card — cards breathe) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ParticipantSelector onSelect={setSelectedName} selectedName={selectedName} />
          </motion.div>

          {/* ── results link ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <Link
              href="/results"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              🏆 View Results
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── sticky CTA bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-30">
        <div className="bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pt-6 pb-safe-bottom px-4">
          <div className="max-w-lg mx-auto">
            <AnimatePresence>
              {selectedName && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="text-center text-sm text-slate-400 mb-2"
                >
                  Playing as <span className="font-semibold text-white">{selectedName}</span>
                </motion.p>
              )}
            </AnimatePresence>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!selectedName}
              onClick={handleStart}
            >
              {selectedName ? 'Start Picks →' : 'Select your name to begin'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
