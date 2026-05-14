import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { formatDate, getMemberStatus, getExpiryPercent, daysLeft, getInitials, getAvatarColor } from '@/lib/utils'
import CheckInButton from './checkin-button'

async function getMemberByToken(token: string) {
  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: member } = await supabase
    .from('members')
    .select('*, organization:organizations(name)')
    .eq('token', token)
    .eq('is_active', true)
    .single()

  if (!member) return null

  const { data: todayCheckin } = await supabase
    .from('checkins')
    .select('id, checked_in_at')
    .eq('member_id', member.id)
    .eq('date', today)
    .maybeSingle()

  const { count } = await supabase
    .from('checkins')
    .select('*', { count: 'exact', head: true })
    .eq('member_id', member.id)

  return {
    ...member,
    checked_in_today: !!todayCheckin,
    checkin_time: todayCheckin?.checked_in_at ?? null,
    total_checkins: count ?? 0,
  }
}

export default async function CheckInPage({
  params,
}: {
  params: { token: string }
}) {
  const member = await getMemberByToken(params.token)
  if (!member) notFound()

  const status = getMemberStatus(member.expiry_date)
  const percent = getExpiryPercent(member.expiry_date, member.plan)
  const days = daysLeft(member.expiry_date)
  const color = getAvatarColor(member.name)
  const firstName = member.name.split(' ')[0]

  const progressColor =
    status === 'expired'
      ? 'bg-red-500'
      : status === 'expiring'
      ? 'bg-orange-400'
      : 'bg-emerald-500'

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200">
          {/* Header */}
          <div className="bg-stone-900 px-7 pt-8 pb-7 text-white">
            <p className="font-mono text-emerald-400 text-sm font-medium mb-5">
              presenz.
            </p>
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-11 h-11 rounded-full ${color.bg} ${color.text} flex items-center justify-center font-semibold text-base flex-shrink-0`}>
                {getInitials(member.name)}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Hey, {firstName} 👋
                </h1>
                <p className="text-stone-400 text-xs mt-0.5">
                  {member.organization?.name ?? 'Your Organization'}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-7 py-6 space-y-5">
            {/* Membership card */}
            <div className="bg-stone-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">
                    Membership
                  </p>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">
                    {member.plan} Plan
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : status === 'expiring'
                      ? 'bg-orange-50 text-orange-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {status === 'active' ? 'Active' : status === 'expiring' ? `${days}d left` : 'Expired'}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-stone-400">
                    Expires {formatDate(member.expiry_date)}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">{percent}%</span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${progressColor} rounded-full transition-all`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-stone-400">
                Total visits: <span className="font-medium text-stone-600">{member.total_checkins}</span>
              </p>
            </div>

            {/* Check-in action */}
            <CheckInButton
              memberId={member.id}
              checkedInToday={member.checked_in_today}
              checkinTime={member.checkin_time}
              isExpired={status === 'expired'}
            />
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 mt-4">
          Bookmark this page — it&apos;s your personal check-in key
        </p>
      </div>
    </div>
  )
}
