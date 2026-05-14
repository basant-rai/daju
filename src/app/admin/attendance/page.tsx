import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatDate, formatTime, getInitials, getAvatarColor } from '@/lib/utils'
import { CalendarCheck } from 'lucide-react'

const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID!

async function getAttendance() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('checkins')
    .select('*, member:members(name, plan, expiry_date)')
    .eq('org_id', ORG_ID)
    .order('checked_in_at', { ascending: false })
    .limit(200)
  return data ?? []
}

export default async function AttendancePage() {
  const checkins = await getAttendance()

  // Group by date
  const grouped = checkins.reduce((acc: Record<string, any[]>, c) => {
    acc[c.date] = acc[c.date] ?? []
    acc[c.date].push(c)
    return acc
  }, {})

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <header className="bg-white border-b border-stone-200 px-7 h-14 flex items-center justify-between flex-shrink-0">
        <h1 className="font-semibold text-stone-800">Attendance Log</h1>
        <span className="text-xs text-stone-400">Last 200 check-ins</span>
      </header>

      <div className="flex-1 p-7 space-y-6">
        {dates.length === 0 && (
          <div className="py-20 text-center text-stone-400">
            <CalendarCheck size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No attendance records yet</p>
          </div>
        )}

        {dates.map((date) => (
          <div key={date} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h2 className="font-semibold text-sm text-stone-700">{formatDate(date)}</h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                {grouped[date].length} check-in{grouped[date].length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="divide-y divide-stone-50">
              {grouped[date].map((c: any) => {
                const name = c.member?.name ?? 'Unknown'
                const color = getAvatarColor(name)
                return (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                    <div className={`w-8 h-8 rounded-full ${color.bg} ${color.text} flex items-center justify-center text-xs font-semibold flex-shrink-0`}>
                      {getInitials(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800">{name}</p>
                      <p className="text-xs text-stone-400">{c.member?.plan}</p>
                    </div>
                    <span className="text-xs text-stone-400">
                      {formatTime(c.checked_in_at)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
