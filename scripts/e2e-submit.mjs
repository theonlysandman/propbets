import fs from 'fs'
import path from 'path'

const root = process.cwd()
const dbPath = path.join(root, 'data', 'db.json')

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

async function waitForServer(url, attempts = 12, delay = 500) {
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url)
      if (r.ok) return true
    } catch (e) {
      // ignore
    }
    await sleep(delay)
  }
  return false
}

async function main(){
  const db = readDb()
  const participant = db.participants.find(p => !p.has_submitted) || db.participants[0]
  const participantName = participant.name

  const questions = db.questions

  const answers = {}
  for (const q of questions) {
    if (q.type === 'yesno') answers[q.id] = 'yes'
    else if (q.type === 'multiple_choice') {
      const choices = (q.options && q.options.choices) || q.choices || []
      answers[q.id] = choices[0] || 'Option A'
    } else if (q.type === 'over_under') answers[q.id] = 'over'
    else answers[q.id] = 'ok'
  }

  const baseUrlCandidates = ['http://localhost:3000', 'http://localhost:3001']
  let serverUrl = null
  for (const url of baseUrlCandidates) {
    const ok = await waitForServer(url + '/api/questions')
    if (ok) { serverUrl = url; break }
  }

  if (serverUrl) {
    console.log('Using server:', serverUrl)

    const resp = await fetch(serverUrl + '/api/submissions/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantName, answers })
    })

    const body = await resp.text()
    console.log('Status:', resp.status)
    console.log('Response:', body)
  } else {
    console.warn('Server not reachable — performing local DB write as fallback')

    // Append responses
    const now = new Date().toISOString()
    const respEntries = Object.entries(answers).map(([questionId, answer], idx) => ({
      id: `r_${Date.now()}_${idx}`,
      participantName,
      questionId,
      answer,
      created_at: now
    }))

    const submissionRecord = { id: `s_${Date.now()}`, participantName, created_at: now }

    const current = readDb()
    current.responses = current.responses || []
    current.submissions = current.submissions || []
    current.responses.push(...respEntries)
    current.submissions.push(submissionRecord)

    // mark participant submitted
    const p = current.participants.find(p => p.name === participantName)
    if (p) p.has_submitted = true

    fs.writeFileSync(dbPath, JSON.stringify(current, null, 2), 'utf-8')
    console.log('Wrote fallback responses and submission to data/db.json')
  }

  // read db after
  const after = readDb()
  const submissions = after.submissions || []
  const responses = after.responses || []
  console.log('Submissions count:', submissions.length)
  console.log('Responses count:', responses.length)
}

main().catch(err => { console.error(err); process.exit(1) })
