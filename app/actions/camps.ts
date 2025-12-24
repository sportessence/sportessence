'use server'

import { createClient } from '../utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Tipo per i dati del campo
export type CampData = {
  nome: string
  indirizzo_via: string
  indirizzo_civico: string
  indirizzo_cap: string
  indirizzo_paese: string
  indirizzo_provincia: string
  data_inizio: string
  data_fine: string
  descrizione?: string
  prezzo?: number
  attivo?: boolean
}

// --- GET TUTTI I CAMPI ---
export async function getAllCamps() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('camps')
    .select('*')
    .order('data_inizio', { ascending: true })

  if (error) {
    console.error('Errore recupero campi:', error)
    return { error: error.message }
  }

  return { success: true, camps: data }
}

// --- GET SINGOLO CAMPO ---
export async function getCampById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('camps')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Errore recupero campo:', error)
    return { error: error.message }
  }

  return { success: true, camp: data }
}

// --- CREA NUOVO CAMPO (SOLO ADMIN) ---
export async function createCamp(campData: CampData) {
  const supabase = await createClient()
  
  // Verifica che l'utente sia admin
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Non autenticato' }
  }

  const { data: adminCheck } = await supabase
    .from('admins_whitelist')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminCheck) {
    return { error: 'Non autorizzato' }
  }

  // Crea il campo
  const { data, error } = await supabase
    .from('camps')
    .insert(campData)
    .select()
    .single()

  if (error) {
    console.error('Errore creazione campo:', error)
    return { error: error.message }
  }

  // Ricarica le pagine che mostrano i campi
  revalidatePath('/Campi')
  revalidatePath('/admin/Campi')

  return { success: true, camp: data }
}

// --- AGGIORNA CAMPO (SOLO ADMIN) ---
export async function updateCamp(id: string, campData: Partial<CampData>) {
  const supabase = await createClient()
  
  // Verifica che l'utente sia admin
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Non autenticato' }
  }

  const { data: adminCheck } = await supabase
    .from('admins_whitelist')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminCheck) {
    return { error: 'Non autorizzato' }
  }

  // Aggiorna il campo (la disattivazione è sempre possibile)
  const { data, error } = await supabase
    .from('camps')
    .update(campData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Errore aggiornamento campo:', error)
    return { error: error.message }
  }

  // Ricarica le pagine che mostrano i campi
  revalidatePath('/Campi')
  revalidatePath('/admin/Campi')

  return { success: true, camp: data }
}

// --- ELIMINA CAMPO (SOLO ADMIN) ---
export async function deleteCamp(id: string) {
  const supabase = await createClient()
  
  // Verifica che l'utente sia admin
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Non autenticato' }
  }

  const { data: adminCheck } = await supabase
    .from('admins_whitelist')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminCheck) {
    return { error: 'Non autorizzato' }
  }

  // Verifica se ci sono iscrizioni attive per questo campo
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id')
    .eq('camp_id', id)

  if (enrollments && enrollments.length > 0) {
    return { 
      error: 'Impossibile eliminare: ci sono iscrizioni attive per questo campo. Elimina prima le iscrizioni.' 
    }
  }

  // Elimina il campo
  const { error } = await supabase
    .from('camps')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Errore eliminazione campo:', error)
    return { error: error.message }
  }

  // Ricarica le pagine che mostrano i campi
  revalidatePath('/Campi')
  revalidatePath('/admin/Campi')

  return { success: true }
}