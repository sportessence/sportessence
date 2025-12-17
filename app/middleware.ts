import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // ✅ Logging per debug (rimuovi in production)
  console.log(`🔐 Middleware: ${path}`);

  let supabaseResponse = NextResponse.next({
    request,
  })

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
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ✅ Ottieni l'utente e aggiorna la sessione
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // ✅ PROTEZIONE ROUTE ADMIN - MASSIMA PRIORITÀ
  if (path.startsWith('/admin')) {
    console.log(`🔐 Admin route detected: ${path}`);
    
    // Se non c'è utente loggato, BLOCCA SUBITO
    if (authError || !user) {
      console.log(`❌ No user found, blocking access to ${path}`);
      const redirectUrl = new URL('/Login', request.url);
      redirectUrl.searchParams.set('redirect', path);
      // ✅ Aggiungi header per disabilitare cache
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set('Cache-Control', 'no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    console.log(`✅ User found: ${user.email}, checking admin status...`);

    // Controlla se l'utente è un admin
    const { data: adminRow, error: adminError } = await supabase
      .from('admins_whitelist')
      .select('id')
      .eq('id', user.id)
      .single()

    // Se NON è admin, BLOCCA e redirect alla home
    if (adminError || !adminRow) {
      console.log(`❌ User ${user.email} is NOT admin, blocking access to ${path}`);
      const redirectUrl = new URL('/', request.url);
      // ✅ Aggiungi header per disabilitare cache
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set('Cache-Control', 'no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    console.log(`✅ User ${user.email} is admin, allowing access to ${path}`);
  }

  // ✅ PROTEZIONE ROUTE UTENTE
  const userProtectedRoutes = ['/Utente', '/Iscrizione']
  const isUserProtectedRoute = userProtectedRoutes.some(route => 
    path.startsWith(route)
  )
  
  if (isUserProtectedRoute) {
    if (authError || !user) {
      console.log(`❌ No user found, blocking access to ${path}`);
      const redirectUrl = new URL('/Login', request.url);
      redirectUrl.searchParams.set('redirect', path);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set('Cache-Control', 'no-store, must-revalidate');
      return response;
    }
  }

  // ✅ Se l'utente è loggato e va al Login, redirect appropriato
  if (user && path === '/Login') {
    console.log(`✅ User already logged in, redirecting from /Login`);
    
    // Check se è admin
    const { data: adminRow } = await supabase
      .from('admins_whitelist')
      .select('id')
      .eq('id', user.id)
      .single()
    
    const homeUrl = adminRow ? '/admin/Dashboard' : '/'
    const response = NextResponse.redirect(new URL(homeUrl, request.url));
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  // ✅ Aggiungi header no-cache per tutte le pagine protette
  if (path.startsWith('/admin') || path.startsWith('/Utente') || path.startsWith('/Iscrizione')) {
    supabaseResponse.headers.set('Cache-Control', 'no-store, must-revalidate');
    supabaseResponse.headers.set('Pragma', 'no-cache');
    supabaseResponse.headers.set('Expires', '0');
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}