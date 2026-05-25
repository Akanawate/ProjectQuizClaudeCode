# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Quiz web interativo "Você Entende o Claude Code?" — perguntas Verdadeiro/Falso sobre Claude Code, em PT-BR. Stack: React 18 + TypeScript + Tailwind CSS v3 + Vite. Backend: Supabase (PostgreSQL) para scores e ranking público.

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server with HMR
npm run build     # production build (runs tsc first)
npm run preview   # preview production build locally
npm run typecheck # type-check without emitting
```

## Environment Variables

Copy `.env.example` to `.env.local` (never commit `.env.local`):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## Architecture

### Data flow

Questions live in `src/data/questions.json` (local, versioned). Each session draws 10 random questions from the chosen level via Fisher-Yates shuffle in `useQuiz`. Answers are held in memory only — no mid-session persistence. On quiz completion, the score is written to Supabase via `useRanking`.

### State management

No global state library. Two custom hooks own all logic:
- `useQuiz` — shuffling, answer tracking, score computation
- `useRanking` — Supabase fetch (top 10 by level) and score insert

### Screen flow

`App.tsx` drives a single-page state machine: `home → quiz → result → ranking`. No router; screen is a discriminated union prop passed down.

### Question format

```json
{
  "id": "adv-001",
  "level": "beginner" | "intermediate" | "advanced",
  "statement": "...",
  "answer": true | false,
  "explanation": "...",
  "tags": ["string"]
}
```

### Supabase schema

```sql
CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  score INTEGER NOT NULL,
  total INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_scores_level_score ON scores(level, score DESC, created_at ASC);
-- RLS: public read + insert, no auth in MVP
```

### Design system

Dark-only UI with Anthropic palette. Key tokens (add to `tailwind.config.ts`):

| Token | Value |
|---|---|
| background | `#0F0F0F` |
| surface (cards) | `#1A1A1A` |
| border | `#2A2A2A` |
| primary | `#E87040` |
| primary-hover | `#F08050` |
| text | `#F5F5F5` |
| muted | `#888888` |
| success | `#4CAF50` |
| error | `#EF5350` |

Font: Inter (Google Fonts). Tailwind default size scale.

### Keyboard accessibility

In `QuizScreen`, bind `V` → Verdadeiro and `F` → Falso. All interactive elements need `aria-label`.

## Key constraints

- **No feedback during quiz** — correct answer + explanation only shown on `ResultScreen` after all 10 questions.
- **No authentication in MVP** — ranking uses plain nickname text.
- **Questions are static** — `questions.json` is the source of truth; no CMS or admin UI in MVP.
- Timer per question is **v2 only** — `time_ms` field is reserved in the `Score` type but not used in v1 scoring.
