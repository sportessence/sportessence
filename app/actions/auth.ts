'use server'

import { createClient } from '../utils/supabase/server'
import { headers } from "next/headers"

// --- REGISTRAZIONE ---
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
    provincia
  } = formData

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
    return { error: "Errore salvataggio profilo: " + profileError.message }
  }

  return { success: true }
}

// --- LOGIN CON RUOLO ---
export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

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

// --- RECUPERO PASSWORD: Passo 1 - Richiesta Reset ---
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  
  if (!email) {
    return { error: "Email richiesta" }
  }

  const origin = (await headers()).get("origin")

  // Invia email con link per reset
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/ResetPassword`,
  })

  if (error) {
    console.error("Errore reset password:", error.message)
    // ⚠️ IMPORTANTE: Non rivelare se l'email esiste o no (sicurezza)
    // Ritorna sempre success anche se email non esiste
    return { success: true }
  }

  return { success: true }
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