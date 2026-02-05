````markdown
# Super Bowl Prop Bets Family Challenge - Implementation Guide (Steps 1–3)

## Goal
Build a mobile-first web application where 8 family members can submit Super Bowl prop bet predictions, view results after all submissions, and calculate scores via an admin panel. Target completion: February 8, 2026 (4 days).

## Prerequisites
- [ ] Ensure you are on the `initial-implementation` branch
- [ ] If branch doesn't exist, create it from main: `git checkout -b initial-implementation`
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Supabase account created (free tier)
- [ ] Azure account created (for deployment)

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
- [x] Run the following command to install all required packages:
```bash
npm install @supabase/supabase-js framer-motion react-hot-toast zustand canvas-confetti date-fns
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
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
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

### Step 1.4: Configure TypeScript
- [x] Replace `tsconfig.json` with:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 1.5: Configure Tailwind CSS
- [x] Replace `tailwind.config.ts` with:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          light: '#8b5cf6',
        },
        secondary: {
          DEFAULT: '#10b981',
        },
        accent: {
          DEFAULT: '#f59e0b',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-gold': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-silver': 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)',
        'gradient-bronze': 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'confetti': 'confetti 3s ease-out forwards',
    ### Step 2.4: Create Initial Schema Migration
    - [x] Create file `supabase/migrations/001_initial_schema.sql` (created locally).
    - [ ] Execute Initial Migration (manual step in Supabase dashboard)
  
    ```sql
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Participants table
    CREATE TABLE participants (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT UNIQUE NOT NULL,
      emoji TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      has_submitted BOOLEAN DEFAULT FALSE,
      submitted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Categories table
    CREATE TABLE categories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT UNIQUE NOT NULL,
      emoji TEXT NOT NULL,
      display_order INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Questions table
    CREATE TABLE questions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      question_number INTEGER NOT NULL,
      question_type TEXT NOT NULL CHECK (question_type IN ('YES_NO', 'MULTIPLE_CHOICE', 'OVER_UNDER')),
      options JSONB NOT NULL,
      correct_answer TEXT,
      display_order INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(category_id, question_number)
    );

    -- Responses table (user picks)
    CREATE TABLE responses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
      question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      answer TEXT NOT NULL,
      is_correct BOOLEAN,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(participant_id, question_id)
    );

    -- Submissions table (tracks when each participant submits)
    CREATE TABLE submissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      participant_id UUID UNIQUE NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
      submitted_at TIMESTAMPTZ DEFAULT NOW(),
      total_score INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create indexes for performance
    CREATE INDEX idx_responses_participant ON responses(participant_id);
    CREATE INDEX idx_responses_question ON responses(question_id);
    CREATE INDEX idx_questions_category ON questions(category_id);
    CREATE INDEX idx_submissions_participant ON submissions(participant_id);

    -- Insert participants
    INSERT INTO participants (name, emoji, abbreviation) VALUES
      ('Grand-Dad', '👴', 'GD'),
      ('Mema', '👵', 'Me'),
      ('Grammie', '👵', 'Gr'),
      ('Sandy', '🧑', 'Sa'),
      ('Erica', '👩', 'Er'),
      ('Finley', '🧒', 'Fi'),
      ('Jacob', '🧒', 'Ja'),
      ('Aunt Kira', '👩', 'Ki');
    ```
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

### Step 1.6: Update Global Styles
- [x] Replace `app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }

  * {
    @apply border-slate-700;
  }

  body {
    @apply bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-foreground;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer utilities {
  .glass {
    @apply bg-slate-800/30 backdrop-blur-md border border-slate-700/50;
  }

  .glass-strong {
    @apply bg-slate-800/60 backdrop-blur-lg border border-slate-600/50;
  }

  .btn-primary {
    @apply bg-gradient-primary text-white font-semibold rounded-full px-6 py-4 
           shadow-lg shadow-primary/25 hover:shadow-primary/40 
           active:scale-95 transition-all duration-200;
  }

  .btn-secondary {
    @apply border-2 border-slate-600 text-slate-200 font-semibold rounded-full px-6 py-4
           hover:bg-slate-700/50 active:scale-95 transition-all duration-200;
  }

  .text-gradient {
    @apply bg-gradient-primary bg-clip-text text-transparent;
  }
}
```

### Step 1.7: Configure Next.js
- [x] Replace `next.config.js` (or create `next.config.mjs`) with:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### Step 1.8: Create Environment Variables File
- [x] Create `.env.local` file in project root:
```bash
# Supabase Configuration (you'll fill these in after creating your Supabase project)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Admin password for admin panel
ADMIN_PASSWORD=superbowl2026
```

### Step 1.9: Update .gitignore
- [x] Add to `.gitignore`:
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# Azure
.azure/
```

### Step 1.10: Create Root Layout
- [x] Replace `app/layout.tsx` with:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Super Bowl Prop Bets | Family Challenge',
  description: 'Family Super Bowl prop bet challenge - predict the outcomes and compete for bragging rights!',
  keywords: ['Super Bowl', 'prop bets', 'family game', 'predictions'],
  openGraph: {
    title: 'Super Bowl Prop Bets',
    description: 'Join our family Super Bowl prop bet challenge!',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
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
            Next: Set up Supabase database
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

## Step 2: Database Schema & Supabase Setup

### Step 2.1: Create Supabase Project
- [ ] Go to https://supabase.com and sign in
- [ ] Click "New Project"
- [ ] Set project name: "propbets"
- [ ] Set database password (save this securely!)
- [ ] Select region closest to you
- [ ] Wait for project to finish setting up (~2 minutes)

### Step 2.2: Get Supabase Credentials
- [ ] In Supabase dashboard, go to Settings > API
- [ ] Copy "Project URL" 
- [ ] Copy "anon public" key
- [ ] Update `.env.local` with these values:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=superbowl2026
```

### Step 2.3: Create Supabase Directory
- [ ] Create folder: `supabase/migrations`
- [ ] This will hold our database migration files

### Step 2.4: Create Initial Schema Migration
- [ ] Create file `supabase/migrations/001_initial_schema.sql`:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  emoji TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  has_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  emoji TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_number INTEGER NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('YES_NO', 'MULTIPLE_CHOICE', 'OVER_UNDER')),
  options JSONB NOT NULL,
  correct_answer TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, question_number)
);

-- Responses table (user picks)
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id, question_id)
);

-- Submissions table (tracks when each participant submits)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID UNIQUE NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  total_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_participant ON responses(participant_id);
CREATE INDEX idx_responses_question ON responses(question_id);
CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_submissions_participant ON submissions(participant_id);

-- Insert participants
INSERT INTO participants (name, emoji, abbreviation) VALUES
  ('Grand-Dad', '👴', 'GD'),
  ('Mema', '👵', 'Me'),
  ('Grammie', '👵', 'Gr'),
  ('Sandy', '🧑', 'Sa'),
  ('Erica', '👩', 'Er'),
  ('Finley', '🧒', 'Fi'),
  ('Jacob', '🧒', 'Ja'),
  ('Aunt Kira', '👩', 'Ki');
```

### Step 2.5: Execute Initial Migration
- [ ] In Supabase dashboard, go to SQL Editor
- [ ] Click "New Query"
- [ ] Copy and paste the entire content from `001_initial_schema.sql`
- [ ] Click "Run" to execute
- [ ] Verify in "Table Editor" that all 5 tables are created
- [ ] Verify "participants" table has 8 rows

### Step 2.6: Create Supabase Client Utility
- [x] Create folder: `lib` and `lib/supabase.ts` (added locally).
```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any) {
  console.error('Supabase error:', error)
  return {
    error: error.message || 'An unexpected error occurred',
  }
}
```

### Step 2.7: Create TypeScript Types
- [x] Create file `lib/types.ts` with database and helper types (added locally).
```typescript
// Database types
export interface Database {
  public: {
    Tables: {
      participants: {
        Row: Participant
        Insert: Omit<Participant, 'id' | 'created_at'>
        Update: Partial<Omit<Participant, 'id' | 'created_at'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      questions: {
        Row: Question
        Insert: Omit<Question, 'id' | 'created_at'>
        Update: Partial<Omit<Question, 'id' | 'created_at'>>
      }
      responses: {
        Row: Response
        Insert: Omit<Response, 'id' | 'created_at'>
        Update: Partial<Omit<Response, 'id' | 'created_at'>>
      }
      submissions: {
        Row: Submission
        Insert: Omit<Submission, 'id' | 'created_at'>
        Update: Partial<Omit<Submission, 'id' | 'created_at'>>
      }
    }
  }
}

// Table row types
export interface Participant {
  id: string
  name: string
  emoji: string
  abbreviation: string
  has_submitted: boolean
  submitted_at: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  emoji: string
  display_order: number
  created_at: string
}

export interface Question {
  id: string
  category_id: string
  question_text: string
  question_number: number
  question_type: 'YES_NO' | 'MULTIPLE_CHOICE' | 'OVER_UNDER'
  options: QuestionOptions
  correct_answer: string | null
  display_order: number
  created_at: string
}

export interface Response {
  id: string
  participant_id: string
  question_id: string
  answer: string
  is_correct: boolean | null
  created_at: string
}

export interface Submission {
  id: string
  participant_id: string
  submitted_at: string
  total_score: number | null
  created_at: string
}

// Helper types
export type QuestionType = 'YES_NO' | 'MULTIPLE_CHOICE' | 'OVER_UNDER'

export interface QuestionOptions {
  type: QuestionType
  choices?: string[]
  overUnder?: {
    value: number
    label: string
  }
}

export interface QuestionWithCategory extends Question {
  category: Category
}

export interface ParticipantWithSubmission extends Participant {
  submission?: Submission
}

export interface ResponseWithDetails extends Response {
  question: Question
  participant: Participant
}

// Form state types
export interface FormAnswers {
  [questionId: string]: string
}

export interface CategoryProgress {
  categoryId: string
  totalQuestions: number
  answeredQuestions: number
  isComplete: boolean
}
```

### Step 2.8: Test Supabase Connection
- [x] Create file `app/test-db/page.tsx` (added locally).
```typescript
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function TestDB() {
  const { data: participants, error } = await supabase
    .from('participants')
    .select('*')
    .order('name')

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
        
        {error ? (
          <div className="glass-strong rounded-xl p-6 border-red-500">
            <p className="text-red-400">Error: {error.message}</p>
          </div>
        ) : (
          <div className="glass rounded-xl p-6">
            <p className="text-green-400 mb-4">✅ Successfully connected to Supabase!</p>
            <h2 className="text-xl font-semibold mb-3">Participants ({participants?.length}):</h2>
            <ul className="space-y-2">
              {participants?.map((p) => (
                <li key={p.id} className="flex items-center gap-3 text-slate-300">
                  <span className="text-2xl">{p.emoji}</span>
                  <span>{p.name}</span>
                  <span className="text-slate-500">({p.abbreviation})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
```

### Step 2 Verification Checklist
- [ ] Verify `.env.local` has correct Supabase credentials
- [ ] Run `npm run dev`
- [ ] Navigate to `http://localhost:3000/test-db`
- [ ] Verify page shows "Successfully connected to Supabase!"
- [ ] Verify all 8 participants are listed with emojis and names
- [ ] Check Supabase dashboard > Table Editor > participants table has 8 rows
- [ ] Check all 5 tables exist: participants, categories, questions, responses, submissions

### Step 2 STOP & COMMIT
**STOP & COMMIT:** Commit these changes before proceeding:
```bash
git add .
git commit -m "feat: add Supabase schema, client, types, and test DB page"
```
```

---

## Step 3: Seed Question Data

### Step 3.1: Create Seed Migration File
- [x] Create file `supabase/migrations/002_seed_questions.sql` (created locally).
  
```sql
-- Insert categories
INSERT INTO categories (name, emoji, display_order) VALUES
  ('Pregame', '🏈', 1),
  ('Game Outcome', '🎯', 2),
  ('Scoring', '🏃', 3),
  ('Halftime Show', '🎤', 4),
  ('Commercials & Broadcast', '📺', 5),
  ('Player Props', '⭐', 6),
  ('Fun Props', '🎉', 7);

-- Get category IDs for reference
DO $$
DECLARE
  pregame_id UUID;
  outcome_id UUID;
  scoring_id UUID;
  halftime_id UUID;
  commercials_id UUID;
  player_id UUID;
  fun_id UUID;
BEGIN
  SELECT id INTO pregame_id FROM categories WHERE name = 'Pregame';
  SELECT id INTO outcome_id FROM categories WHERE name = 'Game Outcome';
  SELECT id INTO scoring_id FROM categories WHERE name = 'Scoring';
  SELECT id INTO halftime_id FROM categories WHERE name = 'Halftime Show';
  SELECT id INTO commercials_id FROM categories WHERE name = 'Commercials & Broadcast';
  SELECT id INTO player_id FROM categories WHERE name = 'Player Props';
  SELECT id INTO fun_id FROM categories WHERE name = 'Fun Props';

  -- Pregame questions (5)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (pregame_id, 'What will the coin toss result be?', 1, 'MULTIPLE_CHOICE', 
     '{"type": "MULTIPLE_CHOICE", "choices": ["Heads", "Tails"]}', 1),
    (pregame_id, 'Will the National Anthem be over or under 2 minutes 5 seconds?', 2, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 125, "label": "2:05"}}', 2),
    (pregame_id, 'Which team will win the coin toss?', 3, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 3),
    (pregame_id, 'What will happen on the opening kickoff?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Touchback", "Return inside 25", "Return past 25", "Fumble/Penalty"]}', 4),
    (pregame_id, 'What will be the first penalty of the game?', 5, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["False Start", "Holding", "Pass Interference", "Other"]}', 5);

  -- Game Outcome questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (outcome_id, 'Which team will win the game?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 1),
    (outcome_id, 'Will total points scored be over or under 50.5?', 2, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 50.5, "label": "50.5 points"}}', 2),
    (outcome_id, 'Will the game go to overtime?', 3, 'YES_NO',
     '{"type": "YES_NO"}', 3),
    (outcome_id, 'What will be the winning margin?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["1-3 points", "4-7 points", "8-14 points", "15+ points"]}', 4);

  -- Scoring questions (5)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (scoring_id, 'Which team will score first?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 1),
    (scoring_id, 'Which team will score last?', 2, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 2),
    (scoring_id, 'Will there be a safety in the game?', 3, 'YES_NO',
     '{"type": "YES_NO"}', 3),
    (scoring_id, 'Total field goals made - over or under 3.5?', 4, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 3.5, "label": "3.5 field goals"}}', 4),
    (scoring_id, 'Longest touchdown - over or under 45.5 yards?', 5, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 45.5, "label": "45.5 yards"}}', 5);

  -- Halftime Show questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (halftime_id, 'How many songs will be performed?', 1, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 8, "label": "8 songs"}}', 1),
    (halftime_id, 'Will there be a surprise guest performer?', 2, 'YES_NO',
     '{"type": "YES_NO"}', 2),
    (halftime_id, 'How many costume changes will the performer have?', 3, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 2.5, "label": "2.5 changes"}}', 3),
    (halftime_id, 'What will be the primary stage color?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Red/Pink", "Blue/Purple", "Gold/Yellow", "Green", "Black/White"]}', 4);

  -- Commercials & Broadcast questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (commercials_id, 'First commercial type aired?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Car", "Beer", "Tech", "Food", "Movie/TV"]}', 1),
    (commercials_id, 'Will announcers mention "dynasty" during the game?', 2, 'YES_NO',
     '{"type": "YES_NO"}', 2),
    (commercials_id, 'First celebrity shown in the stands?', 3, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Athlete", "Musician", "Actor", "Politician"]}', 3),
    (commercials_id, 'What color will the winning team's Gatorade bath be?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Orange", "Yellow/Green", "Blue/Purple", "Red", "Clear"]}', 4);

  -- Player Props questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (player_id, 'Which QB will throw more touchdowns?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A QB", "Team B QB", "Tie"]}', 1),
    (player_id, 'Will either QB throw an interception?', 2, 'YES_NO',
     '{"type": "YES_NO"}', 2),
    (player_id, 'Total rushing touchdowns - over or under 1.5?', 3, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 1.5, "label": "1.5 rushing TDs"}}', 3),
    (player_id, 'What position will the MVP play?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Quarterback", "Running Back", "Wide Receiver", "Defensive Player"]}', 4);

  -- Fun Props questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (fun_id, 'Will either head coach be shown crying?', 1, 'YES_NO',
     '{"type": "YES_NO"}', 1),
    (fun_id, 'Total penalty flags thrown - over or under 12.5?', 2, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 12.5, "label": "12.5 flags"}}', 2),
    (fun_id, 'What will be the last digit of the final score total?', 3, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["0-2", "3-4", "5-6", "7-9"]}', 3),
    (fun_id, 'Length of MVP''s acceptance speech - over or under 90 seconds?', 4, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 90, "label": "90 seconds"}}', 4);
END $$;
```
```sql
-- Insert categories
INSERT INTO categories (name, emoji, display_order) VALUES
  ('Pregame', '🏈', 1),
  ('Game Outcome', '🎯', 2),
  ('Scoring', '🏃', 3),
  ('Halftime Show', '🎤', 4),
  ('Commercials & Broadcast', '📺', 5),
  ('Player Props', '⭐', 6),
  ('Fun Props', '🎉', 7);

-- Get category IDs for reference
DO $$
DECLARE
  pregame_id UUID;
  outcome_id UUID;
  scoring_id UUID;
  halftime_id UUID;
  commercials_id UUID;
  player_id UUID;
  fun_id UUID;
BEGIN
  SELECT id INTO pregame_id FROM categories WHERE name = 'Pregame';
  SELECT id INTO outcome_id FROM categories WHERE name = 'Game Outcome';
  SELECT id INTO scoring_id FROM categories WHERE name = 'Scoring';
  SELECT id INTO halftime_id FROM categories WHERE name = 'Halftime Show';
  SELECT id INTO commercials_id FROM categories WHERE name = 'Commercials & Broadcast';
  SELECT id INTO player_id FROM categories WHERE name = 'Player Props';
  SELECT id INTO fun_id FROM categories WHERE name = 'Fun Props';

  -- Pregame questions (5)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (pregame_id, 'What will the coin toss result be?', 1, 'MULTIPLE_CHOICE', 
     '{"type": "MULTIPLE_CHOICE", "choices": ["Heads", "Tails"]}', 1),
    (pregame_id, 'Will the National Anthem be over or under 2 minutes 5 seconds?', 2, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 125, "label": "2:05"}}', 2),
    (pregame_id, 'Which team will win the coin toss?', 3, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 3),
    (pregame_id, 'What will happen on the opening kickoff?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Touchback", "Return inside 25", "Return past 25", "Fumble/Penalty"]}', 4),
    (pregame_id, 'What will be the first penalty of the game?', 5, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["False Start", "Holding", "Pass Interference", "Other"]}', 5);

  -- Game Outcome questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (outcome_id, 'Which team will win the game?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 1),
    (outcome_id, 'Will total points scored be over or under 50.5?', 2, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 50.5, "label": "50.5 points"}}', 2),
    (outcome_id, 'Will the game go to overtime?', 3, 'YES_NO',
     '{"type": "YES_NO"}', 3),
    (outcome_id, 'What will be the winning margin?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["1-3 points", "4-7 points", "8-14 points", "15+ points"]}', 4);

  -- Scoring questions (5)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (scoring_id, 'Which team will score first?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 1),
    (scoring_id, 'Which team will score last?', 2, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 2),
    (scoring_id, 'Will there be a safety in the game?', 3, 'YES_NO',
     '{"type": "YES_NO"}', 3),
    (scoring_id, 'Total field goals made - over or under 3.5?', 4, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 3.5, "label": "3.5 field goals"}}', 4),
    (scoring_id, 'Longest touchdown - over or under 45.5 yards?', 5, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 45.5, "label": "45.5 yards"}}', 5);

  -- Halftime Show questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (halftime_id, 'How many songs will be performed?', 1, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 8, "label": "8 songs"}}', 1),
    (halftime_id, 'Will there be a surprise guest performer?', 2, 'YES_NO',
     '{"type": "YES_NO"}', 2),
    (halftime_id, 'How many costume changes will the performer have?', 3, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 2.5, "label": "2.5 changes"}}', 3),
    (halftime_id, 'What will be the primary stage color?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Red/Pink", "Blue/Purple", "Gold/Yellow", "Green", "Black/White"]}', 4);

  -- Commercials & Broadcast questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (commercials_id, 'First commercial type aired?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Car", "Beer", "Tech", "Food", "Movie/TV"]}', 1),
    (commercials_id, 'Will announcers mention "dynasty" during the game?', 2, 'YES_NO',
     '{"type": "YES_NO"}', 2),
    (commercials_id, 'First celebrity shown in the stands?', 3, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Athlete", "Musician", "Actor", "Politician"]}', 3),
    (commercials_id, 'What color will the winning team's Gatorade bath be?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Orange", "Yellow/Green", "Blue/Purple", "Red", "Clear"]}', 4);

  -- Player Props questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (player_id, 'Which QB will throw more touchdowns?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A QB", "Team B QB", "Tie"]}', 1),
    (player_id, 'Will either QB throw an interception?', 2, 'YES_NO',
     '{"type": "YES_NO"}', 2),
    (player_id, 'Total rushing touchdowns - over or under 1.5?', 3, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 1.5, "label": "1.5 rushing TDs"}}', 3),
    (player_id, 'What position will the MVP play?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Quarterback", "Running Back", "Wide Receiver", "Defensive Player"]}', 4);

  -- Fun Props questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (fun_id, 'Will either head coach be shown crying?', 1, 'YES_NO',
     '{"type": "YES_NO"}', 1),
    (fun_id, 'Total penalty flags thrown - over or under 12.5?', 2, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 12.5, "label": "12.5 flags"}}', 2),
    (fun_id, 'What will be the last digit of the final score total?', 3, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["0-2", "3-4", "5-6", "7-9"]}', 3),
    (fun_id, 'Length of MVP''s acceptance speech - over or under 90 seconds?', 4, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 90, "label": "90 seconds"}}', 4);
END $$;
```

### Step 3.2: Execute Seed Migration
- [ ] In Supabase dashboard, go to SQL Editor
- [ ] Click "New Query"
- [ ] Copy and paste entire content from `002_seed_questions.sql`
- [ ] Click "Run" to execute
- [ ] Verify execution completes without errors

### Step 3.3: Verify Seeded Data
- [ ] In Supabase dashboard, go to Table Editor
- [ ] Open "categories" table - verify 7 rows
- [ ] Open "questions" table - verify 30 rows total
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
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function TestQuestions() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

  const { data: questions } = await supabase
    .from('questions')
    .select('*, category:categories(*)')
    .order('display_order')

  const questionsByCategory = questions?.reduce((acc, q) => {
    const catName = q.category.name
    if (!acc[catName]) acc[catName] = []
    acc[catName].push(q)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Questions Database Test</h1>
        <p className="text-slate-400 mb-6">Total: {questions?.length || 0} questions across {categories?.length || 0} categories</p>
        
        <div className="space-y-6">
          {categories?.map((cat) => (
            <div key={cat.id} className="glass rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {cat.emoji} {cat.name}
                <span className="text-sm text-slate-400 ml-3">
                  ({questionsByCategory?.[cat.name]?.length || 0} questions)
                </span>
              </h2>
              <ul className="space-y-3">
                {questionsByCategory?.[cat.name]?.map((q) => (
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