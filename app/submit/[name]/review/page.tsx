'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useFormState } from '@/lib/hooks/useFormState'
import { ReviewAccordion } from '@/components/ReviewAccordion'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { Button } from '@/components/ui/Button'
import { Category, Question } from '@/lib/types'

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const participantName = decodeURIComponent((params as any).name as string)

  const { answers, setCurrentCategoryIndex, reset } = useFormState()

  const [categories, setCategories] = useState<Category[]>([])
  const [questionsByCategory, setQuestionsByCategory] = useState<Record<string, Question[]>>({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchQuestionsData() {
      try {
        const res = await fetch('/api/questions')
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        setCategories(data.categories)
        setQuestionsByCategory(data.questionsByCategory)
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to load questions')
      } finally {
        setLoading(false)
      }
    }
    fetchQuestionsData()
  }, [])

  function handleEdit(categoryIndex: number) {
    setCurrentCategoryIndex(categoryIndex)
    router.push(`/submit/${encodeURIComponent(participantName)}`)
  }

  async function handleSubmit() {
    setSubmitting(true)
    
    try {
      const res = await fetch('/api/submissions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantName, answers }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      toast.success('Picks submitted successfully! 🎉')
      reset()
      router.push(`/submit/${encodeURIComponent(participantName)}/success`)
    } catch (error: any) {
      console.error('Submission error:', error)
      toast.error(error.message || 'Failed to submit picks')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  const totalQuestions = Object.values(questionsByCategory).reduce(
    (sum, questions) => sum + questions.length,
    0
  )
  const answeredQuestions = Object.keys(answers).length
  const allAnswered = answeredQuestions === totalQuestions

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">📋 Review Your Picks</h1>
          <div className="h-1 bg-gradient-primary rounded-full w-32" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <ReviewAccordion
            categories={categories}
            questionsByCategory={questionsByCategory}
            answers={answers}
            onEdit={handleEdit}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-xl p-6 mb-6 text-center"
        >
          {allAnswered ? (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">All {totalQuestions} questions answered</span>
            </div>
          ) : (
            <div className="text-amber-400">
              <span className="font-semibold">{answeredQuestions}/{totalQuestions} questions answered</span>
              <p className="text-sm text-slate-400 mt-1">Please answer all questions before submitting</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!allAnswered}
            onClick={() => setShowModal(true)}
          >
            SUBMIT FINAL PICKS 🎯
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push(`/submit/${encodeURIComponent(participantName)}`)}
          >
            ← Back to Questions
          </Button>
        </motion.div>

        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleSubmit}
          loading={submitting}
        />
      </div>
    </div>
  )
}
