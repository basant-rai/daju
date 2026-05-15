'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase-server'

import Cookies from "js-cookie"

// ── Register ─────────────────────────────────────────────

export async function registerAction(formData: {
  businessName: string
  ownerName: string
  phone: string
  email: string
  password: string
}): Promise<{ error?: string }> {
  const adminClient = createAdminSupabaseClient()

  // 1. Create the auth user
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true, // skip email verification for MVP
  })
  if (authError) return { error: authError.message }

  // 2. Create the organization
  const slug = formData.businessName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const { data: org, error: orgError } = await adminClient
    .from('organizations')
    .insert({ name: formData.businessName, slug })
    .select()
    .single()

  if (orgError) {
    // Rollback: delete the auth user we just created
    await adminClient.auth.admin.deleteUser(authData.user.id)
    return { error: orgError.message }
  }

  // 3. Create the profile linking user → org
  const { error: profileError } = await adminClient.from('profiles').insert({
    id: authData.user.id,
    org_id: org.id,
    name: formData.ownerName,
    phone: formData.phone,
  })

  if (profileError) {
    await adminClient.auth.admin.deleteUser(authData.user.id)
    return { error: profileError.message }
  }

  // 4. Sign them in immediately after registration
  const browserClient = createServerSupabaseClient()
  const { error: signInError } = await browserClient.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })
  if (signInError) return { error: signInError.message }

  redirect('/admin')
}

// ── Login ─────────────────────────────────────────────────

export async function loginAction(formData: {
  email: string
  password: string
}): Promise<{ error?: string; success?: boolean }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) return { error: error.message }

  return { success: true } // ← just return success, no redirect
}

// ── Logout ────────────────────────────────────────────────

export async function logoutAction() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

// ── Get current org ID (replaces hardcoded env var) ───────

export async function getCurrentOrgId(): Promise<string | null> {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  return profile?.org_id ?? null
}