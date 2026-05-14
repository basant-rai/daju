'use client'

import { useState, useTransition } from 'react'
import { checkInMember } from '@/lib/actions'
import { CheckCircle, Fingerprint, AlertCircle } from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface Props {
  memberId: string
  checkedInToday: boolean
  checkinTime: string | null
  isExpired: boolean
}

export default function CheckInButton({
  memberId,
  checkedInToday,
  checkinTime,
  isExpired,
}: Props) {
  const [done, setDone] = useState(checkedInToday)
  const [time, setTime] = useState(checkinTime)
  const [isPending, startTransition] = useTransition()

  if (isExpired) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-700">Membership expired</p>
          <p className="text-xs text-red-500 mt-0.5">Please renew to continue checking in</p>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center py-4 space-y-2">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={30} className="text-emerald-500" />
        </div>
        <div>
          <p className="font-semibold text-stone-800">You&apos;re checked in!</p>
          {time && (
            <p className="text-sm text-stone-400 mt-1">
              {formatTime(time)} ·{' '}
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
              })}
            </p>
          )}
        </div>
      </div>
    )
  }

  function handleCheckIn() {
    startTransition(async () => {
      await checkInMember(memberId)
      setDone(true)
      setTime(new Date().toISOString())
    })
  }

  return (
    <button
      onClick={handleCheckIn}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
    >
      <Fingerprint size={18} />
      {isPending ? 'Checking in...' : 'Check In Now'}
    </button>
  )
}
