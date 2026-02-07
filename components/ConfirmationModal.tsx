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

export default ConfirmationModal
