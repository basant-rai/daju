# Presenz — Attendance Tracking System

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

---

## 2. Database Setup

Run the following SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New query):

```sql
-- Organizations table (one row per gym/school/office)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Members table
create table members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  phone text not null,
  plan text not null default '1-Month',
  expiry_date date not null,
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Check-ins table
create table checkins (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade not null,
  org_id uuid references organizations(id) on delete cascade not null,
  checked_in_at timestamptz default now(),
  date date default current_date
);

-- Prevent duplicate check-ins on the same day
create unique index checkins_member_date_unique on checkins(member_id, date);

-- Row Level Security
alter table organizations enable row level security;
alter table members enable row level security;
alter table checkins enable row level security;

-- Policy: anyone can read org by slug (for check-in page)
create policy "Public can read orgs" on organizations for select using (true);

-- Policy: anyone can read members by token (for check-in page)
create policy "Public can read members by token" on members for select using (true);

-- Policy: anyone can insert checkins (member self check-in)
create policy "Public can insert checkins" on checkins for insert with check (true);

-- Policy: anyone can read checkins (admin dashboard)
create policy "Public can read checkins" on checkins for select using (true);

-- Policy: admin can do everything on members and checkins
-- (In production, replace `true` with an auth check)
create policy "Admin full access members" on members for all using (true);
create policy "Admin full access checkins" on checkins for all using (true);
create policy "Admin full access orgs" on organizations for all using (true);
```

### Seed a demo organization

```sql
insert into organizations (name, slug) values ('My Gym', 'my-gym');
```

Copy the `id` from the result — you'll use it as `ORG_ID` in your admin pages or set it in env:

```env
NEXT_PUBLIC_ORG_ID=paste-your-org-uuid-here
```

---

## 3. Run the App

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

## 5. Deployment (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all env variables from `.env.local`
4. Deploy — it works on the free tier

---

## 6. Share Check-in Links

Each member gets a unique URL:
```
https://yourapp.vercel.app/checkin/[member-token]
```

Send this via WhatsApp. The member bookmarks it or stars the message. One tap = checked in.
