# CourseBuddy 📚

AI-powered course planning for UBC students. 🗓️
Try it out yourself: coursebuddyubc.ca

## Overview

CourseBuddy helps you build smart, clean class schedules using:
- drag-and-drop timelines
- AI suggestions
- integrated course insights (where available)

It’s a working prototype focused on making scheduling faster and less painful.

## How it was built

The initial version was scaffolded with an AI tool (Lovable).  
From there I:
- fixed bugs and wiring issues
- customized UI and logic
- integrated auth, schedule flows, AI, and Supabase

I’m still learning this stack, but I can walk through the main architecture and features.

## Features

- 🧠 AI helper for schedule suggestions (e.g. no 8am, fewer gaps, specific days)
- 🗓️ Drag-and-drop weekly schedule builder
- 📊 Basic course stats and insights (where available)
- 🧵 Prerequisite and pathway planning views
- 🔐 Auth + saved personal schedules via Supabase

## Full Tech Stack

**Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Flow
- @dnd-kit

**Backend / Infra**
- Supabase
  - PostgreSQL
  - Row Level Security (RLS)
  - Auth
  - Edge Functions
  - Realtime

**AI**
- Gemini 2.5 Flash through Lovable Cloud for schedule suggestions and conversational support

## Getting Started

Requirements:
- Node.js 18+
- npm
- Supabase project + keys

Install & run:

    git clone <YOUR_GIT_URL>
    cd coursebuddy
    npm install

Create `.env`:

    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
    VITE_SUPABASE_PROJECT_ID=your_project_id

Start dev server:

    npm run dev

Then open the URL shown in your terminal (commonly `http://localhost:5173`).

## Status

- Prototype 🚧
- Some data and features are incomplete
- Always confirm final schedules with official university systems

## Author

Built by Edward Jung ❤️  
Still learning, improving, and open to feedback.
