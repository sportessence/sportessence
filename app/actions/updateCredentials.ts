'use server'

import { createClient } from '../utils/supabase/server'

// ==========================================
// 1. CAMBIO EMAIL (Step 1: Richiesta OTP)
// ==========================================
export async function requestEmailChangeOTP(newEmail: string) {
  const supabase = await createClient()
  
  // 1. Check Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Non autenticato' }

  // 2. Validazioni Input (Dal tuo codice robusto)
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  if (!emailRegex.test(newEmail)) return { error: 'Email non valida' }
  
  if (newEmail.toLowerCase() === user.email?.toLowerCase()) {
    return { error: 'La nuova email è uguale a quella attuale' }
  }

  // 3. Invia richiesta a Supabase
  // Invia OTP alla NUOVA email
  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: undefined } // Forza OTP, niente link magici
  )

  if (error) {
    if (error.message.includes('already registered')) return { error: 'Email già in uso' }
    return { error: error.message }
  }

  return { success: true }
}

// ==========================================
// 2. CAMBIO EMAIL (Step 2: Verifica OTP)
// ==========================================
export async function verifyEmailChangeOTP(newEmail: string, token: string) {
  const supabase = await createClient()
  
  // 1. Check Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Non autenticato' }

  if (!token || token.length < 6) return { error: 'Codice non valido' }

  // 2. Verifica OTP su Supabase
  // Per il cambio email, serve passare la NUOVA email e il type 'email_change'
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email: newEmail,
    token: token,
    type: 'email_change'
  })

  if (verifyError) return { error: 'Codice errato o scaduto' }

  // 3. CRUCIALE: Aggiorna anche la tabella pubblica 'profiles'
  // Se non lo fai, l'utente avrà email diverse tra Auth e Database
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ email: newEmail })
    .eq('id', user.id)

  if (profileError) {
    console.error('Errore sync profilo:', profileError)
    // Non ritorniamo errore all'utente perché l'auth è comunque cambiata con successo
  }

  return { success: true }
}

// ==========================================
// 3. CAMBIO PASSWORD (Sicuro)
// ==========================================
export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient()
  
  // 1. Check Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Non autenticato' }

  // 2. Validazioni Sicurezza Password (Dal tuo codice robusto)
  if (newPassword.length < 8) return { error: 'Minimo 8 caratteri' }
  if (!/[A-Z]/.test(newPassword)) return { error: 'Serve una maiuscola' }
  if (!/[a-z]/.test(newPassword)) return { error: 'Serve una minuscola' }
  if (!/[0-9]/.test(newPassword)) return { error: 'Serve un numero' }
  if (!/[^A-Za-z0-9]/.test(newPassword)) return { error: 'Serve un carattere speciale' }

  // 3. Verifica che l'utente conosca la vecchia password
  // È una best practice di sicurezza per evitare cambi password se lasci il PC aperto
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword
  })

  if (signInError) return { error: 'La password attuale non è corretta' }

  // 4. Aggiorna Password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (updateError) return { error: updateError.message }

  return { success: true }
}