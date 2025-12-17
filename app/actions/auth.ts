'use server'

import { createClient } from '../utils/supabase/server'
import { headers } from "next/headers"
import { redirect } from 'next/navigation'

// --- REGISTRAZIONE ---
export async function signup(formData: any) {
  const supabase = await createClient()
  const email = formData.email.trim().toLowerCase()
  const { 
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

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Errore sconosciuto durante la creazione utente." }
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: email,
      nome: nome,
      cognome: cognome,
      cf: codiceFiscale,
      telefono: telefono,
      email_contatti: emailContatto,
      indirizzo_via: via,
      indirizzo_civico: civico,
      indirizzo_paese: paese,
      indirizzo_provincia: provincia,
      indirizzo_cap: cap,
    })

  if (profileError) {
    console.error("Errore salvataggio profilo:", profileError)
    return { error: "Errore nel salvataggio:" + profileError.message }
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

  // 3. ✅ INVECE DI REDIRECT, RITORNA IL RUOLO
  //    Il client farà il redirect dopo aver aggiornato tutto
  return { 
    success: true, 
    role: isAdmin ? 'admin' : 'user' as 'admin' | 'user'
  }
}

// --- PASSWORD RESET ---
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  
  const origin = (await headers()).get("origin")

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/RecuperoPassword`,
  })

  if (error) {
    console.error(error.message) 
    return { error: "Impossibile inviare la richiesta. Riprova più tardi." }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get("password") as string

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: "Errore aggiornamento password" }
  }

  return { success: true }
}