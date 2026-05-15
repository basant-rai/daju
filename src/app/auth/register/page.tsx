'use client'

import React, { useState, useTransition } from 'react'
import { UserIcon, BuildingIcon, PhoneIcon, CheckCircle2Icon, MailIcon, LockIcon, AlertCircleIcon } from 'lucide-react'
import { registerAction } from '@/lib/auth-action'

const RegisterPage = () => {
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    console.log(form)

    startTransition(async () => {
      const result = await registerAction(form)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-[#FDFCF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center px-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-blue-100">
            D
          </div>
        </div>
        <h2 className="text-4xl font-extrabold text-blue-950">
          Get Started with <span className="text-blue-700">Daju</span>
        </h2>
        <p className="mt-3 text-lg text-slate-600 leading-relaxed">
          Set up your digital key system in less than 2 minutes.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl shadow-blue-900/5 rounded-3xl border border-slate-100 sm:px-10 relative overflow-hidden">
          {/* Warm decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16" />

          <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
                <AlertCircleIcon size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Business Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Business Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <BuildingIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kathmandu Fitness Hub"
                  value={form.businessName}
                  onChange={(e) => set('businessName', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Owner Name + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={form.ownerName}
                    onChange={(e) => set('ownerName', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <PhoneIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="98XXXXXXXX"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MailIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Setup Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <LockIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-700 text-white py-4 rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating your Daju...
                  </>
                ) : (
                  <>
                    Create My Daju <CheckCircle2Icon size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            By joining, you agree to Daju&apos;s Terms of Service and Privacy Policy.
            No credit card required for the trial.
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 font-medium">
            Already using Daju?{' '}
            <a href="/auth/login" className="text-blue-700 font-bold hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage