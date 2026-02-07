'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export default function SuccessPage() {
  const router = useRouter()
  const params = useParams()
  const participantName = decodeURIComponent((params as any).name as string)

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-strong rounded-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 20 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Picks Submitted!
        </h1>

        <p className="text-slate-300 mb-6">
          Nice work, <span className="font-semibold text-emerald-400">{participantName}</span>!
          Your picks are locked in. Good luck!
        </p>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => router.push('/')}
          >
            🏠 Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
