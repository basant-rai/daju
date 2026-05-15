'use server'

import { revalidatePath } from 'next/cache'
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

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

export async function registerOrg(formData: {
  businessName: string
  ownerName: string
  phone: string
  email: string
  password: string
}) {
  const supabase = createAdminSupabaseClient()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
  })
  if (authError) throw new Error(authError.message)

  // 2. Create organization row
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name: formData.businessName, slug: formData.businessName.toLowerCase().replace(/\s+/g, '-') })
    .select()
    .single()
  if (orgError) throw new Error(orgError.message)

  // 3. Link user to org (add a profiles table for this)
  await supabase.from('profiles').insert({
    id: authData.user.id,
    org_id: org.id,
    name: formData.ownerName,
    phone: formData.phone,
  })

  redirect('/admin')
}


export async function loginAdmin(formData: {
  email: string
  password: string
}) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })
  if (error) throw new Error(error.message)
  redirect('/admin')
}