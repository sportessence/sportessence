import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'
  const code = searchParams.get('code')
  
  // Gestione errori espliciti
  const error = searchParams.get('error')
  const error_code = searchParams.get('error_code')
  const error_description = searchParams.get('error_description')

  console.log('🔐 Auth Callback:', {
    type,
    hasTokenHash: !!token_hash,
    hasCode: !!code,
    next,
    error,
    error_code
  })

  // ❌ GESTIONE ERRORI
  if (error || error_code) {
    console.error('❌ Auth error:', { error, error_code, error_description })
    
    if (error_code === 'otp_expired') {
      const redirectUrl = new URL('/RecuperoPassword', origin)
      redirectUrl.searchParams.set('error', 'Link scaduto o già usato. Richiedi un nuovo link.')
      return NextResponse.redirect(redirectUrl)
    }
    
    const redirectUrl = new URL('/Login', origin)
    redirectUrl.searchParams.set('error', error_description || error || 'Errore durante l\'autenticazione')
    return NextResponse.redirect(redirectUrl)
  }

  const supabase = await createClient()

  // ✅ CASO 1: Recovery Password (type=recovery)
  if (token_hash && type === 'recovery') {
    console.log('📧 Processing password recovery...')
    
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'recovery',
    })

    if (verifyError) {
      console.error('❌ Verify recovery error:', verifyError)
      const redirectUrl = new URL('/RecuperoPassword', origin)
      redirectUrl.searchParams.set('error', 'Link non valido o scaduto.')
      return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ Password recovery verified')
    
    const redirectUrl = `${origin}${next}`
    const response = NextResponse.redirect(redirectUrl)
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    
    return response
  }

  // ✅ CASO 2: Email Change Confirmation (type=email_change)
  if (token_hash && type === 'email_change') {
    console.log('📧 Processing email change confirmation...')
    
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'email_change',
    })

    if (verifyError) {
      console.error('❌ Verify email change error:', verifyError)
      const redirectUrl = new URL('/Utente', origin)
      redirectUrl.searchParams.set('error', 'Link non valido o scaduto.')
      return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ Email change confirmed')
    
    // Redirect alla pagina utente con messaggio di successo
    const redirectUrl = new URL(next || '/Utente', origin)
    redirectUrl.searchParams.set('success', 'Email modificata con successo!')
    
    const response = NextResponse.redirect(redirectUrl)
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    
    return response
  }

  // ✅ CASO 3: Code exchange (signup/login standard)
  if (code) {
    console.log('🔑 Processing code exchange...')
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('❌ Exchange error:', exchangeError)
      const redirectUrl = new URL('/Login', origin)
      redirectUrl.searchParams.set('error', 'Codice non valido')
      return NextResponse.redirect(redirectUrl)
    }

    if (!data.session) {
      console.error('❌ No session after exchange')
      const redirectUrl = new URL('/Login', origin)
      redirectUrl.searchParams.set('error', 'Impossibile creare la sessione')
      return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ Session created for:', data.user?.email)
    
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    
    const redirectUrl = isLocalEnv 
      ? `${origin}${next}`
      : forwardedHost 
        ? `https://${forwardedHost}${next}`
        : `${origin}${next}`
    
    const response = NextResponse.redirect(redirectUrl)
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    
    return response
  }

  // ❌ CASO 4: Nessun parametro valido
  console.log('❌ No valid parameters in callback')
  const redirectUrl = new URL('/Login', origin)
  redirectUrl.searchParams.set('error', 'Link non valido')
  return NextResponse.redirect(redirectUrl)
}