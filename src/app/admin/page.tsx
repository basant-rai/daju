import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getMemberStatus, formatTime, getInitials, getAvatarColor, formatDate } from '@/lib/utils'
import { CheckCircle, Users, AlertTriangle, TrendingUp, Clock } from 'lucide-react'

const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID!

async function getDashboardData() {
  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: members }, { data: todayCheckins }, { data: expiringMembers }] =
    await Promise.all([
      supabase
        .from('members')
        .select('*')
        .eq('org_id', ORG_ID)
        .eq('is_active', true),
      supabase
        .from('checkins')
        .select('*, member:members(name, plan, expiry_date)')
        .eq('org_id', ORG_ID)
        .eq('date', today)
        .order('checked_in_at', { ascending: false }),
      supabase
        .from('members')
        .select('*')
        .eq('org_id', ORG_ID)
        .eq('is_active', true)
        .lte('expiry_date', new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0])
        .gte('expiry_date', today),
    ])

  const activeCount = members?.filter((m) => getMemberStatus(m.expiry_date) === 'active').length ?? 0
  const activeRate = members?.length ? Math.round((activeCount / members.length) * 100) : 0

  return {
    totalMembers: members?.length ?? 0,
    todayCheckins: todayCheckins ?? [],
    expiringCount: expiringMembers?.length ?? 0,
    activeRate,
    members: members ?? [],
  }
}

export default async function AdminDashboard() {
  const { totalMembers, todayCheckins, expiringCount, activeRate } = await getDashboardData()

  const stats = [
    {
      label: 'Total Members',
      value: totalMembers,
      sub: 'Registered',
      icon: Users,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: "Today's Check-ins",
      value: todayCheckins.length,
      sub: `of ${totalMembers} members`,
      icon: CheckCircle,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Expiring Soon',
      value: expiringCount,
      sub: 'Within 7 days',
      icon: AlertTriangle,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Active Rate',
      value: `${activeRate}%`,
      sub: 'Valid memberships',
      icon: TrendingUp,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {/* Topbar */}
      <header className="bg-white border-b border-stone-200 px-7 h-14 flex items-center justify-between flex-shrink-0">
        <h1 className="font-semibold text-stone-800">Dashboard</h1>
        <span className="text-sm text-stone-400">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </span>
      </header>

      <div className="flex-1 p-4 lg:p-7 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-stone-200 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wide font-medium">
                    {label}
                  </p>
                  <p className="text-3xl font-semibold text-stone-900 mt-2 leading-none">
                    {value}
                  </p>
                  <p className="text-xs text-stone-400 mt-1.5">{sub}</p>
                </div>
                <div className={`${iconBg} ${iconColor} w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's check-ins */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-stone-800 text-sm">
              Today&apos;s Check-ins
            </h2>
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Clock size={12} />
              Live
            </span>
          </div>

          {todayCheckins.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <CheckCircle size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No check-ins yet today</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {todayCheckins.map((checkin: any) => {
                const name = checkin.member?.name ?? 'Unknown'
                const color = getAvatarColor(name)
                return (
                  <div key={checkin.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div
                      className={`w-8 h-8 rounded-full ${color.bg} ${color.text} flex items-center justify-center text-xs font-semibold flex-shrink-0`}
                    >
                      {getInitials(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{name}</p>
                      <p className="text-xs text-stone-400">
                        {checkin.member?.plan} · expires {formatDate(checkin.member?.expiry_date)}
                      </p>
                    </div>
                    <span className="text-xs text-stone-400 flex-shrink-0">
                      {formatTime(checkin.checked_in_at)}
                    </span>
                    <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
