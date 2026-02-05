# Super Bowl Prop Bets Family Challenge

**Branch:** `initial-implementation`
**Description:** Mobile-first web app for family Super Bowl prop bet challenge with 8 participants and 30 fun questions

## Goal
Create a mobile-optimized web application where 8 family members can submit their Super Bowl prop bet predictions before the game. After everyone submits, all picks are revealed. An admin panel allows entering actual results to calculate scores. Target completion: February 8, 2026 (4 days).

## Assumptions
- Participants: Grand-Dad, Mema, Grammie, Sandy, Erica, Finley, Jacob, Aunt Kira (hardcoded list)
- 30 total questions across 7 categories (fun for non-football fans)
- No authentication - just select name from dropdown
- No editing after submission
- Picks hidden until ALL 8 people submit
- Generic questions that work regardless of which teams are playing
- Admin can update halftime show questions before game day
- Using Next.js 14+ (App Router), Tailwind CSS, Supabase for database
- Deploying to Azure Static Web Apps with custom domain: propbets.theonlysandman.ca
- Modern, sleek UI with smooth animations and no clunky elements

## Open Questions
None - all clarified with user.

## Design System & UI/UX Specifications

### Visual Design Principles
- **Color Palette**: 
  - Primary: Deep purple/blue gradient (#6366f1 to #8b5cf6) - modern, energetic
  - Secondary: Emerald green (#10b981) for success states
  - Accent: Amber (#f59e0b) for highlights and CTAs
  - Background: Dark mode with subtle gradients (slate-900 to slate-800)
  - Cards: Glass-morphism effect (backdrop-blur, semi-transparent)
  - Text: High contrast white/slate-100 on dark backgrounds

- **Typography**:
  - Headings: Inter font, bold, large tracking
  - Body: Inter font, regular, readable line-height (1.6)
  - Size scale: Mobile-optimized (16px base, 1.25rem scale factor)

- **Spacing & Layout**:
  - Generous white space (no cramped elements)
  - Consistent padding (1rem base unit)
  - Max width: 640px on mobile (full screen), 1024px on desktop
  - Border radius: Rounded-2xl (1rem) for cards, full for buttons

- **Animations & Interactions**:
  - Smooth transitions (300ms ease-in-out)
  - Micro-interactions on all tappable elements (scale on press, haptic feedback)
  - Skeleton loaders for data fetching (no blank states)
  - Celebratory confetti on submission success
  - Slide transitions between form pages

- **Touch Targets**:
  - Minimum 56px height for all buttons
  - 48px minimum for smaller interactive elements
  - 16px spacing between tappable elements
  - Full-width buttons on mobile (edge-to-edge with 1rem padding)

### Page-Specific UI Details

#### Landing Page (`/`)
```
┌─────────────────────────────────────┐
│ [Gradient Background with Football] │
│                                     │
│    🏈 SUPER BOWL LX PROP BETS      │
│         Family Challenge            │
│                                     │
│  ┌─────────────────────────────┐  │
│  │  👤 Select Your Name         │  │
│  │                              │  │
│  │  [Grid of 8 Name Cards]      │  │
│  │  ┌────────┐  ┌────────┐     │  │
│  │  │Grand-Dad│ │  Mema   │     │  │
│  │  │   ✓     │ │         │     │  │
│  │  └────────┘  └────────┘     │  │
│  │  [Greyed if completed]       │  │
│  │                              │  │
│  └─────────────────────────────┘  │
│                                     │
│  [Large "START PICKS" Button]      │
│  (Gradient, Glowing effect)         │
│                                     │
│  Status: 5/8 Completed 🎯          │
│  ⏰ Game starts Feb 8 at 6:30pm    │
└─────────────────────────────────────┘
```
**Design Details**:
- Animated gradient background (subtle movement)
- Name cards: Glass-morphism with hover/tap scale effect
- Completed names: Semi-transparent with checkmark badge
- Active names: Bright gradient border on selection
- Countdown timer: Pulsing animation when < 24 hours
- Bottom safe area padding for iPhone notch

---

#### Multi-Page Form (`/submit/[name]`)

**Progress Bar (Sticky Top)**
```
┌─────────────────────────────────────┐
│ Hi Sandy! 👋                        │
│ ●●●○○○○ Halftime Show (4/7)        │
│ [Thin gradient progress line]       │
└─────────────────────────────────────┘
```
**Design Details**:
- Personalized greeting with emoji
- Filled dots: Primary gradient
- Current dot: Animated pulse
- Progress line: Smooth animated fill (0-100%)
- Sticky position with blur backdrop

**Category Page Layout**
```
┌─────────────────────────────────────┐
│ [Progress Bar - Sticky]             │
├─────────────────────────────────────┤
│                                     │
│  🎤 HALFTIME SHOW                   │
│  ────────────────────────            │
│                                     │
│  [Scrollable Question Cards]        │
│  ┌───────────────────────────────┐ │
│  │ 1. How many songs performed?  │ │
│  │                               │ │
│  │  ┌─────────┐  ┌─────────┐   │ │
│  │  │ OVER 12 │  │ UNDER 12│   │ │
│  │  └─────────┘  └─────────┘   │ │
│  │     (Selected: Green glow)   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 2. Will there be a surprise   │ │
│  │    guest?                     │ │
│  │                               │ │
│  │  ┌──────────┐  ┌──────────┐  │ │
│  │  │   YES    │  │    NO    │  │ │
│  │  └──────────┘  └──────────┘  │ │
│  └───────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [Sticky Bottom Navigation]          │
│ ┌──────────┐        ┌──────────┐  │
│ │ ← BACK   │        │ CONTINUE →│  │
│ └──────────┘        └──────────┘  │
│ (Ghost style)      (Primary grad) │
└─────────────────────────────────────┘
```

**Question Card Design Details**:
- Card: Glass-morphism with subtle shadow
- Padding: 1.5rem all sides
- Question number: Small badge (slate-400)
- Question text: Bold, 1.125rem, white
- Answer options: 
  - Unselected: Slate-700 background, slate-300 border
  - Selected: Gradient fill (primary), white text, subtle glow
  - Hover/Active: Scale 0.95, 100ms spring animation
- Spacing: 1rem between cards, 0.75rem between options
- Icons: Contextual emojis (🏈 for football, 🎤 for halftime)

**Bottom Navigation**:
- Fixed position with safe area padding
- Back button: Ghost (outline only, secondary color)
- Continue button: Disabled state if questions unanswered (opacity 50%)
- Shadow gradient above buttons for depth
- Haptic feedback on tap (if supported)

---

#### Review Screen (`/submit/[name]/review`)
```
┌─────────────────────────────────────┐
│ 📋 Review Your Picks                │
│ ────────────────────────              │
│                                     │
│ [Accordion by Category]             │
│ ▼ 🏈 Pregame (5 questions)          │
│   ┌─────────────────────────────┐  │
│   │ Coin Toss: HEADS            │  │
│   │ Anthem Length: OVER 2:05    │  │
│   │ ...                         │  │
│   └─────────────────────────────┘  │
│                                     │
│ ▶ 🎯 Game Outcome (4 questions)     │
│ ▶ 🏃 Scoring (5 questions)          │
│ ▶ 🎤 Halftime Show (4 questions)    │
│ ...                                 │
│                                     │
│ ✓ All 30 questions answered         │
│                                     │
│ [Edit Answers Button]               │
│ (Secondary, outline)                │
│                                     │
│ [SUBMIT FINAL PICKS]                │
│ (Large, gradient, glowing)          │
│                                     │
└─────────────────────────────────────┘
```
**Design Details**:
- Accordion: Smooth expand/collapse animation
- Category headers: Bold with emoji, tap to expand
- Answer list: Compact, readable (question: answer format)
- Completion indicator: Green checkmark with count
- Edit button: Navigate back to specific category
- Submit button: Extra large (72px height), gradient, animated glow
- Confirmation modal before submit (prevent accidents)

---

#### Success Screen (`/submit/[name]/success`)
```
┌─────────────────────────────────────┐
│                                     │
│        [Animated Confetti] 🎉      │
│                                     │
│         ✓ PICKS LOCKED IN!         │
│                                     │
│      Great choices, Sandy!          │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ✅ 30/30 questions answered   │ │
│  │ ⏰ Submitted Feb 4 @ 2:30pm   │ │
│  │ 🎯 5/8 family members done    │ │
│  └───────────────────────────────┘ │
│                                     │
│  [View All Picks] (disabled)        │
│  (Locked until everyone submits)    │
│                                     │
│  [Back to Home]                     │
│                                     │
└─────────────────────────────────────┘
```
**Design Details**:
- Confetti animation: Canvas-based, 3 seconds
- Success icon: Large, animated checkmark (draw animation)
- Info card: Glass-morphism, centered stats
- Disabled state: Faded with lock icon
- Animation sequence: Confetti → Checkmark → Stats fade in

---

#### Results Page (`/results`)

**Before All Submit**
```
┌─────────────────────────────────────┐
│ 🔒 Results Locked                   │
│                                     │
│  Waiting for picks from:            │
│  • Finley                           │
│  • Jacob                            │
│  • Aunt Kira                        │
│                                     │
│  ⏰ 3 people left to submit         │
│                                     │
│  [Check Again Button]               │
│  (Auto-refreshes every 30s)         │
└─────────────────────────────────────┘
```

**After All Submit - Comparison Grid**
```
┌─────────────────────────────────────┐
│ 🎯 Everyone's Picks                 │
│ [Category Filter Chips]             │
│ ┌──┬──┬──┬──┬──┬──┬──┬──┐         │
│ │☰│GD│Me│Gr│Sa│Er│Fi│Ja│Ki│       │
│ └──┴──┴──┴──┴──┴──┴──┴──┘         │
│                                     │
│ [Horizontal Scroll Table]           │
│ ┌───────────────┬─┬─┬─┬─┬─┬─┬─┬─┐│
│ │Coin Toss      │H│T│H│H│T│H│T│H││
│ ├───────────────┼─┼─┼─┼─┼─┼─┼─┼─┤│
│ │Winner         │KC│PHI│KC│KC│PHI│...
│ │               │(Majority: Green)││
│ │               │(Unique: Amber)  ││
│ └───────────────┴─┴─┴─┴─┴─┴─┴─┴─┘│
│                                     │
│ [Export PDF Button]                 │
└─────────────────────────────────────┘
```
**Design Details**:
- Locked state: Centered card with lock icon
- Auto-refresh: Subtle loading indicator
- Filter chips: Pill-shaped, toggle selection
- Participant headers: Abbreviated names with avatars (emoji)
- Table cells: Compact text, color-coded
  - Majority pick: Green background
  - Unique pick: Amber background
  - Tied picks: Purple background
- Horizontal scroll: Snap to columns on mobile
- Sticky first column (question text)

---

#### Admin Panel (`/admin`)

**Password Entry**
```
┌─────────────────────────────────────┐
│ 🔐 Admin Access                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ [Password Input]              │ │
│  │ (Centered, large, secure)     │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Enter Button]                     │
└─────────────────────────────────────┘
```

**Result Entry Interface**
```
┌─────────────────────────────────────┐
│ ⚙️ Admin Panel                      │
│ [Tab Navigation]                    │
│ ┌─────────┬───────────┬──────────┐ │
│ │ ENTER   │ CALCULATE │LEADERBOARD│
│ │RESULTS  │  SCORES   │          │ │
│ └─────────┴───────────┴──────────┘ │
│                                     │
│ [Question List - Accordion]         │
│ ▼ 🏈 Pregame                        │
│   ┌─────────────────────────────┐  │
│   │ Coin Toss?                  │  │
│   │ ┌──────────┐  ┌──────────┐ │  │
│   │ │  HEADS   │  │  TAILS   │ │  │
│   │ └──────────┘  └──────────┘ │  │
│   │ [Save ✓]                    │  │
│   └─────────────────────────────┘  │
│                                     │
│ Progress: 30/30 results entered ✓   │
│                                     │
│ [Calculate Scores Button]           │
│ (Only enabled when all entered)     │
└─────────────────────────────────────┘
```

**Leaderboard**
```
┌─────────────────────────────────────┐
│ 🏆 Final Leaderboard                │
│                                     │
│  1. 🥇 Sandy       25/30 (83%)     │
│  2. 🥈 Grand-Dad   24/30 (80%)     │
│  3. 🥉 Mema        23/30 (77%)     │
│  4.    Erica       22/30 (73%)     │
│  5.    Grammie     21/30 (70%)     │
│  6.    Finley      20/30 (67%)     │
│  7.    Jacob       19/30 (63%)     │
│  8.    Aunt Kira   18/30 (60%)     │
│                                     │
│  [View Details] for each person     │
│  (Expands to show right/wrong)      │
│                                     │
│  [Share Results Button]             │
└─────────────────────────────────────┘
```
**Design Details**:
- Tab navigation: Underline active tab with gradient
- Result entry: Same question components as user form
- Save feedback: Green checkmark animation
- Progress indicator: Circular progress ring
- Leaderboard: Podium-style top 3 with medals
- Gradient backgrounds for top 3 (gold/silver/bronze)
- Expandable details: Slide-down animation with checkmarks/x marks

## Implementation Steps

### Step 1: Project Initialization & Basic Setup
**Files:** 
- `package.json`
- `next.config.js`
- `tailwind.config.js`
- `tsconfig.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `.env.local`
- `.gitignore`
- `azure-static-web-apps-config.json` (Azure config)

**What:** 
Initialize Next.js 14 project with TypeScript and Tailwind CSS. Configure Supabase client connection. Create basic app layout with mobile-first viewport settings, dark mode theme, and modern design system (Inter font, gradient colors, glass-morphism utilities). Set up Azure Static Web Apps configuration for deployment to propbets.theonlysandman.ca. Install animation libraries (framer-motion) and UI dependencies.

**Testing:** 
- Run `npm run dev` successfully
- View localhost:3000 in browser with dark theme
- Test responsive design on mobile viewport (375px width)
- Verify Supabase connection (simple test query)
- Verify Tailwind custom classes work (gradients, glass effect)

---

### Step 2: Database Schema & Supabase Setup
**Files:**
- `supabase/migrations/001_initial_schema.sql`
- `lib/supabase.ts`
- `lib/types.ts`

**What:** 
Create Supabase tables: `participants`, `categories`, `questions`, `responses`, `submissions`. Define TypeScript types matching database schema. Set up Supabase client utilities and type-safe queries. Populate participants table with 8 family members.

**Testing:**
- Execute migration in Supabase dashboard
- Verify all tables created with correct columns
- Test inserting/querying data via Supabase dashboard
- Verify TypeScript types compile without errors

---

### Step 3: Seed Question Data
**Files:**
- `supabase/migrations/002_seed_questions.sql`
- `data/questions.json` (for reference)

**What:**
Create 30 prop bet questions across 7 categories:
1. **Pregame** (5 questions): coin toss, anthem length, who wins toss, opening kickoff result, first penalty type
2. **Game Outcome** (4 questions): winner, total points over/under, will it go to OT, winning margin range
3. **Scoring** (5 questions): first team to score, last team to score, will there be a safety, field goals made over/under, longest TD over/under
4. **Halftime Show** (4 questions): number of songs, surprise guest yes/no, costume changes, stage color (generic, editable later)
5. **Commercials & Broadcast** (4 questions): first advertiser type, announcers mention specific topics, celebrity shown, color of Gatorade dump
6. **Player Props** (4 questions): which QB throws more TDs, will either QB throw INT, total rushing TDs over/under, MVP position (QB/RB/WR/Other)
7. **Fun Props** (4 questions): coaches shown crying, referee total flags over/under, final score last digit, length of postgame speech

All questions designed to be fun for non-football fans with clear Yes/No, Multiple Choice, or Over/Under formats.

**Testing:**
- Run migration successfully
- Query questions from database grouped by category
- Verify all 30 questions have correct type metadata
- Confirm questions are non-technical and accessible

---

### Step 4: Landing Page - Name Selection
**Files:**
- `app/page.tsx`
- `components/ParticipantSelector.tsx`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/CountdownTimer.tsx`
- `app/api/submissions/check/route.ts`
- `lib/animations.ts`

**What:**
Create modern landing page following design spec:
- **Hero Section**: Gradient background with animated football emoji, app title in large bold text (Inter font), subtitle
- **Participant Grid**: 8 glass-morphism cards (2x4 grid on mobile) showing names with emoji avatars
- **Real-time Status**: API polling every 30s to check submission status, completed names greyed with checkmark badge
- **Selection Interaction**: Tap card to select (gradient border highlight), selected state persists, Start button activates
- **Countdown Timer**: Animated clock showing time until kickoff (pulsing when < 24 hours)
- **Start Button**: Large gradient button (72px height) with glow effect, disabled until name selected
- **Animations**: Framer Motion for card hover/tap scale, staggered fade-in on page load

**UI Details**:
- Background: Radial gradient from slate-900 to indigo-900
- Name cards: Backdrop blur, border-slate-700, rounded-2xl, 56px height
- Typography: Title 3rem/bold, subtitle 1.25rem/normal
- Safe area: Bottom padding for iPhone home indicator
- Loading skeleton: Shimmer effect while checking submission status

**Testing:**
- All 8 names display correctly in responsive grid
- Clicking name adds gradient border and enables Start button
- Completed participants show greyed with animated checkmark
- Start button navigates to `/submit/[name]` with selected name
- Countdown updates every second
- API polling works (submission status updates without refresh)
- Mobile UI has proper touch targets (56px+ height)
- Animations are smooth on mobile (60fps)
- Test on iOS Safari and Chrome Android
- Dropdown/button grid to select name from 8 participants
- Real-time status showing who has completed (greyed out with "✓ Completed")
- Start button (navigates to `/submit/[name]`)
- API route to check submission status for each participant

**Testing:**
- All 8 names display correctly
- Clicking name enables Start button
- Completed participants show as greyed with checkmark
- Start button navigates to submission form
- Mobile UI is thumb-friendly (large tap targets)

---

### Step 5: Question Components Library
**Files:**
- `components/questions/YesNoToggle.tsx`
- `components/questions/MultipleChoice.tsx`
- `components/questions/OverUnder.tsx`
- `components/questions/QuestionCard.tsx`
- `components/questions/CategoryHeader.tsx`
- `lib/questionUtils.ts`

**What:**
Build reusable, modern question components following design spec:

**YesNoToggle**:
- Two equal-width buttons side-by-side (50% each with gap)
- Unselected: Slate-700 bg, slate-300 border, white text
- Selected: Primary gradient bg, white text, subtle glow (box-shadow)
- Tap animation: Scale 0.95 with 100ms spring
- Height: 64px for easy tapping

**MultipleChoice**:
- Vertical stack of option cards (full-width)
- Each option: Glass-morphism card, 56px min height, 1rem padding
- Radio indicator: Hidden, selection shown via background
- Unselected: Slate-700/30 bg with border
- Selected: Primary gradient with checkmark icon
- Spacing: 0.75rem between options
- Support 2-6 options per question

**OverUnder**:
- Three-part layout: OVER button | Number display | UNDER button
- Number: Large (2rem), centered, bold, with stat label below
- Buttons: Equal size (40% each), arrows (▲/▼)
- Selected state: Gradient fill, icon color change

**QuestionCard**:
- Glass-morphism wrapper (backdrop-blur-md)
- Question number badge (top-left, slate-400)
- Question text: Bold, 1.125rem, mb-4
- Component slot for answer options
- Selection indicator: Green dot (bottom-right) when answered
- Padding: 1.5rem, rounded-2xl
- Shadow: Subtle elevation

**CategoryHeader**:
- Full-width divider
- Icon (emoji) + Category name (bold, tracking-wide)
- Underline gradient (fade left to right)
- Sticky position on scroll (optional)
- mb-6 spacing

**Testing:**
- Create dev page `/components-test` showing all component types
- Test all question types with sample data
- Verify tap interactions on mobile (375px viewport)
- Test rapid tapping doesn't cause double-selection
- Verify selected states are visually distinct (high contrast)
- Test animations are smooth (no jank)
- Verify accessibility (ARIA labels, keyboard navigation)
- Test with different text lengths (long questions, short options)

---

### Step 6: Multi-Page Form Flow
**Files:**
- `app/submit/[name]/page.tsx`
- `components/SubmissionForm.tsx`
- `components/ProgressBar.tsx`
- `components/CategoryPage.tsx`
- `lib/hooks/useFormState.ts`
- `lib/hooks/useSwipeNavigation.ts`

**What:**
Create polished multi-page form experience following design spec:

**Progress Bar Component** (Sticky top):
- Personalized greeting: "Hi {Name}! 👋"
- Dot indicators: 7 dots representing categories
- Filled dots: Primary gradient, empty dots: Slate-600
- Current dot: Animated pulse (scale + opacity)
- Text label: "Category Name (X/7)"
- Thin progress line: Animated width based on percentage
- Backdrop blur on scroll for depth

**Category Pages**:
- CategoryHeader with emoji + name
- Scrollable question cards (4-5 per category)
- Questions use components from Step 5
- Auto-advance when all answered (optional, 1s delay)
- Local state management with zustand/context
- Smooth slide transitions between pages (framer-motion)

**Bottom Navigation** (Sticky):
- Fixed position with safe area padding
- Shadow gradient above for depth
- Back button: Ghost style (outline), left-aligned, 40% width
- Continue button: Primary gradient, right-aligned, 60% width
- Disabled state: Continue greyed when questions unanswered
- Haptic feedback on tap (navigator.vibrate)
- Icons: ← and → arrows

**Form State Management**:
- Zustand store for all answers
- Auto-save to localStorage (prevent loss)
- Track completion per category
- Navigate with URL params (?category=2)
- Restore state on refresh

**Page Transitions**:
- Slide left/right based on direction
- 300ms duration with ease-out
- No jank on mobile (transform-gpu)

**Testing:**
- Navigate forward through all 7 categories
- Navigate backward preserves answers
- Progress bar updates correctly (dots and percentage)
- URL updates with category param
- Validation prevents skipping unanswered questions
- Local storage persists on refresh
- Swipe gestures work on mobile (optional)
- Test on multiple screen sizes (320px - 768px)
- Test performance (should maintain 60fps)
- Verify no memory leaks in form state

---

### Step 7: Review Screen & Submission
**Files:**
- `app/submit/[name]/review/page.tsx`
- `components/ReviewAccordion.tsx`
- `components/ConfirmationModal.tsx`
- `app/api/submissions/submit/route.ts`
- `lib/actions/submitResponses.ts`

**What:**
Create review and submission flow following design spec:

**Review Screen Layout**:
- Header: "📋 Review Your Picks" with gradient underline
- Accordion by category (7 sections)
- Each section: Collapsed by default, tap to expand
- Category header: Bold with emoji, arrow indicator
- Expanded view: List of questions with answers (Q: A format)
- Compact design: 16px padding, 0.875rem text
- Edit button: Navigate back to specific category
- Completion indicator: "✓ All 30 questions answered" with green checkmark
- Submit button: Extra large (72px height), gradient, animated glow

**Accordion Behavior**:
- Smooth expand/collapse (300ms ease-in-out)
- Height animation (max-height transition)
- Rotate arrow icon (90deg)
- One section open at a time (optional)

**Confirmation Modal**:
- Blur backdrop (fixed overlay)
- Centered card with glass-morphism
- Warning text: "Once submitted, you cannot edit your picks"
- Two buttons: Cancel (ghost) and Confirm (gradient)
- Slide-up animation on open
- Close on backdrop tap

**Submission Flow**:
- Show loading state (spinner in button)
- API call with all 30 responses
- Atomic transaction (all or nothing)
- Error handling: Show toast message, allow retry
- Success: Navigate to success page with animation

**Testing:**
- Verify all 30 answers display correctly in review
- Test accordion expand/collapse animations
- Edit button navigates to correct category
- Confirmation modal appears on Submit tap
- Cancel closes modal without submitting
- Confirm submits data successfully
- Verify all 30 responses saved to database
- Test duplicate submission prevention
- Test error states (network failure, timeout)
- Verify loading states show correctly
- Test on slow 3G connection
- Test duplicate submission prevention (should show error)
- Verify participant marked as completed on home page
- Test network error handling (poor connection simulation)

---

### Step 8: Success Page with Confetti
**Files:**
- `app/submit/[name]/success/page.tsx`
- `components/ConfettiAnimation.tsx`
- `components/SubmissionStats.tsx`

**What:**
Create celebratory success page following design spec:

**Success Screen**:
- Confetti animation: Canvas-based, 3 seconds duration, colorful particles
- Large animated checkmark: SVG with draw animation (1s)
- Success message: "✓ PICKS LOCKED IN!" (bold, 2rem)
- Personalized text: "Great choices, {Name}!"
- Stats card: Glass-morphism card with 3 metrics
  - ✅ Questions answered: 30/30
  - ⏰ Submission time: Feb 4 @ 2:30pm
  - 🎯 Family progress: X/8 completed
- View Results button: Large, disabled with lock icon until all 8 submit
- Back to Home button: Secondary, below results button

**Animation Sequence**:
1. Confetti starts immediately (3s)
2. Checkmark draws in (1s delay, 1s duration)
3. Text fades in (staggered, 200ms between elements)
4. Stats card slides up (300ms)

**Testing:**
- Verify confetti renders smoothly on mobile
- Check animation sequence timing
- Test disabled state of View Results button
- Verify stats show correct data (time, count)
- Test navigation to home page
- Test on low-end mobile devices (performance)

---

### Step 9: Results Page - View All Picks
**Files:**
- `app/results/page.tsx`
- `components/ResultsLocked.tsx`
- `components/ResultsGrid.tsx`
- `components/ComparisonTable.tsx`
- `components/CategoryFilter.tsx`
- `app/api/results/picks/route.ts`
- `lib/resultsUtils.ts`

**What:**
Create results page with two states following design spec:

**Locked State** (< 8 submissions):
- Center-aligned card with lock icon 🔒
- Header: "Results Locked"
- Waiting list: Names of people who haven't submitted
- Count: "X people left to submit"
- Auto-refresh: Poll API every 30s, subtle loading indicator
- Check Again button: Manual refresh option

**Unlocked State** (all 8 submitted):
- Header: "🎯 Everyone's Picks"
- Category filter chips: Horizontal scroll, pill-shaped, toggle selection
- Comparison table: Horizontal scrolling grid
  - Sticky first column (question text)
  - 8 participant columns with abbreviated names
  - Compact cells showing answers
  - Color coding:
    - Majority picks (5+ same answer): Green background (#10b981/20)
    - Unique picks (only one): Amber background (#f59e0b/20)
    - Tied picks (2-4 same): Purple background (#8b5cf6/20)
- Snap scrolling: Columns snap on mobile
- Export PDF button: Bottom action (stretch goal)

**Table Design Details**:
- Header row: Sticky, participant avatars (emoji) + names
- Question rows: Alternating subtle background (slate-800/slate-750)
- Cell padding: 0.5rem, text-center
- Mobile optimization: Horizontal scroll with momentum
- Abbreviations: "Grand-Dad" → "GD", "Grammie" → "Gr", etc.

**Testing:**
- Verify locked state shows when < 8 submissions
- Test auto-refresh updates count without page reload
- Test with 0, 4, 7, and 8 submissions
- Ensure all 240 responses display correctly (30q × 8p)
- Test horizontal scrolling on mobile (smooth, no jank)
- Verify color coding logic (majority/unique/tied)
- Test category filtering (shows/hides correct questions)
- Verify sticky columns work on mobile
- Test snap scrolling behavior
- Test performance with full dataset
- Test on various screen widths (320px - 768px)

---

### Step 10: Admin Panel - Input Results & Scoring
**Files:**
- `app/admin/page.tsx`
- `app/admin/layout.tsx`
- `components/admin/PasswordGate.tsx`
- `components/admin/TabNavigation.tsx`
- `components/admin/ResultEntry.tsx`
- `components/admin/Leaderboard.tsx`
- `components/admin/ParticipantDetails.tsx`
- `app/api/admin/auth/route.ts`
- `app/api/admin/save-results/route.ts`
- `app/api/admin/calculate-scores/route.ts`
- `lib/scoring.ts`

**What:**
Create admin panel with modern UI following design spec:

**Password Gate**:
- Centered card with glass-morphism
- 🔐 Lock icon header
- Large password input (text-center, letter-spacing)
- Show/hide toggle (eye icon)
- Enter button: Gradient, full-width
- Error state: Red shake animation on wrong password
- Session storage: Keep logged in for session

**Admin Layout** (after auth):
- Header: "⚙️ Admin Panel"
- Tab navigation: 3 tabs (Enter Results, Calculate Scores, Leaderboard)
- Active tab: Underline gradient animation
- Tab content: Smooth fade transition

**Enter Results Tab**:
- Accordion by category (same as review screen)
- Each question: Show question text + same answer component from form
- Pre-fill with first saved result (if exists)
- Save button per question: Green checkmark on save
- Progress indicator: Circular ring showing X/30 completed
- "Save All" button at bottom

**Calculate Scores Tab**:
- Only enabled when all 30 results entered
- Show progress: "30/30 results entered ✓"
- Calculate button: Large, gradient, with loading spinner
- Algorithm display: Simple explanation of scoring (1 point per correct)
- Results preview: Show calculated scores before saving
- Confirm button: Save scores to database

**Leaderboard Tab**:
- Podium view for top 3: Gradient cards (gold/silver/bronze)
- Medal icons: 🥇 🥈 🥉
- Scores: Large (2rem), bold
- Percentage: (X/30 - YY%)
- Full list below: Ranked 4-8 with regular styling
- Expandable details per person:
  - Accordion showing all 30 questions
  - Checkmarks for correct ✓ (green)
  - X marks for incorrect ✗ (red)
  - Question text + their answer + correct answer
- Share Results button: Copy link to results page

**Design Details**:
- All components follow dark theme + glass-morphism
- Animations: Smooth transitions, no jank
- Loading states: Skeleton loaders + spinners
- Error handling: Toast notifications
- Mobile responsive: Works on tablet/desktop

**Testing:**
- Test password protection (wrong password rejected, correct accepted)
- Test session persistence (refresh keeps logged in)
- Enter all 30 actual results, verify saves
- Test partial save (some results entered)
- Verify Calculate button disabled until all results entered
- Run scoring calculation, verify math is correct
- Check leaderboard displays correct rankings
- Test tie scenarios (same score, alphabetical order)
- Verify detailed breakdown shows correct/incorrect per person
- Test expandable accordions in details view
- Test all transitions and animations
- Test on mobile, tablet, and desktop viewports
- Verify API error handling (network failures)
- Scoring logic: 1 point per correct answer
- Leaderboard showing final scores sorted by rank
- Highlight tied participants
- Show detailed breakdown (which questions each person got right/wrong)

**Testing:**
- Test password protection (wrong password rejected)
- Enter all 30 actual results
- Verify results saved to database
- Run scoring calculation
- Check leaderboard displays correct scores
- Test tie-breaking display
- Verify detailed breakdown shows correct/incorrect answers per person
- Test mobile responsiveness of admin panel

---

### Step 11: Polish, Performance & Azure Deployment
**Files:**
- `app/layout.tsx` (metadata, fonts, OG tags)
- `app/manifest.json` (PWA manifest)
- `public/favicon.ico`
- `public/og-image.png`
- `public/apple-touch-icon.png`
- `README.md`
- `azure-static-web-apps-config.json` (routing, headers)
- `.github/workflows/azure-static-web-apps.yml` (CI/CD)
- Various CSS/performance tweaks

**What:**
Final polish, optimization, and Azure deployment:

**Performance Optimizations**:
- Image optimization: Use Next.js Image component for all images
- Font optimization: Preload Inter font, font-display: swap
- Code splitting: Lazy load admin panel and results page
- Minify CSS/JS: Verify production build is optimized
- Remove console.logs: Clean up all debug code
- Lighthouse audit: Target 90+ mobile performance score

**Loading & Error States**:
- Global error boundary: Catch and display errors gracefully
- Loading skeletons: For all data-fetching screens
- Offline detection: Show banner when no connection
- Toast notifications: For success/error feedback (react-hot-toast)
- Retry mechanisms: For failed API calls

**SEO & Sharing**:
- Meta tags: Title, description, OG tags for social sharing
- Favicon: Multiple sizes (16x16, 32x32, 180x180)
- OG image: Custom 1200x630 image for link previews
- PWA manifest: Make installable on mobile
- Robots.txt: Allow indexing (or disallow if private)

**Azure Deployment Setup**:
- Create Azure Static Web App resource in Azure Portal
- Configure custom domain: propbets.theonlysandman.ca
- SSL certificate: Auto-provisioned by Azure
- Azure config file: Define routing rules, headers, redirects
- GitHub Actions workflow: Auto-deploy on push to main branch
- Environment variables: Set Supabase keys in Azure portal
- Production build: Test `npm run build` locally first

**Azure Configuration Details**:
```json
{
  "routes": [
    {
      "route": "/api/*",
      "methods": ["GET", "POST"],
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/admin/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html"
    }
  },
  "globalHeaders": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff"
  }
}
```

**CI/CD Pipeline**:
- GitHub Actions: Trigger on push to main
- Build steps: Install deps → Build Next.js → Deploy to Azure
- Environment secrets: Store in GitHub repo settings
- Deploy preview: Test on staging URL before custom domain

**Testing Checklist**:
- Complete end-to-end flow: Landing → Select name → All 30 questions → Submit → Success
- Test with all 8 participants (simulate 8 devices)
- Verify results page locks until all 8 submit
- Test admin panel: Enter results → Calculate scores → View leaderboard
- Cross-browser testing: Chrome, Safari, Firefox, Edge
- Mobile device testing: iPhone (Safari), Android (Chrome)
- Performance testing: Lighthouse audit on mobile and desktop
- Load testing: Multiple simultaneous users
- Network testing: Slow 3G, offline, flaky connection
- Error testing: Wrong API responses, database errors
- Security testing: SQL injection attempts, XSS attempts
- Accessibility testing: Keyboard navigation, screen reader

**Pre-Launch Checklist**:
- ✅ All 8 participants can submit successfully
- ✅ Results page shows correct comparison
- ✅ Admin panel calculates scores accurately
- ✅ Mobile UI is smooth and responsive
- ✅ No console errors or warnings
- ✅ Custom domain works: propbets.theonlysandman.ca
- ✅ SSL certificate active
- ✅ Family test run completed successfully
- ✅ Backup database export taken
- ✅ Admin password set and tested

**Documentation**:
- README.md: Setup instructions, architecture overview
- Add instructions for updating questions before game
- Document admin panel usage
- Add troubleshooting section
- Include Supabase schema for reference

**Testing:**
- Run full end-to-end test 3 times (different browsers)
- Test on 3+ real mobile devices (iPhone, Android, tablet)
- Verify Azure deployment works (custom domain, SSL)
- Test production build performance (Lighthouse > 90)
- Verify all API routes work in production
- Test concurrent submissions (8 devices at once)
- Verify database can handle load
- Test admin panel in production
- Verify error boundaries catch errors
- Test offline behavior
- Share staging link with family for dry run

---

## Timeline Breakdown (4 days: Feb 4-8, 2026)

**Day 1 (Feb 4 - Today)**: Steps 1-3
- Morning: Project setup, Tailwind config, Azure Static Web Apps setup
- Afternoon: Database schema, seed 30 questions

**Day 2 (Feb 5)**: Steps 4-6
- Morning: Landing page with glass-morphism, participant selector
- Afternoon: Question components library, form flow with animations

**Day 3 (Feb 6)**: Steps 7-10
- Morning: Review screen, submission flow, success page with confetti
- Afternoon: Results page with comparison grid, admin panel

**Day 4 (Feb 7)**: Step 11
- Morning: Polish UI, performance optimization, testing
- Afternoon: Azure deployment, custom domain setup, family dry run

**Game Day (Feb 8)**: 
- Morning: Final checks, monitor submissions
- Game time: Admin enters results as they happen
- Post-game: Calculate scores, reveal leaderboard, celebrate! 🎉

---

## Post-Game Enhancements (Optional Future Work)

- Edit questions before game (admin UI with richer editor)
- Manual question overrides (update halftime questions once teams known)
- Historical data (save results for next year, year-over-year comparison)
- Enhanced PWA (offline support, push notifications)
- Reminder system (automated texts/emails before deadline)
- Multi-group support (different families/friend groups, private rooms)
- Betting with fake currency (points, side bets)
- Live scoring during game (real-time updates)
- Question builder interface (create custom prop bet sets)
- Social features (comments, reactions, trash talk)
- Analytics dashboard (most picked answers, hardest questions)

---

## Risk Mitigation

**Risk 1: Timeline is tight (4 days)**
- Mitigation: Use modern stack with excellent DX (Next.js, Tailwind), pre-built Radix UI components, focus on core features only, skip nice-to-haves like PDF export

**Risk 2: Azure deployment complexity**
- Mitigation: Azure Static Web Apps is designed for Next.js, has excellent GitHub Actions integration, fallback to Vercel if issues arise (5 min setup)

**Risk 3: Database setup complexity**
- Mitigation: Supabase has excellent docs and CLI tools, schema is simple (5 tables), can fall back to localStorage for initial testing

**Risk 4: Mobile testing on real devices**
- Mitigation: Use Chrome DevTools mobile emulation during development, test on at least 3 real devices (iPhone, Android, tablet) before game day

**Risk 5: Family members forget to submit**
- Mitigation: Add prominent countdown timer on homepage, send manual reminder texts on Feb 7 evening, make submission process under 10 minutes

**Risk 6: Server/database issues on game day**
- Mitigation: Deploy early (Feb 7 morning), load test with concurrent users, Azure and Supabase have excellent uptime, add error boundaries and retry logic

**Risk 7: Animations causing performance issues on low-end devices**
- Mitigation: Use CSS transforms (GPU-accelerated), test on older iPhone, add reduce-motion media query respect, disable non-essential animations on low-end devices

---

## Success Criteria

✅ **User Experience**: All 8 family members can submit picks on mobile in < 10 minutes each
✅ **Privacy**: Picks are hidden until all 8 people submit (no cheating)
✅ **Comparison**: Results page shows all picks in clean, easy-to-read comparison grid
✅ **Scoring**: Admin can enter actual results and calculate scores automatically
✅ **Reliability**: Zero major bugs or crashes during game day
✅ **Performance**: Mobile experience is smooth (60fps animations, < 3s page loads)
✅ **Design**: Modern, sleek UI that impresses the family
✅ **Deployment**: Live at propbets.theonlysandman.ca by Feb 7 evening with SSL
✅ **Testing**: Successful family dry run completed by Feb 7
✅ **Fun Factor**: Non-football fans enjoy the questions and UI experience

---

## Technical Stack Summary

**Frontend**:
- Next.js 14 (App Router) - React framework
- TypeScript - Type safety
- Tailwind CSS - Utility-first styling
- Framer Motion - Smooth animations
- Radix UI - Accessible components
- React Hot Toast - Notifications

**Backend**:
- Next.js API Routes - Serverless functions
- Supabase - PostgreSQL database + real-time
- Supabase Auth (optional, using password gate for admin)

**Deployment**:
- Azure Static Web Apps - Hosting + CDN
- GitHub Actions - CI/CD pipeline
- Custom domain: propbets.theonlysandman.ca
- SSL via Azure (auto-provisioned)

**Development Tools**:
- ESLint + Prettier - Code quality
- TypeScript strict mode - Type checking
- Chrome DevTools - Mobile testing
- Lighthouse - Performance audits

---

## Key Files & Structure

```
propbets/
├── app/
│   ├── layout.tsx (global layout, metadata)
│   ├── page.tsx (landing page - participant selector)
│   ├── submit/[name]/
│   │   ├── page.tsx (multi-page form)
│   │   ├── review/page.tsx (review before submit)
│   │   └── success/page.tsx (confetti celebration)
│   ├── results/page.tsx (comparison grid)
│   ├── admin/
│   │   └── page.tsx (password gate + tabs)
│   └── api/
│       ├── submissions/
│       │   ├── check/route.ts
│       │   └── submit/route.ts
│       ├── results/picks/route.ts
│       └── admin/
│           ├── auth/route.ts
│           ├── save-results/route.ts
│           └── calculate-scores/route.ts
├── components/
│   ├── ui/ (buttons, cards, shared primitives)
│   ├── questions/ (YesNo, MultipleChoice, OverUnder)
│   ├── admin/ (result entry, leaderboard)
│   └── animations/ (confetti, transitions)
├── lib/
│   ├── supabase.ts (client config)
│   ├── types.ts (TypeScript definitions)
│   ├── scoring.ts (calculation logic)
│   └── hooks/ (custom React hooks)
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_seed_questions.sql
├── public/ (favicon, og-image, etc.)
├── azure-static-web-apps-config.json
├── .github/workflows/azure-static-web-apps.yml
└── README.md
```

