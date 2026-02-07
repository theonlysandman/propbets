import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'path'
import { Database, Participant, Question, Category, Response, Submission } from './types'

const file = join(process.cwd(), 'data', 'db.json')
const adapter = new JSONFile<Database>(file)
const db = new Low<Database>(adapter)

async function readDb() {
  await db.read()
  if (!db.data) {
    db.data = {
      participants: [],
      categories: [],
      questions: [],
      responses: [],
      submissions: [],
    }
  }
  return db.data
}

export async function getParticipants(): Promise<Participant[]> {
  const data = await readDb()
  return data.participants
}

export async function getCategories(): Promise<Category[]> {
  const data = await readDb()
  return data.categories
}

export async function getQuestions(): Promise<Question[]> {
  const data = await readDb()
  return data.questions
}

export async function getResponses(): Promise<Response[]> {
  const data = await readDb()
  return data.responses
}

export async function getSubmissions(): Promise<Submission[]> {
  const data = await readDb()
  return data.submissions
}

export async function saveResponse(resp: Omit<Response, 'id' | 'createdAt'>) {
  const data = await readDb()
  const r: Response = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    ...resp,
  }
  data.responses.push(r)
  await db.write()
  return r
}

export async function saveSubmission(sub: Omit<Submission, 'id' | 'createdAt'>) {
  const data = await readDb()
  const s: Submission = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    ...sub,
  }
  data.submissions.push(s)
  await db.write()
  return s
}

export async function markParticipantSubmitted(name: string) {
  const data = await readDb()
  const p = data.participants.find((x) => x.name === name)
  if (p) p.has_submitted = true
  await db.write()
  return p
}

export default db
