import { getParticipants } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function TestDB() {
  const participants = await getParticipants()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Local DB Test</h1>

        <div className="glass rounded-xl p-6">
          <p className="text-green-400 mb-4">✅ Using local lowdb store</p>
          <h2 className="text-xl font-semibold mb-3">Participants ({participants?.length}):</h2>
          <ul className="space-y-2">
            {participants?.map((p) => (
              <li key={p.name} className="flex items-center gap-3 text-slate-300">
                <span className="text-2xl">{p.emoji}</span>
                <span>{p.name}</span>
                <span className="text-slate-500">({p.abbreviation})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
