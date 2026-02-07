import { NextResponse } from 'next/server'
import { getCategories, getQuestions } from '@/lib/db'

export async function GET() {
  try {
    // Fetch categories
    const categories = await getCategories()

    // Fetch all questions
    const questions = await getQuestions()

    // Group questions by category
    const questionsByCategory = questions.reduce((acc, question) => {
      const catId = (question as any).category_id ?? (question as any).categoryId
      const key = String(catId || '')
      if (!acc[key]) acc[key] = []
      acc[key].push(question)
      return acc
    }, {} as Record<string, any[]>)

    return NextResponse.json({
      categories,
      questionsByCategory,
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
