import { NextResponse } from 'next/server'
import { getParticipants, getSubmissions } from '@/lib/db'

export async function GET() {
  try {
    const participants = (await getParticipants()) || []
    const submissions = (await getSubmissions()) || []

    const submittedNames = new Set(submissions.map((s) => s.participantName))

    const enriched = participants.map((p, i) => ({
      id: p.name ?? String(i + 1),
      name: p.name,
      emoji: (p as any).emoji,
      abbreviation: (p as any).abbreviation,
      has_submitted: submittedNames.has(p.name),
    }))

    return NextResponse.json({ participants: enriched })
  } catch (error) {
    console.error('Error in submissions/check:', error)
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}
