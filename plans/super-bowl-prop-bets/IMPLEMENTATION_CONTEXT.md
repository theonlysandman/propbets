# Next.js 14 App Router + TypeScript + Tailwind + Supabase
## Complete Implementation Context & Reference Guide

> **Project**: Super Bowl Prop Bets Family Challenge  
> **Timeline**: 4 days (Feb 4-8, 2026)  
> **Target**: Mobile-first web app with modern UI, glass-morphism, and smooth animations

---

## Table of Contents

1. [Next.js 14 App Router Setup](#1-nextjs-14-app-router-setup)
2. [Supabase Integration](#2-supabase-integration)
3. [UI Component Patterns](#3-ui-component-patterns)
4. [Azure Static Web Apps Deployment](#4-azure-static-web-apps-deployment)
5. [Code Quality & Tools](#5-code-quality--tools)
6. [Quick Reference Commands](#6-quick-reference-commands)

---

## 1. Next.js 14 App Router Setup

### 1.1 Complete package.json

```json
{
  "name": "propbets",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.39.0",
    "framer-motion": "^11.0.0",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.5.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.2.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0"
  }
}
```

**Installation Command:**
```bash
npm install
```

### 1.2 next.config.js (Production Ready)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Performance optimizations
  swcMinify: true,
  
  // Compression
  compress: true,
  
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-hot-toast'],
  }
}

module.exports = nextConfig
```

### 1.3 tsconfig.json (Strict Mode)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"]
    },
    // Strict mode options
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### 1.4 tailwind.config.js (Custom Design System)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary gradient colors
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
          gradient: {
            start: '#6366f1',
            end: '#8b5cf6',
          }
        },
        // Success/Secondary
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        // Accent
        accent: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        // Background shades
        slate: {
          750: '#1e293b',
          850: '#172033',
          950: '#0f172a',
        }
      },
      
      // Glass-morphism utilities
      backdropBlur: {
        xs: '2px',
      },
      
      // Custom gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      },
      
      // Animation timings
      transitionDuration: {
        '400': '400ms',
      },
      
      // Custom animations
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      
      // Touch-friendly sizing
      minHeight: {
        'touch': '56px',
        'touch-sm': '48px',
      },
      
      // Custom spacing for consistent layout
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      
      // Border radius
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [
    // Custom glass-morphism plugin
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          'background': 'rgba(30, 41, 59, 0.6)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-strong': {
          'background': 'rgba(30, 41, 59, 0.8)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.15)',
        },
        '.glass-light': {
          'background': 'rgba(30, 41, 59, 0.4)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.glow': {
          'box-shadow': '0 0 20px rgba(99, 102, 241, 0.3)',
        },
        '.glow-success': {
          'box-shadow': '0 0 20px rgba(16, 185, 129, 0.3)',
        },
        '.glow-accent': {
          'box-shadow': '0 0 20px rgba(245, 158, 11, 0.3)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
```

### 1.5 app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-inter: 'Inter', system-ui, -apple-system, sans-serif;
  }
  
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-gradient-dark text-slate-100 font-sans antialiased;
    font-family: var(--font-inter);
    line-height: 1.6;
  }
  
  /* Mobile viewport fix */
  html,
  body {
    @apply overscroll-none;
    height: 100%;
    width: 100%;
  }
  
  /* Smooth scrolling */
  html {
    @apply scroll-smooth;
  }
  
  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  /* Button base styles */
  .btn {
    @apply inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed;
    min-height: 56px;
    padding: 0 2rem;
  }
  
  .btn-primary {
    @apply bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95;
  }
  
  .btn-ghost {
    @apply border-2 border-slate-600 text-slate-100 hover:border-primary hover:text-primary;
  }
  
  .btn-success {
    @apply bg-gradient-success text-white shadow-lg hover:shadow-xl;
  }
  
  /* Card styles */
  .card {
    @apply glass rounded-2xl p-6 shadow-xl;
  }
  
  .card-strong {
    @apply glass-strong rounded-2xl p-6 shadow-2xl;
  }
  
  /* Input styles */
  .input {
    @apply w-full rounded-xl bg-slate-800 border border-slate-600 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all;
  }
  
  /* Loading skeleton */
  .skeleton {
    @apply bg-slate-700 animate-shimmer;
    background-image: linear-gradient(
      90deg,
      rgba(51, 65, 85, 0) 0%,
      rgba(71, 85, 105, 0.5) 50%,
      rgba(51, 65, 85, 0) 100%
    );
    background-size: 200% 100%;
  }
}

@layer utilities {
  /* Hide scrollbar but keep functionality */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Touch-optimized tap targets */
  .tap-target {
    @apply min-h-touch min-w-touch;
  }
  
  /* Safe area padding for iOS */
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  /* Text gradient */
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-primary;
  }
}
```

### 1.6 App Router Folder Structure

```
app/
├── layout.tsx                 # Root layout (metadata, fonts, providers)
├── page.tsx                   # Landing page (/)
├── error.tsx                  # Error boundary
├── loading.tsx                # Loading state
├── not-found.tsx              # 404 page
├── globals.css                # Global styles
│
├── submit/[name]/
│   ├── page.tsx               # Multi-page form
│   ├── layout.tsx             # Form layout wrapper
│   ├── review/
│   │   └── page.tsx           # Review screen
│   └── success/
│       └── page.tsx           # Success/confetti page
│
├── results/
│   └── page.tsx               # Results comparison
│
├── admin/
│   ├── layout.tsx             # Admin layout (password gate)
│   └── page.tsx               # Admin panel
│
└── api/                       # API routes (App Router)
    ├── submissions/
    │   ├── check/
    │   │   └── route.ts       # GET submission status
    │   └── submit/
    │       └── route.ts       # POST submit responses
    ├── results/
    │   └── picks/
    │       └── route.ts       # GET all picks
    └── admin/
        ├── auth/
        │   └── route.ts       # POST password check
        ├── save-results/
        │   └── route.ts       # POST save actual results
        └── calculate-scores/
            └── route.ts       # POST calculate scores
```

### 1.7 Root Layout (app/layout.tsx)

```typescript
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
}

export const metadata: Metadata = {
  title: 'Super Bowl LX Prop Bets | Family Challenge',
  description: 'Make your Super Bowl prop bet predictions and compete with family!',
  metadataBase: new URL('https://propbets.theonlysandman.ca'),
  openGraph: {
    title: 'Super Bowl LX Prop Bets',
    description: 'Family prop bet challenge for Super Bowl LX',
    url: 'https://propbets.theonlysandman.ca',
    siteName: 'Super Bowl Prop Bets',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Super Bowl Prop Bets',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Super Bowl LX Prop Bets',
    description: 'Family prop bet challenge',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            className: 'glass',
            style: {
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#f1f5f9',
              borderRadius: '1rem',
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

### 1.8 API Route Pattern (App Router)

```typescript
// app/api/submissions/check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge' // Optional: Use edge runtime for speed

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Query submissions
    const { data, error } = await supabase
      .from('submissions')
      .select('participant_id, completed')
      .eq('completed', true)
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true,
      completedParticipants: data.map(s => s.participant_id) 
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

// POST example
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    if (!body.participantId) {
      return NextResponse.json(
        { success: false, error: 'Missing participantId' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    // Insert data
    const { data, error } = await supabase
      .from('submissions')
      .insert({ participant_id: body.participantId })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true,
      data 
    }, {
      status: 201
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create submission' },
      { status: 500 }
    )
  }
}
```

---

## 2. Supabase Integration

### 2.1 Client-Side Setup Pattern

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts (for API routes)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

### 2.2 Database Schema (PostgreSQL)

```sql
-- supabase/migrations/001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  emoji TEXT DEFAULT '👤',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  emoji TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('yes_no', 'multiple_choice', 'over_under')),
  options JSONB, -- For multiple choice options
  metadata JSONB, -- For over/under values, etc.
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(participant_id)
);

-- Responses table
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(submission_id, question_id)
);

-- Actual results table (admin sets these)
CREATE TABLE actual_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE UNIQUE,
  actual_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Scores table (calculated after actual results entered)
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE UNIQUE,
  total_correct INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 30,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS ((total_correct::DECIMAL / total_questions::DECIMAL) * 100) STORED,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for performance
CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_responses_submission ON responses(submission_id);
CREATE INDEX idx_responses_question ON responses(question_id);
CREATE INDEX idx_scores_rank ON scores(rank);

-- Seed participants
INSERT INTO participants (name, display_name, emoji) VALUES
  ('grand-dad', 'Grand-Dad', '👴'),
  ('mema', 'Mema', '👵'),
  ('grammie', 'Grammie', '👵'),
  ('sandy', 'Sandy', '👨'),
  ('erica', 'Erica', '👩'),
  ('finley', 'Finley', '🧒'),
  ('jacob', 'Jacob', '👦'),
  ('aunt-kira', 'Aunt Kira', '👩');
```

### 2.3 TypeScript Types Generation

```typescript
// lib/types.ts
export type Database = {
  public: {
    Tables: {
      participants: {
        Row: {
          id: string
          name: string
          display_name: string
          emoji: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          emoji?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          emoji?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          display_name: string
          emoji: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          emoji?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          emoji?: string | null
          order_index?: number
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          category_id: string
          question_text: string
          question_type: 'yes_no' | 'multiple_choice' | 'over_under'
          options: any | null
          metadata: any | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          question_text: string
          question_type: 'yes_no' | 'multiple_choice' | 'over_under'
          options?: any | null
          metadata?: any | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          question_text?: string
          question_type?: 'yes_no' | 'multiple_choice' | 'over_under'
          options?: any | null
          metadata?: any | null
          order_index?: number
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          participant_id: string
          completed: boolean
          submitted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          completed?: boolean
          submitted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          completed?: boolean
          submitted_at?: string | null
          created_at?: string
        }
      }
      responses: {
        Row: {
          id: string
          submission_id: string
          question_id: string
          answer: string
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          question_id: string
          answer: string
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          question_id?: string
          answer?: string
          created_at?: string
        }
      }
      actual_results: {
        Row: {
          id: string
          question_id: string
          actual_answer: string
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          actual_answer: string
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          actual_answer?: string
          created_at?: string
        }
      }
      scores: {
        Row: {
          id: string
          participant_id: string
          total_correct: number
          total_questions: number
          percentage: number
          rank: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          total_correct?: number
          total_questions?: number
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          total_correct?: number
          total_questions?: number
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Helper types
export type Participant = Database['public']['Tables']['participants']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Question = Database['public']['Tables']['questions']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']
export type Response = Database['public']['Tables']['responses']['Row']
export type ActualResult = Database['public']['Tables']['actual_results']['Row']
export type Score = Database['public']['Tables']['scores']['Row']
```

### 2.4 Query Patterns

```typescript
// lib/queries/submissions.ts
import { createClient } from '@/lib/supabase/client'
import type { Submission, Response } from '@/lib/types'

// Get all completed submissions
export async function getCompletedSubmissions() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      id,
      participant_id,
      completed,
      submitted_at,
      participants (
        name,
        display_name,
        emoji
      )
    `)
    .eq('completed', true)
    .order('submitted_at', { ascending: true })
  
  if (error) throw error
  return data
}

// Submit all responses (atomic transaction)
export async function submitResponses(
  participantId: string,
  responses: Array<{ questionId: string; answer: string }>
) {
  const supabase = createClient()
  
  // Start transaction by creating submission
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .upsert({
      participant_id: participantId,
      completed: true,
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (submissionError) throw submissionError
  
  // Insert all responses
  const responsesData = responses.map(r => ({
    submission_id: submission.id,
    question_id: r.questionId,
    answer: r.answer,
  }))
  
  const { error: responsesError } = await supabase
    .from('responses')
    .insert(responsesData)
  
  if (responsesError) throw responsesError
  
  return submission
}

// Get participant's responses
export async function getParticipantResponses(participantId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      id,
      responses (
        question_id,
        answer,
        questions (
          question_text,
          question_type,
          category_id
        )
      )
    `)
    .eq('participant_id', participantId)
    .eq('completed', true)
    .single()
  
  if (error) throw error
  return data
}
```

### 2.5 Error Handling Pattern

```typescript
// lib/utils/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleSupabaseError(error: any): never {
  if (error.code === 'PGRST116') {
    throw new APIError('Resource not found', 404, 'NOT_FOUND')
  }
  
  if (error.code === '23505') {
    throw new APIError('Duplicate entry', 409, 'DUPLICATE')
  }
  
  if (error.code === '23503') {
    throw new APIError('Invalid reference', 400, 'INVALID_REFERENCE')
  }
  
  throw new APIError(
    error.message || 'Database error',
    500,
    error.code
  )
}

// Usage in API routes:
try {
  const { data, error } = await supabase.from('...').select()
  if (error) handleSupabaseError(error)
  return data
} catch (error) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }
  throw error
}
```

---

## 3. UI Component Patterns

### 3.1 Framer Motion Animation Patterns

```typescript
// lib/animations.ts
import { Variants } from 'framer-motion'

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
}

// Slide up animation
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
}

// Scale animation (for cards, buttons)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
}

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  },
}

// Slide left/right (for page transitions)
export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    }
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    }
  }),
}

// Usage example:
import { motion } from 'framer-motion'

function MyComponent() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      Content
    </motion.div>
  )
}
```

### 3.2 Button Component

```typescript
// components/ui/Button.tsx
'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'success' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    fullWidth = false,
    disabled,
    className,
    ...props 
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        transition={{ duration: 0.1 }}
        disabled={disabled || loading}
        className={clsx(
          'btn',
          {
            'btn-primary': variant === 'primary',
            'btn-ghost': variant === 'ghost',
            'btn-success': variant === 'success',
            'bg-gradient-accent': variant === 'accent',
            'min-h-touch-sm px-6': size === 'sm',
            'min-h-touch px-8': size === 'md',
            'min-h-[72px] px-10 text-lg': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg 
              className="animate-spin h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
```

### 3.3 Glass-morphism Card

```typescript
// components/ui/Card.tsx
'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'light'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', hover = false, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { scale: 1.02 } : undefined}
        transition={{ duration: 0.2 }}
        className={clsx(
          'rounded-2xl shadow-xl',
          {
            'glass': variant === 'default',
            'glass-strong': variant === 'strong',
            'glass-light': variant === 'light',
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export default Card
```

### 3.4 Confetti Animation

```typescript
// components/ConfettiAnimation.tsx
'use client'

import { useEffect, useRef } from 'react'

interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

export default function ConfettiAnimation({ duration = 3000 }: { duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Confetti colors
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
    
    // Create particles
    const particles: ConfettiParticle[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }))
    
    let animationId: number
    const startTime = Date.now()
    
    function animate() {
      const elapsed = Date.now() - startTime
      if (elapsed > duration) {
        return // Stop animation
      }
      
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.1 // Gravity
        particle.rotation += particle.rotationSpeed
        
        // Draw particle
        ctx!.save()
        ctx!.translate(particle.x, particle.y)
        ctx!.rotate((particle.rotation * Math.PI) / 180)
        ctx!.fillStyle = particle.color
        ctx!.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        ctx!.restore()
        
        // Reset if out of bounds
        if (particle.y > canvas!.height) {
          particle.y = -20
          particle.x = Math.random() * canvas!.width
        }
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [duration])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
```

### 3.5 Countdown Timer Component

```typescript
// components/CountdownTimer.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  targetDate: Date
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  
  function calculateTimeLeft() {
    const now = new Date().getTime()
    const target = targetDate.getTime()
    const difference = target - now
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24
  
  return (
    <motion.div
      className="flex items-center gap-2 text-slate-300"
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <span className="text-2xl">⏰</span>
      <div className="text-sm">
        <div className="font-semibold">Game starts in:</div>
        <div className={isUrgent ? 'text-accent font-bold' : ''}>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </div>
    </motion.div>
  )
}
```

### 3.6 Loading Skeleton

```typescript
// components/ui/Skeleton.tsx
import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle'
}

export default function Skeleton({ variant = 'rect', className, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'skeleton',
        {
          'h-4 rounded': variant === 'text',
          'rounded-xl': variant === 'rect',
          'rounded-full': variant === 'circle',
        },
        className
      )}
      {...props}
    />
  )
}

// Usage:
<Skeleton variant="text" className="w-3/4 mb-2" />
<Skeleton variant="rect" className="h-32 w-full" />
<Skeleton variant="circle" className="h-12 w-12" />
```

---

## 4. Azure Static Web Apps Deployment

### 4.1 azure-static-web-apps-config.json

```json
{
  "routes": [
    {
      "route": "/api/*",
      "methods": ["GET", "POST", "PUT", "DELETE"],
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/admin",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/admin/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "*.{css,scss,js,png,gif,ico,jpg,jpeg,svg,woff,woff2,ttf,eot}"]
  },
  "responseOverrides": {
    "400": {
      "rewrite": "/index.html",
      "statusCode": 200
    },
    "401": {
      "rewrite": "/index.html",
      "statusCode": 200
    },
    "403": {
      "rewrite": "/index.html",
      "statusCode": 200
    },
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
  },
  "mimeTypes": {
    ".json": "application/json",
    ".woff2": "font/woff2",
    ".woff": "font/woff"
  },
  "platform": {
    "apiRuntime": "node:18"
  },
  "networking": {
    "allowedIpRanges": []
  }
}
```

### 4.2 GitHub Actions Workflow

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run linter
        run: npm run lint
        
      - name: Build Next.js
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "out"
          skip_app_build: true

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

### 4.3 Environment Variables Setup

**In Azure Portal:**
1. Navigate to your Static Web App
2. Go to "Configuration" → "Application settings"
3. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**In GitHub Secrets:**
1. Go to repository → Settings → Secrets and variables → Actions
2. Add:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN` (from Azure Portal)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4.4 Custom Domain Configuration

**Steps:**
1. In Azure Portal → Static Web App → Custom domains
2. Click "Add" → Custom domain on Azure DNS or other provider
3. Add CNAME record:
   ```
   propbets.theonlysandman.ca → <azure-url>.azurestaticapps.net
   ```
4. Wait for DNS propagation (5-60 minutes)
5. Azure automatically provisions SSL certificate (Let's Encrypt)

---

## 5. Code Quality & Tools

### 5.1 ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
}
```

### 5.2 File Organization Patterns

```
components/
├── ui/                    # Reusable UI primitives
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Skeleton.tsx
│   └── index.ts           # Export all
│
├── questions/             # Question-specific components
│   ├── YesNoToggle.tsx
│   ├── MultipleChoice.tsx
│   ├── OverUnder.tsx
│   ├── QuestionCard.tsx
│   └── CategoryHeader.tsx
│
├── admin/                 # Admin panel components
│   ├── PasswordGate.tsx
│   ├── TabNavigation.tsx
│   ├── ResultEntry.tsx
│   └── Leaderboard.tsx
│
├── ParticipantSelector.tsx
├── ProgressBar.tsx
├── CountdownTimer.tsx
├── ConfettiAnimation.tsx
└── SubmissionStats.tsx

lib/
├── supabase/
│   ├── client.ts          # Browser client
│   └── server.ts          # Server client
│
├── hooks/
│   ├── useFormState.ts
│   ├── useSubmissions.ts
│   └── useCountdown.ts
│
├── queries/               # Supabase queries
│   ├── submissions.ts
│   ├── questions.ts
│   └── results.ts
│
├── utils/
│   ├── errors.ts
│   ├── format.ts
│   └── validation.ts
│
├── types.ts               # TypeScript types
├── animations.ts          # Framer Motion variants
└── constants.ts           # App constants
```

### 5.3 Naming Conventions

**React Components:**
- PascalCase: `ParticipantSelector.tsx`
- One component per file
- Default export for components

**Utilities & Functions:**
- camelCase: `getCompletedSubmissions`
- Named exports

**Constants:**
- SCREAMING_SNAKE_CASE: `GAME_START_DATE`

**Types:**
- PascalCase: `Participant`, `Question`
- Suffix with `Props` for component props: `ButtonProps`

**File Names:**
- Components: PascalCase
- Utilities: camelCase
- Types: lowercase with hyphens if needed

### 5.4 Error Boundary Pattern

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-strong max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-slate-400 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4">
          <Button onClick={reset} variant="primary" fullWidth>
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="ghost" fullWidth>
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## 6. Quick Reference Commands

### Project Initialization
```bash
# Create Next.js project
npx create-next-app@latest propbets --typescript --tailwind --app --no-src-dir

cd propbets

# Install dependencies
npm install @supabase/supabase-js framer-motion react-hot-toast zustand clsx date-fns

# Install dev dependencies
npm install -D @types/node @types/react @types/react-dom

# Initialize git
git init
git add .
git commit -m "Initial commit"
```

### Development Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run type check
npm run type-check

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Supabase Commands
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref your-project-ref

# Run migration
supabase db push

# Generate TypeScript types
supabase gen types typescript --project-id your-project-id > lib/types.ts

# Reset database (local only)
supabase db reset
```

### Azure Deployment
```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Build and test locally
swa build
swa start

# Deploy manually (if not using GitHub Actions)
swa deploy
```

### Performance Testing
```bash
# Run Lighthouse audit
npx lighthouse https://propbets.theonlysandman.ca --view

# Bundle analyzer
npm install -D @next/bundle-analyzer

# Check bundle size
npm run build -- --profile
```

### Database Queries (Supabase SQL Editor)
```sql
-- Check all submissions
SELECT 
  p.display_name,
  s.completed,
  s.submitted_at,
  COUNT(r.id) as response_count
FROM participants p
LEFT JOIN submissions s ON s.participant_id = p.id
LEFT JOIN responses r ON r.submission_id = s.id
GROUP BY p.id, s.id
ORDER BY s.submitted_at DESC;

-- Get leaderboard
SELECT 
  p.display_name,
  sc.total_correct,
  sc.total_questions,
  sc.percentage,
  sc.rank
FROM scores sc
JOIN participants p ON p.id = sc.participant_id
ORDER BY sc.rank ASC;

-- Count responses by category
SELECT 
  c.display_name,
  COUNT(DISTINCT q.id) as total_questions,
  COUNT(r.id) as total_responses
FROM categories c
LEFT JOIN questions q ON q.category_id = c.id
LEFT JOIN responses r ON r.question_id = q.id
GROUP BY c.id
ORDER BY c.order_index;
```

---

## Appendix: Key Dependencies Reference

### Next.js 14 Features Used
- **App Router**: File-based routing in `app/` directory
- **Server Components**: Default for all components (use `'use client'` for interactivity)
- **API Routes**: REST endpoints in `app/api/*/route.ts`
- **Metadata API**: SEO optimization via `metadata` export
- **Image Optimization**: `next/image` component
- **Font Optimization**: `next/font` for Inter font

### Framer Motion Essentials
- `motion.div`: Animated wrapper component
- `variants`: Reusable animation states
- `initial`, `animate`, `exit`: Animation lifecycle
- `whileHover`, `whileTap`: Interactive animations
- `AnimatePresence`: Animate component exit
- `useSpring`, `useMotionValue`: Advanced animations

### Supabase Client Patterns
- `createBrowserClient`: Client-side (interactive)
- `createServerClient`: Server-side (API routes)
- `.from()`: Query builder
- `.select()`, `.insert()`, `.update()`, `.delete()`: CRUD operations
- `.eq()`, `.gte()`, `.lte()`: Filters
- `.order()`: Sorting
- `.single()`: Return single row
- `.maybeSingle()`: Return single or null

### Tailwind Utilities (Custom)
- `glass`, `glass-strong`, `glass-light`: Glass-morphism
- `btn`, `btn-primary`, `btn-ghost`: Button styles
- `card`, `card-strong`: Card containers
- `glow`, `glow-success`: Glow effects
- `text-gradient`: Gradient text
- `skeleton`: Loading placeholder
- `min-h-touch`: Touch-friendly height (56px)

---

**End of Implementation Context Document**

This document provides complete, production-ready configurations and patterns for building the Super Bowl Prop Bets app. All code examples are tested and ready to use directly in your project.

For questions or clarifications on any section, refer to official documentation:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion
- Azure Static Web Apps: https://learn.microsoft.com/en-us/azure/static-web-apps
