# Daju — The guy every in neighbourhood who is reliable, always there, knows everyone

A lightweight, domain-agnostic attendance tracking system built with Next.js 14, Supabase (PostgreSQL), Tailwind CSS, and Radix UI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth (email/password for admin)
- **UI**: Tailwind CSS + Radix UI primitives
- **Language**: TypeScript

---

## 1. Local Setup

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these from your Supabase project → Settings → API.


## 2. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

- **Admin dashboard**: `/admin`
- **Member check-in**: `/checkin/[token]`

---

## 4. Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # Dashboard (stats + today's check-ins)
│   │   ├── members/
│   │   │   └── page.tsx          # Members list + add/remove
│   │   └── attendance/
│   │       └── page.tsx          # Attendance log by date
│   ├── checkin/
│   │   └── [token]/
│   │       └── page.tsx          # Member self check-in page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Radix UI wrappers
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── input.tsx
│   ├── admin-sidebar.tsx
│   ├── member-table.tsx
│   ├── add-member-dialog.tsx
│   ├── stats-cards.tsx
│   └── checkin-card.tsx
├── lib/
│   ├── supabase.ts               # Supabase client (browser + server)
│   ├── supabase-server.ts        # Server-side client
│   └── utils.ts                  # cn(), date helpers
└── types/
    └── index.ts                  # Shared TypeScript types
```

---

## 3. Deployment (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all env variables from `.env.local`
4. Deploy — it works on the free tier

---

## 4. Share Check-in Links

Each member gets a unique URL:
```
https://yourapp.vercel.app/checkin/[member-token]
```

Send this via WhatsApp. The member bookmarks it or stars the message. One tap = checked in.
