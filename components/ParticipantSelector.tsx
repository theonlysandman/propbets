"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Participant } from '@/lib/types'

interface ParticipantSelectorProps {
  onSelect: (name: string) => void
  selectedName: string | null
}

/* ── animated radio indicator ── */
function SelectionIndicator({ isSelected }: { isSelected: boolean }) {
  return (
    <div className="relative flex-shrink-0 w-7 h-7">
      {/* outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        animate={{
          borderColor: isSelected ? 'rgb(129 140 248)' : 'rgb(100 116 139)',
          backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
        }}
        transition={{ duration: 0.2 }}
      />
      {/* inner check dot */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute inset-[5px] rounded-full bg-gradient-primary flex items-center justify-center"
          >
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-white">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── progress ring ── */
function CompletionRing({ completed, total }: { completed: number; total: number }) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? (completed / total) * circumference : 0

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-11 h-11">
        <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
          <circle cx="22" cy="22" r={radius} fill="none" stroke="rgb(51 65 85)" strokeWidth="3" />
          <motion.circle
            cx="22" cy="22" r={radius} fill="none"
            stroke="url(#progressGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-200">
          {completed}
        </span>
      </div>
      <div className="text-left leading-tight">
        <p className="text-sm font-semibold text-slate-200">{completed}/{total}</p>
        <p className="text-[11px] text-slate-400">submitted</p>
      </div>
    </div>
  )
}

/* ── main component ── */
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

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-[72px] rounded-2xl bg-slate-800/40 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    )
  }

  const available = participants.filter(p => !p.has_submitted)
  const submitted = participants.filter(p => p.has_submitted)

  return (
    <div className="space-y-5">
      {/* completion ring — only show when someone has submitted */}
      {completedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <CompletionRing completed={completedCount} total={participants.length} />
        </motion.div>
      )}

      {/* ── available participants ── */}
      <div className="space-y-2.5" role="radiogroup" aria-label="Select your name">
        {available.map((participant, index) => {
          const isSelected = selectedName === participant.name
          return (
            <motion.button
              key={participant.id ?? participant.name}
              role="radio"
              aria-checked={isSelected}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 28 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(participant.name)}
              className={`
                participant-card group relative w-full flex items-center gap-4 
                min-h-[72px] px-5 py-3.5 rounded-2xl
                transition-all duration-200 ease-out cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                ${isSelected
                  ? 'bg-primary-500/[0.12] border-2 border-primary-400/70 shadow-lg shadow-primary-500/20 ring-1 ring-primary-400/20'
                  : 'bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/70 active:bg-slate-800/60'
                }
              `}
            >
              {/* selected accent bar */}
              <motion.div
                className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-primary"
                initial={false}
                animate={{ opacity: isSelected ? 1 : 0, scaleY: isSelected ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />

              {/* emoji avatar */}
              <motion.span
                className="text-[2rem] leading-none flex-shrink-0"
                animate={{ scale: isSelected ? 1.12 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {participant.emoji}
              </motion.span>

              {/* name */}
              <span className={`
                flex-1 text-left text-[1.05rem] font-semibold tracking-[-0.01em] truncate
                transition-colors duration-200
                ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}
              `}>
                {participant.name}
              </span>

              {/* radio indicator */}
              <SelectionIndicator isSelected={isSelected} />
            </motion.button>
          )
        })}
      </div>

      {/* ── submitted participants (collapsed, muted) ── */}
      {submitted.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500 px-1">
            Already submitted
          </p>
          <div className="space-y-1.5">
            {submitted.map((participant) => (
              <div
                key={participant.id ?? participant.name}
                className="flex items-center gap-4 min-h-[56px] px-5 py-2.5 rounded-xl
                           bg-slate-800/20 border border-slate-700/30 opacity-60"
              >
                <span className="text-2xl leading-none flex-shrink-0">{participant.emoji}</span>
                <span className="flex-1 text-left text-sm font-medium text-slate-400 truncate">
                  {participant.name}
                </span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40
                             flex items-center justify-center"
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="rgb(52 211 153)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
