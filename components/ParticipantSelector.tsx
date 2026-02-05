"use client"

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

  const completedCount = participants.filter((p) => p.has_submitted).length

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
            key={participant.id ?? index}
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
              <span className="font-semibold text-sm text-center">{participant.name}</span>
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
