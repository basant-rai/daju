import Link from 'next/link'
import { LayoutDashboard, Users, CalendarCheck, Settings } from 'lucide-react'
import Logo from '@/components/logo/logo'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-56 bg-white flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-2 border-b border-black/10">
          <Logo />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="sidebar-link group">
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-stone-600 text-xs">Organization</p>
          <p className="text-stone-300 text-sm font-medium mt-0.5 truncate">
            {process.env.NEXT_PUBLIC_ORG_NAME ?? 'My Organization'}
          </p>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 px-2 pb-safe pt-2 z-50">
        <div className="flex items-center justify-around">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 py-1 px-2 text-stone-500 hover:text-black transition-colors"
            >
              <Icon size={20} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
