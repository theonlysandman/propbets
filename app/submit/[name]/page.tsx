'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useFormState } from '@/lib/hooks/useFormState'
import { ProgressBar } from '@/components/ProgressBar'
import { CategoryPage } from '@/components/CategoryPage'
import { BottomNavigation } from '@/components/BottomNavigation'
import { Category, Question } from '@/lib/types'

export default function SubmitPage() {
  const router = useRouter()
  const params = useParams()
  const participantName = decodeURIComponent((params as any).name as string)

  const {
    answers,
    currentCategoryIndex,
    setParticipantName,
    setAnswer,
    setCurrentCategoryIndex,
    getCategoryProgress,
  } = useFormState()

  const [categories, setCategories] = useState<Category[]>([])
  const [questionsByCategory, setQuestionsByCategory] = useState<Record<string, Question[]>>({})
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    setParticipantName(participantName)
    fetchQuestionsData()
  }, [participantName])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [currentCategoryIndex])

  async function fetchQuestionsData() {
    try {
      const res = await fetch('/api/questions')
      if (!res.ok) throw new Error('Failed to fetch questions')
      
      const data = await res.json()
      setCategories(data.categories)
      setQuestionsByCategory(data.questionsByCategory)
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    const currentCategory = categories[currentCategoryIndex]
    const questions = questionsByCategory[currentCategory.id] || []
    const { answered, total } = getCategoryProgress(questions.map((q) => q.id))

    if (answered < total) {
      toast.error('Please answer all questions before continuing')
      return
    }

    if (currentCategoryIndex < categories.length - 1) {
      setDirection(1)
      setCurrentCategoryIndex(currentCategoryIndex + 1)
    } else {
      router.push(`/submit/${encodeURIComponent(participantName)}/review`)
    }
  }

  function handleBack() {
    if (currentCategoryIndex > 0) {
      setDirection(-1)
      setCurrentCategoryIndex(currentCategoryIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="animate-spin text-4xl mb-4">⚡</div>
          <p className="text-slate-300">Loading questions...</p>
        </div>
      </div>
    )
  }

  const currentCategory = categories[currentCategoryIndex]
  const currentQuestions = questionsByCategory[currentCategory?.id] || []
  const { answered, total } = getCategoryProgress(currentQuestions.map((q) => q.id))

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <ProgressBar
        participantName={participantName}
        currentIndex={currentCategoryIndex}
        totalCategories={categories.length}
        categoryName={currentCategory?.title || currentCategory?.name || ''}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentCategoryIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30, overshootClamping: true }}
        >
          <CategoryPage
            category={currentCategory}
            questions={currentQuestions}
            answers={answers}
            onAnswerChange={setAnswer}
          />
        </motion.div>
      </AnimatePresence>

      <BottomNavigation
        canGoBack={currentCategoryIndex > 0}
        canContinue={answered === total}
        onBack={handleBack}
        onContinue={handleNext}
        isLastCategory={currentCategoryIndex === categories.length - 1}
      />
    </div>
  )
}
