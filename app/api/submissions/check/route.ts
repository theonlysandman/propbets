import { NextResponse } from 'next/server'
import { getParticipants, getSubmissions } from '@/lib/db'

export async function GET() {
  try {
    const participants = await getParticipants()
    const submissions = await getSubmissions()

    const enriched = participants.map((p, i) => ({
      id: String(i + 1),
      name: p.name,
      emoji: p.emoji,
      abbreviation: p.abbreviation,
      has_submitted: !!submissions[p.name],
    }))

    return NextResponse.json({ participants: enriched })
  } catch (error) {
    console.error('Error in submissions/check:', error)
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}
