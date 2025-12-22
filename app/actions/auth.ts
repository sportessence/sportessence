'use server'

import { createClient } from '../utils/supabase/server'
import { headers } from "next/headers"

// --- REGISTRAZIONE CON RECAPTCHA ---
export async function signup(formData: any) {
  const supabase = await createClient()
  
  const { 
    email, 
    password, 
    nome, 
    cognome, 
    codiceFiscale, 
    telefono, 
    emailContatto, 
    via,
    civico,
    cap,
    paese,
    provincia,
    recaptchaToken
  } = formData

  // 0. Verifica reCAPTCHA (se configurato)
  if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
    const { verifyRecaptchaToken } = await import('../utils/recaptcha');
    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, 'signup');
    
    if (!recaptchaResult.success) {
      console.log('❌ reCAPTCHA failed:', recaptchaResult.error);
      return { error: "Verifica di sicurezza fallita. Riprova." }
    }
    
    // Log dello score per monitoraggio
    console.log('✅ reCAPTCHA passed - Score:', recaptchaResult.score);
  }

  // 1. Crea utente auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${(await headers()).get("origin")}/auth/callback`,
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Errore sconosciuto durante la creazione utente." }
  }

  // 2. Crea profilo
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: email,
      nome: nome,
      cognome: cognome,
      cf: codiceFiscale,
      telefono: telefono,
      email_contatti: emailContatto || email,
      indirizzo_via: via,
      indirizzo_civico: civico,
      indirizzo_paese: paese,
      indirizzo_provincia: provincia,
      indirizzo_cap: cap,
    })

  if (profileError) {
    console.error("Errore salvataggio profilo:", profileError)
    return { error: "Registrazione riuscita ma errore nel profilo: " + profileError.message }
  }

  return { success: true }
}

// --- LOGIN CON RUOLO E RECAPTCHA ---
export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const recaptchaToken = formData.get('recaptchaToken') as string

  // 0. Verifica reCAPTCHA (se configurato)
  if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
    const { verifyRecaptchaToken } = await import('../utils/recaptcha');
    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, 'login');
    
    if (!recaptchaResult.success) {
      console.log('❌ reCAPTCHA failed:', recaptchaResult.error);
      return { error: "Verifica di sicurezza fallita. Riprova." }
    }
    
    console.log('✅ reCAPTCHA passed - Score:', recaptchaResult.score);
  }

  // 1. Fai il login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: "Email o password errati" }
  }

  if (!data.user) {
    return { error: "Errore durante il login" }
  }

  // 2. Controlla se l'utente è un admin
  const { data: adminRow } = await supabase
    .from('admins_whitelist')
    .select('id')
    .eq('id', data.user.id)
    .single()

  const isAdmin = !!adminRow

  // 3. Ritorna il ruolo (il client farà redirect)
  return { 
    success: true, 
    role: isAdmin ? 'admin' : 'user' as 'admin' | 'user'
  }
}

// --- RECUPERO PASSWORD: Passo 1 - Richiesta Reset CON RECAPTCHA ---
// Versione con LOGGING ESTESO per debug
export async function forgotPassword(formData: FormData) {
  console.log('🔵 === INIZIO FORGOT PASSWORD ===')
  
  const supabase = await createClient()
  console.log('✅ Supabase client creato')
  
  const email = formData.get("email") as string
  console.log('📧 Email ricevuta:', email)
  
  if (!email) {
    console.log('❌ Email mancante')
    return { error: "Email richiesta" }
  }

  const origin = (await headers()).get("origin") || 'http://localhost:3000'
  console.log('🌍 Origin:', origin)
  
  const redirectUrl = `${origin}/auth/callback?next=/ResetPassword`
  console.log('🔗 Redirect URL:', redirectUrl)

  console.log('📤 Chiamata a Supabase resetPasswordForEmail...')
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    console.log('📥 Risposta Supabase:', {
      data,
      error,
      hasError: !!error
    })

    if (error) {
      console.error('❌ ERRORE SUPABASE:', {
        message: error.message,
        status: error.status,
        name: error.name,
        // @ts-ignore
        code: error.code,
        details: error
      })
      
      // Log dettagliato dell'errore
      console.error('❌ Errore completo:', JSON.stringify(error, null, 2))
      
      // Ritorna sempre success per sicurezza (non rivelare se email esiste)
      return { success: true }
    }

    console.log('✅ Email inviata con successo!')
    console.log('📊 Data risposta:', data)
    console.log('🔵 === FINE FORGOT PASSWORD ===')
    
    return { success: true }
    
  } catch (err) {
    console.error('💥 ECCEZIONE CAUGHT:', err)
    console.error('💥 Stack trace:', (err as Error).stack)
    return { success: true }
  }
}

// --- RECUPERO PASSWORD: Passo 2 - Aggiorna Password ---
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get("password") as string

  if (!password) {
    return { error: "Password richiesta" }
  }

  if (password.length < 8) {
    return { error: "La password deve essere di almeno 8 caratteri" }
  }

  // Aggiorna password dell'utente corrente
  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    console.error("Errore aggiornamento password:", error)
    return { error: "Errore durante l'aggiornamento della password" }
  }

  return { success: true }
}