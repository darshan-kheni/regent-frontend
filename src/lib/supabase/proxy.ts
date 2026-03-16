import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // CRITICAL: getUser() validates JWT with Supabase auth server (not just local decode)
  const { data: { user } } = await supabase.auth.getUser()

  // Handle auth code on root URL — redirect to callback handler
  const pathname = request.nextUrl.pathname
  const code = request.nextUrl.searchParams.get('code')
  if (pathname === '/' && code) {
    const url = request.nextUrl.clone()
    url.pathname = '/callback'
    // Preserve the code param
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users to login (except public routes)
  const publicPaths = ['/', '/login', '/callback', '/privacy', '/terms', '/gdpr', '/security']
  const isPublic = publicPaths.includes(pathname)
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
