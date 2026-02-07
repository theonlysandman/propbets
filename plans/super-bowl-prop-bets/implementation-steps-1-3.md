````markdown
# Super Bowl Prop Bets Family Challenge - Implementation Guide (Steps 1–3)

## Goal
Build a mobile-first web application where 8 family members can submit Super Bowl prop bet predictions, view results after all submissions, and calculate scores via an admin panel. Target completion: February 8, 2026 (4 days).

## Prerequisites
- [ ] Ensure you are on the `initial-implementation` branch
- [ ] If branch doesn't exist, create it from main: `git checkout -b initial-implementation`
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Azure account created (for deployment, optional)

---

## Step 1: Project Initialization & Basic Setup

### Step 1.1: Create Next.js Project
- [x] Open terminal in `c:\Users\sandy\coding\propbets`
- [x] Run the following command:
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```
- [ ] When prompted, select:
  - TypeScript: Yes
  - ESLint: Yes
  - Tailwind CSS: Yes
  - `src/` directory: No
  - App Router: Yes
  - Import alias: Yes (@/*)

### Step 1.2: Install Dependencies
- [x] Run the following command to install all required packages (uses local lowdb for storage instead of Supabase):
```bash
npm install lowdb framer-motion react-hot-toast zustand canvas-confetti date-fns
```
- [ ] Install dev dependencies:
```bash
npm install -D @types/canvas-confetti
```

### Step 1.3: Update package.json Scripts
- [x] Replace the entire `package.json` file with:
```json
{
  "name": "propbets",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "seed:db": "node scripts/seed-db.mjs"
  },
  "dependencies": {
    "lowdb": "^7.0.1",
    "canvas-confetti": "^1.9.2",
    "date-fns": "^3.0.6",
    "framer-motion": "^10.18.0",
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.6.4",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.1.0",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```
## Step 2: Local JSON Store (lowdb) Setup

We're using a local JSON-backed database (lowdb) instead of Supabase so the app can run fully locally without an external DB. The repo already contains `data/db.json` — we'll use and seed that.

### Step 2.1: Local DB files
- [ ] Ensure `data/db.json` exists at the project root. It should contain the basic collections the app expects, for example:

```json
{
  "participants": [],
  "categories": [],
  "questions": [],
  "responses": [],
  "submissions": []
}
```

### Step 2.2: Get lowdb client in `lib`
- [x] Create `lib/db.ts` as the lowdb client. Example (Node runtime / server-side usage):

```typescript
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'
import { Database } from './types'

const file = path.join(process.cwd(), 'data', 'db.json')
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify({ participants: [], categories: [], questions: [], responses: [], submissions: [] }, null, 2))
}

const adapter = new JSONFile<Database>(file)
const db = new Low<Database>(adapter)

export default db
```

Notes:
- `lib/types.ts` already describes the shape of the DB objects; reuse it for typings.
- `db.read()` and `db.write()` are async and should be called from server components or API routes.

### Step 2.3: Seed data (local)
- [x] Add a JSON seed file or a simple Node script to populate `data/db.json`. Example script: `scripts/seed-db.mjs`:

```javascript
import fs from 'fs'
import path from 'path'
const file = path.join(process.cwd(), 'data', 'db.json')

const seed = {
  participants: [
    { id: 'p1', name: 'Grand-Dad', emoji: '👴', abbreviation: 'GD', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p2', name: 'Mema', emoji: '👵', abbreviation: 'Me', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p3', name: 'Grammie', emoji: '👵', abbreviation: 'Gr', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p4', name: 'Sandy', emoji: '🧑', abbreviation: 'Sa', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p5', name: 'Erica', emoji: '👩', abbreviation: 'Er', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p6', name: 'Finley', emoji: '🧒', abbreviation: 'Fi', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p7', name: 'Jacob', emoji: '🧒', abbreviation: 'Ja', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p8', name: 'Aunt Kira', emoji: '👩', abbreviation: 'Ki', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() }
  ],
  categories: [],
  questions: [],
  responses: [],
  submissions: []
}

fs.writeFileSync(file, JSON.stringify(seed, null, 2))
console.log('Seeded', file)
```

Add a `package.json` script if desired:

```json
"scripts": {
  "seed:db": "node scripts/seed-db.mjs"
}
```

### Step 2.4: Replace Supabase client references
- [ ] Update any files that import `@/lib/supabase` to import `@/lib/db` and call `await db.read()` before using `db.data`.

### Step 2.5: Test local DB access
- [x] Example server component for `app/test-db/page.tsx` using lowdb:

```tsx
import db from '@/lib/db'
export const dynamic = 'force-dynamic'

export default async function TestDB() {
  await db.read()
  const participants = db.data?.participants || []

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
        <div className="glass rounded-xl p-6">
          <p className="text-green-400 mb-4">✅ Successfully read local JSON DB!</p>
          <h2 className="text-xl font-semibold mb-3">Participants ({participants.length}):</h2>
          <ul className="space-y-2">
            {participants.map((p) => (
              <li key={p.id} className="flex items-center gap-3 text-slate-300">
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
```

### Step 2 Verification Checklist
- [ ] Ensure `data/db.json` is present and readable
- [ ] Run `npm run seed:db` (if added) to populate initial participants
- [ ] Run `npm run dev`
- [ ] Navigate to `http://localhost:3000/test-db`
- [ ] Verify page shows "Successfully read local JSON DB!" and participants list

### Step 2 STOP & COMMIT
**STOP & COMMIT:** Commit these changes before proceeding:
```bash
git add .
git commit -m "chore: switch docs to local lowdb JSON store (no Supabase)"
```
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
```

### Step 1.11: Create Temporary Homepage
- [x] Replace `app/page.tsx` with:
```typescript
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gradient">
          🏈 Super Bowl LX Prop Bets
        </h1>
        <p className="text-xl text-slate-300">
          Family Challenge
        </p>
        <div className="mt-8 glass rounded-2xl p-6 max-w-md">
          <p className="text-slate-400">
            Project initialized successfully! ✅
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Next: Set up local database
          </p>
        </div>
      </div>
    </main>
  )
}
```

### Step 1 Verification Checklist
- [x] Run `npm install` to install all dependencies
- [x] Run `npm run dev` to start development server
- [ ] Open browser to `http://localhost:3000`
- [ ] Verify page displays "Super Bowl LX Prop Bets" with gradient text
- [ ] Verify dark theme background (gradient from slate to indigo)
- [ ] Verify glass-morphism card displays
- [ ] Check browser console for no errors
- [ ] Test responsive design (resize browser to mobile width)

### Step 1 STOP & COMMIT
**STOP & COMMIT:** Commit these changes before proceeding:
```bash
git add .
git commit -m "feat: initialize Next.js 14 project with Tailwind and TypeScript"
```

---

## Step 3: Seed Question Data

### Step 3.1: Expand Seed Script with Categories and Questions
- [ ] Update the `scripts/seed-db.mjs` file to include categories and questions. The full seed data should include all 30 questions across 7 categories. You can reference the complete question list in the original plan documents, or create a comprehensive seed file with structure like:

```javascript
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const file = path.join(process.cwd(), 'data', 'db.json')

// Create category IDs upfront
const categoryIds = {
  pregame: randomUUID(),
  outcome: randomUUID(),
  scoring: randomUUID(),
  halftime: randomUUID(),
  commercials: randomUUID(),
  player: randomUUID(),
  fun: randomUUID()
}

const seed = {
  participants: [
    { id: 'p1', name: 'Grand-Dad', emoji: '👴', abbreviation: 'GD', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p2', name: 'Mema', emoji: '👵', abbreviation: 'Me', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p3', name: 'Grammie', emoji: '👵', abbreviation: 'Gr', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p4', name: 'Sandy', emoji: '🧑', abbreviation: 'Sa', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p5', name: 'Erica', emoji: '👩', abbreviation: 'Er', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p6', name: 'Finley', emoji: '🧒', abbreviation: 'Fi', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p7', name: 'Jacob', emoji: '🧒', abbreviation: 'Ja', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() },
    { id: 'p8', name: 'Aunt Kira', emoji: '👩', abbreviation: 'Ki', has_submitted: false, submitted_at: null, created_at: new Date().toISOString() }
  ],
  categories: [
    { id: categoryIds.pregame, name: 'Pregame', emoji: '🏈', display_order: 1, created_at: new Date().toISOString() },
    { id: categoryIds.outcome, name: 'Game Outcome', emoji: '🎯', display_order: 2, created_at: new Date().toISOString() },
    { id: categoryIds.scoring, name: 'Scoring', emoji: '🏃', display_order: 3, created_at: new Date().toISOString() },
    { id: categoryIds.halftime, name: 'Halftime Show', emoji: '🎤', display_order: 4, created_at: new Date().toISOString() },
    { id: categoryIds.commercials, name: 'Commercials & Broadcast', emoji: '📺', display_order: 5, created_at: new Date().toISOString() },
    { id: categoryIds.player, name: 'Player Props', emoji: '⭐', display_order: 6, created_at: new Date().toISOString() },
    { id: categoryIds.fun, name: 'Fun Props', emoji: '🎉', display_order: 7, created_at: new Date().toISOString() }
  ],
  questions: [
    // Pregame questions (5)
    { id: randomUUID(), category_id: categoryIds.pregame, question_text: 'What will the coin toss result be?', question_number: 1, question_type: 'MULTIPLE_CHOICE', options: { type: 'MULTIPLE_CHOICE', choices: ['Heads', 'Tails'] }, correct_answer: null, display_order: 1, created_at: new Date().toISOString() },
    // ... add remaining 29 questions following the pattern from the SQL above
  ],
  responses: [],
  submissions: []
}

fs.writeFileSync(file, JSON.stringify(seed, null, 2))
console.log('Seeded', file)
```

> **Note**: The complete script with all 30 questions is quite long. For brevity, the above shows the structure. Add all questions following the same pattern as shown in the original SQL

### Step 3.2: Run the Seed Script
- [ ] Execute the seed script:
```bash
npm run seed:db
```
- [ ] Verify it completes without errors and shows "Seeded data/db.json"

### Step 3.3: Verify Seeded Data
- [ ] Open `data/db.json` in your editor
- [ ] Verify "categories" array has 7 items
- [ ] Verify "questions" array has 30 items total
- [ ] Check questions are properly distributed:
  - Pregame: 5 questions
  - Game Outcome: 4 questions
  - Scoring: 5 questions
  - Halftime Show: 4 questions
  - Commercials & Broadcast: 4 questions
  - Player Props: 4 questions
  - Fun Props: 4 questions

### Step 3.4: Create Test Page for Questions
- [ ] Create file `app/test-questions/page.tsx`:
```typescript
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function TestQuestions() {
  await db.read()
  const categories = db.data?.categories || []
  const questions = db.data?.questions || []

  // Sort categories by display_order
  const sortedCategories = [...categories].sort((a, b) => a.display_order - b.display_order)

  // Group questions by category
  const questionsByCategory = questions.reduce((acc, q) => {
    const category = categories.find(c => c.id === q.category_id)
    if (category) {
      const catName = category.name
      if (!acc[catName]) acc[catName] = []
      acc[catName].push(q)
    }
    return acc
  }, {} as Record<string, any[]>)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Questions Database Test</h1>
        <p className="text-slate-400 mb-6">Total: {questions.length} questions across {categories.length} categories</p>
        
        <div className="space-y-6">
          {sortedCategories.map((cat) => (
            <div key={cat.id} className="glass rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {cat.emoji} {cat.name}
                <span className="text-sm text-slate-400 ml-3">
                  ({questionsByCategory[cat.name]?.length || 0} questions)
                </span>
              </h2>
              <ul className="space-y-3">
                {questionsByCategory[cat.name]?.map((q) => (
                  <li key={q.id} className="text-slate-300 border-l-2 border-primary pl-4">
                    <span className="text-slate-500 mr-2">Q{q.question_number}.</span>
                    {q.question_text}
                    <span className="text-xs text-slate-500 ml-2">
                      ({q.question_type})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
```

### Step 3 Verification Checklist
- [ ] Navigate to `http://localhost:3000/test-questions`
- [ ] Verify page shows "30 questions across 7 categories"
- [ ] Verify all 7 categories display with correct emojis
- [ ] Verify each category has correct number of questions
- [ ] Verify questions show correct numbering (Q1, Q2, etc.)
- [ ] Verify question types are displayed (YES_NO, MULTIPLE_CHOICE, OVER_UNDER)
- [ ] Spot check a few questions for correct text

### Step 3 STOP & COMMIT
**STOP & COMMIT:** Commit these changes:
```bash
git add .
git commit -m "feat: seed 30 prop bet questions across 7 categories"
```

---

```