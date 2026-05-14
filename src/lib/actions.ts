'use server'

import { revalidatePath } from 'next/cache'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID!

// ── Members ──────────────────────────────────────────────

export async function addMember(formData: {
  name: string
  phone: string
  plan: string
  expiry_date: string
}) {
  const supabase = createAdminSupabaseClient()
  const { error } = await supabase.from('members').insert({
    org_id: ORG_ID,
    name: formData.name,
    phone: formData.phone,
    plan: formData.plan,
    expiry_date: formData.expiry_date,
    is_active: true,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/admin/members')
}

export async function removeMember(memberId: string) {
  const supabase = createAdminSupabaseClient()
  const { error } = await supabase
    .from('members')
    .update({ is_active: false })
    .eq('id', memberId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/admin/members')
}

export async function deleteMember(memberId: string) {
  const supabase = createAdminSupabaseClient()
  const { error } = await supabase.from('members').delete().eq('id', memberId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/admin/members')
}

// ── Check-ins ─────────────────────────────────────────────

export async function checkInMember(memberId: string) {
  const supabase = createAdminSupabaseClient()
  const today = new Date().toISOString().split('T')[0]

  // Upsert: safe to call multiple times on the same day
  const { error } = await supabase.from('checkins').upsert(
    {
      member_id: memberId,
      org_id: ORG_ID,
      date: today,
      checked_in_at: new Date().toISOString(),
    },
    { onConflict: 'member_id,date' }
  )

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath(`/checkin`)
  return { success: true }
}
