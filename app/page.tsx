"use client"

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
          <h3 className="text-xl font-semibold mb-4 text-center">👤 Select Your Name</h3>
          <ParticipantSelector onSelect={setSelectedName} selectedName={selectedName} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button variant="primary" size="lg" className="w-full mb-4" disabled={!selectedName} onClick={handleStart}>
            START PICKS →
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="text-center">
          <CountdownTimer targetDate={gameDate} />
          <p className="text-sm text-slate-500 mt-2">Game starts Feb 8 at 6:30pm ET</p>
        </motion.div>
      </div>
    </main>
  )
}
export default function Home() {
  ```tsx
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
"use client"

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
          "use client"

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
                    <h3 className="text-xl font-semibold mb-4 text-center">👤 Select Your Name</h3>
                    <ParticipantSelector onSelect={setSelectedName} selectedName={selectedName} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <Button variant="primary" size="lg" className="w-full mb-4" disabled={!selectedName} onClick={handleStart}>
                      START PICKS →
                    </Button>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="text-center">
                    <CountdownTimer targetDate={gameDate} />
                    <p className="text-sm text-slate-500 mt-2">Game starts Feb 8 at 6:30pm ET</p>
                  </motion.div>
                </div>
              </main>
            )
          }
