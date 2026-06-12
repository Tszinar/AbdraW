import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Защищенные маршруты
  const protectedPaths = ['/profile', '/admin']
  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !user) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
  
  // Админ-маршруты
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user?.id)
      .single()
    
    if (profile?.nickname !== 'TSZINAR') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
