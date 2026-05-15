'use client'

import { useState, useTransition } from 'react'
import { addMember, deleteMember } from '@/lib/actions'
import {
  getMemberStatus,
  formatDate,
  getInitials,
  getAvatarColor,
  daysLeft,
} from '@/lib/utils'
import {
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Search,
  UserPlus,
  Users,
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700',
  expiring: 'bg-orange-50 text-orange-700',
  expired: 'bg-red-50 text-red-700',
}

const STATUS_LABELS = {
  active: 'Active',
  expiring: 'Expiring',
  expired: 'Expired',
}

export default function MembersClient({ members }: { members: any[] }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    plan: '1-Month',
    expiry_date: '',
  })

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search)
  )

  function handleCopy(token: string) {
    navigator.clipboard.writeText(`${APP_URL}/checkin/${token}`)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  function handleAdd() {
    if (!form.name || !form.phone || !form.expiry_date) return
    startTransition(async () => {
      await addMember(form)
      setForm({ name: '', phone: '', plan: '1-Month', expiry_date: '' })
      setOpen(false)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Remove this member?')) return
    startTransition(async () => {
      await deleteMember(id)
    })
  }

  return (
    <div className="flex-1 p-4 lg:p-7">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
          />
        </div>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
              <Plus size={15} />
              Add Member
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
            <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
                <Dialog.Title className="font-semibold text-stone-800 flex items-center gap-2">
                  <UserPlus size={16} className="text-emerald-600" />
                  Add New Member
                </Dialog.Title>
                <Dialog.Close className="text-stone-400 hover:text-stone-600">✕</Dialog.Close>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Phone</label>
                    <input
                      type="text"
                      placeholder="98XXXXXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Plan</label>
                    <select
                      value={form.plan}
                      onChange={(e) => setForm({ ...form, plan: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 bg-white"
                    >
                      <option>1-Month</option>
                      <option>3-Month</option>
                      <option>6-Month</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Expiry Date</label>
                    <input
                      type="date"
                      value={form.expiry_date}
                      onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-500">
                  A unique check-in link will be auto-generated and can be shared via WhatsApp.
                </div>
              </div>

              <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-2">
                <Dialog.Close className="px-4 py-2 text-sm text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50">
                  Cancel
                </Dialog.Close>
                <button
                  onClick={handleAdd}
                  disabled={isPending}
                  className="px-4 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 font-medium"
                >
                  {isPending ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full hidden md:block">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              {['Member', 'Plan', 'Status', 'Expiry', 'Visits', 'Check-in Link', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map((member) => {
              const status = getMemberStatus(member.expiry_date)
              const color = getAvatarColor(member.name)
              const days = daysLeft(member.expiry_date)
              return (
                <tr key={member.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${color.bg} ${color.text} flex items-center justify-center text-xs font-semibold flex-shrink-0`}>
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-800">{member.name}</p>
                        <p className="text-xs text-stone-400">{member.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-1 rounded-md ">
                      {member.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}>
                      {STATUS_LABELS[status]}
                      {status === 'expiring' && ` · ${days}d`}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-stone-500">
                    {formatDate(member.expiry_date)}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium text-stone-700">
                    {member.total_checkins}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 max-w-[180px]">
                      <span className="text-xs text-stone-400 font-mono truncate">
                        /checkin/{member.token.slice(0, 8)}…
                      </span>
                      <button
                        onClick={() => handleCopy(member.token)}
                        className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 ml-auto"
                        title="Copy link"
                      >
                        {copiedToken === member.token ? (
                          <Check size={13} />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`/checkin/${member.token}`}
                        target="_blank"
                        className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-md"
                        title="Preview check-in page"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                        title="Delete member"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Mobile List: Visible only on small screens */}
        <div className="md:hidden divide-y divide-stone-100">
          {filtered.map((member) => {
            const status = getMemberStatus(member.expiry_date);
            const color = getAvatarColor(member.name);
            const days = daysLeft(member.expiry_date);

            return (
              <div key={member.id} className="p-4 space-y-4 active:bg-stone-50 transition-colors">
                {/* Header: Avatar, Name, and Quick Actions */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${color.bg} ${color.text} flex items-center justify-center text-sm font-bold`}>
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-stone-800">{member.name}</p>
                      <p className="text-xs text-stone-400">{member.phone}</p>
                    </div>
                  </div>

                  {/* Contextual Actions (Top Right) */}
                  <div className="flex gap-1">
                    <a href={`/checkin/${member.token}`} className="p-2 text-stone-400">
                      <ExternalLink size={18} />
                    </a>
                    <button onClick={() => handleDelete(member.id)} className="p-2 text-stone-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Grid Info: Plan, Status, Visits */}
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Plan / Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        {member.plan}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
                        {STATUS_LABELS[status]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Visits / Expiry</p>
                    <p className="text-sm mt-1 font-medium text-stone-700">
                      {member.total_checkins} visits <span className="text-stone-300 mx-1">|</span> {formatDate(member.expiry_date)}
                    </p>
                  </div>
                </div>

                {/* Large Tap Target for Check-in Link */}
                <button
                  onClick={() => handleCopy(member.token)}
                  className="w-full flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 hover:bg-stone-100 active:scale-[0.98] transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase text-stone-400 font-bold">Copy Check-in Link</span>
                    <span className="text-xs font-mono text-stone-600 truncate max-w-[200px]">
                      ...{member.token.slice(-12)}
                    </span>
                  </div>
                  {copiedToken === member.token ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
                      <Check size={14} /> Copied
                    </span>
                  ) : (
                    <Copy size={16} className="text-stone-400" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-14 text-center text-stone-400">
            <Users size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">
              {search ? 'No members match your search' : 'No members yet — add your first one'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
