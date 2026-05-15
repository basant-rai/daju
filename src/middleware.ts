import { CookieOptions, createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options as any })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value, ...options as any })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options as any })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value: '', ...options as any })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  console.log("👀 ~ middleware ~ user:", user)

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect logged-in users away from auth pages
  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}