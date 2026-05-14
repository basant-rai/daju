export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Member {
  id: string
  org_id: string
  name: string
  phone: string
  plan: '1-Month' | '3-Month' | '6-Month'
  expiry_date: string
  token: string
  is_active: boolean
  created_at: string
}

export interface Checkin {
  id: string
  member_id: string
  org_id: string
  checked_in_at: string
  date: string
  member?: Member
}

export interface MemberWithStats extends Member {
  checkins?: Checkin[]
  total_checkins?: number
  last_checkin?: string | null
  checked_in_today?: boolean
}

export type MemberStatus = 'active' | 'expiring' | 'expired'

export interface DailyStats {
  date: string
  checkin_count: number
  members: string[]
}
