import { NextResponse } from 'next/server'
import { getParticipants, getQuestions, getResponses, getSubmissions } from '@/lib/db'
import { CORRECT_ANSWERS } from '@/lib/answers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [participants, questions, responses, submissions] = await Promise.all([
      getParticipants(),
      getQuestions(),
      getResponses(),
      getSubmissions(),
    ])

    // Build a lookup: questionId -> question info
    const questionMap = new Map(questions.map((q) => [q.id, q]))

    // Build a lookup: participantName -> their responses
    const responsesByPerson = new Map<string, Map<string, string>>()
    for (const r of responses) {
      if (!responsesByPerson.has(r.participantName)) {
        responsesByPerson.set(r.participantName, new Map())
      }
      responsesByPerson.get(r.participantName)!.set(r.questionId, String(r.answer))
    }

    // Only score participants who have submitted
    const submittedNames = new Set(submissions.map((s) => s.participantName))

    const results = participants
      .filter((p) => submittedNames.has(p.name))
      .map((p) => {
        const answers = responsesByPerson.get(p.name) ?? new Map<string, string>()
        let correct = 0
        let wrong = 0

        const questionResults = questions.map((q) => {
          const userAnswer = answers.get(q.id) ?? null
          const correctAnswer = CORRECT_ANSWERS[q.id] ?? null
          const isCorrect = userAnswer !== null && correctAnswer !== null &&
            userAnswer.toUpperCase() === correctAnswer.toUpperCase()

          if (userAnswer !== null && correctAnswer !== null) {
            if (isCorrect) correct++
            else wrong++
          }

          return {
            questionId: q.id,
            questionNumber: q.question_number ?? q.display_order,
            questionText: q.question_text ?? q.prompt ?? '',
            categoryId: q.categoryId ?? q.category_id ?? '',
            userAnswer,
            correctAnswer,
            isCorrect,
          }
        })

        return {
          name: p.name,
          emoji: p.emoji ?? '👤',
          correct,
          wrong,
          total: questions.length,
          percentage: Math.round((correct / questions.length) * 100),
          questionResults,
        }
      })
      // Sort by most correct, then fewest wrong
      .sort((a, b) => b.correct - a.correct || a.wrong - b.wrong)

    // Build categories for grouping
    const categories = await (async () => {
      const { getCategories } = await import('@/lib/db')
      return getCategories()
    })()

    return NextResponse.json({
      results,
      categories: categories.map((c) => ({
        id: c.id,
        title: c.title,
        emoji: c.emoji ?? '',
      })),
      totalQuestions: questions.length,
    })
  } catch (error) {
    console.error('Error computing results:', error)
    return NextResponse.json({ error: 'Failed to compute results' }, { status: 500 })
  }
}
