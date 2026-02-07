"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  targetDate: Date
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number; hours: number; minutes: number; seconds: number; isLessThan24h: boolean
  } | null>(null)

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
    setTimeLeft(getTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 text-slate-300">
        <span className="text-2xl">⏰</span>
        <span className="text-lg font-semibold">--h --m --s</span>
      </div>
    )
  }

  const { days, hours, minutes, seconds, isLessThan24h } = timeLeft
  const isExpired = days === 0 && hours === 0 && minutes === 0 && seconds === 0

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-emerald-400">
        <span className="text-2xl">🏈</span>
        <span className="text-lg font-semibold">Game on!</span>
      </div>
    )
  }

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
