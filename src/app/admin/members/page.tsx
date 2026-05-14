import { createServerSupabaseClient } from '@/lib/supabase-server'
import MembersClient from './members-client'

const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID!

async function getMembers() {
  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: members } = await supabase
    .from('members')
    .select('*, checkins(id, date)')
    .eq('org_id', ORG_ID)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (members ?? []).map((m) => ({
    ...m,
    total_checkins: m.checkins?.length ?? 0,
    checked_in_today: m.checkins?.some((c: any) => c.date === today) ?? false,
  }))
}

export default async function MembersPage() {
  const members = await getMembers()
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <header className="bg-white border-b border-stone-200 px-7 h-14 flex items-center justify-between flex-shrink-0">
        <h1 className="font-semibold text-stone-800">Members</h1>
      </header>
      <MembersClient members={members} />
    </div>
  )
}
