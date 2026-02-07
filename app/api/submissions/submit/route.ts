import { NextRequest, NextResponse } from 'next/server'
import { getParticipants, saveResponse, saveSubmission, markParticipantSubmitted } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { participantName, answers } = body

    if (!participantName || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const participants = await getParticipants()
    const participant = participants.find((p) => p.name === participantName)

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
    }

    if (participant.has_submitted) {
      return NextResponse.json({ error: 'You have already submitted your picks' }, { status: 400 })
    }

    // Save each response
    const entries = Object.entries(answers)
    await Promise.all(
      entries.map(([questionId, answer]) =>
        saveResponse({ participantName, questionId, answer })
      )
    )

    // Create submission record
    await saveSubmission({ participantName })

    // Mark participant as submitted
    await markParticipantSubmitted(participantName)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
