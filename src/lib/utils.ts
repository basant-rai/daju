import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, format, isToday, parseISO } from 'date-fns'
import type { MemberStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMemberStatus(expiryDate: string): MemberStatus {
  const days = differenceInDays(parseISO(expiryDate), new Date())
  if (days < 0) return 'expired'
  if (days <= 7) return 'expiring'
  return 'active'
}

export function daysLeft(expiryDate: string): number {
  return differenceInDays(parseISO(expiryDate), new Date())
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'd MMM yyyy')
}

export function formatTime(date: string): string {
  return format(new Date(date), 'h:mm a')
}

export function isTodayDate(date: string): boolean {
  return isToday(parseISO(date))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getPlanDays(plan: string): number {
  if (plan === '1-Month') return 30
  if (plan === '3-Month') return 90
  if (plan === '6-Month') return 180
  return 30
}

export function getExpiryPercent(expiryDate: string, plan: string): number {
  const total = getPlanDays(plan)
  const left = Math.max(0, daysLeft(expiryDate))
  return Math.round((left / total) * 100)
}

const AVATAR_COLORS = [
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700' },
]

export function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}
