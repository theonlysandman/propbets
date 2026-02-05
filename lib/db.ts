import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'path'
import { fileURLToPath } from 'url'

type DB = {
  participants: { id?: string; name: string; emoji?: string; abbreviation?: string }[]
  questions: any[]
  submissions: Record<string, any>
}

const file = join(process.cwd(), 'data', 'db.json')
const adapter = new JSONFile<DB>(file)
const db = new Low<DB>(adapter)

export async function initDB() {
  await db.read()
  db.data ||= {
    participants: [
      { name: 'Grand-Dad', emoji: '👴', abbreviation: 'GD' },
      { name: 'Mema', emoji: '👵', abbreviation: 'Me' },
      { name: 'Grammie', emoji: '👵', abbreviation: 'Gr' },
      { name: 'Sandy', emoji: '🧑', abbreviation: 'Sa' },
      { name: 'Erica', emoji: '👩', abbreviation: 'Er' },
      { name: 'Finley', emoji: '🧒', abbreviation: 'Fi' },
      { name: 'Jacob', emoji: '🧒', abbreviation: 'Ja' },
      { name: 'Aunt Kira', emoji: '👩', abbreviation: 'Ki' },
    ],
    questions: [],
    submissions: {},
  }
  await db.write()
}

export async function getParticipants() {
  await initDB()
  return db.data!.participants
}

export async function saveSubmission(name: string, picks: Record<string, any>) {
  await initDB()
  db.data!.submissions[name] = picks
  await db.write()
}

export async function getSubmissions() {
  await initDB()
  return db.data!.submissions
}

export async function allSubmitted() {
  await initDB()
  return Object.keys(db.data!.submissions).length === db.data!.participants.length
}
