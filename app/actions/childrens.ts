// app/actions/children.ts
'use server'

import { createClient } from '../utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Tipo per i dati del bambino
export type ChildData = {
  nome: string
  cognome: string
  cf: string
  data_nascita: string
  taglia_maglietta: string
  intolleranze: string[]
}

// --- CREA NUOVO BAMBINO ---
export async function createChild(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Verifica autenticazione
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Non autenticato' }
  }

  // 2. Estrai dati dal FormData
  const nome = formData.get('nome') as string
  const cognome = formData.get('cognome') as string
  const cf = (formData.get('cf') as string).toUpperCase()
  const data_nascita = formData.get('data_nascita') as string
  const taglia_maglietta = formData.get('taglia_maglietta') as string
  
  // Intolleranze: possono essere una stringa JSON o array
  const intolleranzeRaw = formData.get('intolleranze')
  let intolleranze: string[] = []
  
  if (intolleranzeRaw) {
    try {
      intolleranze = typeof intolleranzeRaw === 'string' 
        ? JSON.parse(intolleranzeRaw)
        : intolleranzeRaw as unknown as string[]
    } catch {
      intolleranze = []
    }
  }

  // 3. Validazioni backend (doppia sicurezza)
  if (!nome || !cognome || !cf || !data_nascita || !taglia_maglietta) {
    return { error: 'Campi obbligatori mancanti' }
  }

  // Valida formato CF
  const cfRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/
  if (!cfRegex.test(cf)) {
    return { error: 'Codice Fiscale non valido' }
  }

  // Valida nome e cognome (solo lettere, accenti, spazi)
  const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ''\s-]+$/
  if (!nomeRegex.test(nome) || !nomeRegex.test(cognome)) {
    return { error: 'Nome o cognome contengono caratteri non validi' }
  }

  // Valida data nascita
  const birthDate = new Date(data_nascita)
  const today = new Date()
  const minDate = new Date('1900-01-01')
  
  if (birthDate > today || birthDate < minDate) {
    return { error: 'Data di nascita non valida' }
  }

  // Valida taglia
  const taglie = ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL']
  if (!taglie.includes(taglia_maglietta)) {
    return { error: 'Taglia non valida' }
  }

  // 4. Inserisci nel database
  const { data: child, error: insertError } = await supabase
    .from('children')
    .insert({
      parent_id: user.id,
      nome,
      cognome,
      cf,
      data_nascita,
      taglia_maglietta,
      intolleranze,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Errore inserimento bambino:', insertError)
    
    // Gestione CF duplicato
    if (insertError.code === '23505') {
      return { error: 'Questo Codice Fiscale è già registrato' }
    }
    
    return { error: insertError.message }
  }

  // 5. Ricarica la pagina utente
  revalidatePath('/Utente')

  return { success: true, child }
}

// --- AGGIORNA BAMBINO ---
export async function updateChild(childId: string, formData: FormData) {
  const supabase = await createClient()
  
  // 1. Verifica autenticazione
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Non autenticato' }
  }

  // 2. Verifica che il bambino appartenga all'utente
  const { data: existingChild, error: checkError } = await supabase
    .from('children')
    .select('parent_id')
    .eq('id', childId)
    .single()

  if (checkError || !existingChild) {
    return { error: 'Bambino non trovato' }
  }

  if (existingChild.parent_id !== user.id) {
    return { error: 'Non autorizzato' }
  }

  // 3. Estrai dati
  const nome = formData.get('nome') as string
  const cognome = formData.get('cognome') as string
  const cf = (formData.get('cf') as string)?.toUpperCase()
  const data_nascita = formData.get('data_nascita') as string
  const taglia_maglietta = formData.get('taglia_maglietta') as string
  
  const intolleranzeRaw = formData.get('intolleranze')
  let intolleranze: string[] = []
  
  if (intolleranzeRaw) {
    try {
      intolleranze = typeof intolleranzeRaw === 'string' 
        ? JSON.parse(intolleranzeRaw)
        : intolleranzeRaw as unknown as string[]
    } catch {
      intolleranze = []
    }
  }

  // 4. Validazioni (stesse di create)
  if (!nome || !cognome || !cf || !data_nascita || !taglia_maglietta) {
    return { error: 'Campi obbligatori mancanti' }
  }

  const cfRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/
  if (!cfRegex.test(cf)) {
    return { error: 'Codice Fiscale non valido' }
  }

  const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ''\s-]+$/
  if (!nomeRegex.test(nome) || !nomeRegex.test(cognome)) {
    return { error: 'Nome o cognome contengono caratteri non validi' }
  }

  const birthDate = new Date(data_nascita)
  const today = new Date()
  const minDate = new Date('1900-01-01')
  
  if (birthDate > today || birthDate < minDate) {
    return { error: 'Data di nascita non valida' }
  }

  const taglie = ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL']
  if (!taglie.includes(taglia_maglietta)) {
    return { error: 'Taglia non valida' }
  }

  // 5. Aggiorna nel database
  const { data: child, error: updateError } = await supabase
    .from('children')
    .update({
      nome,
      cognome,
      cf,
      data_nascita,
      taglia_maglietta,
      intolleranze,
    })
    .eq('id', childId)
    .select()
    .single()

  if (updateError) {
    console.error('Errore aggiornamento bambino:', updateError)
    
    if (updateError.code === '23505') {
      return { error: 'Questo Codice Fiscale è già registrato' }
    }
    
    return { error: updateError.message }
  }

  // 6. Ricarica la pagina
  revalidatePath('/Utente')

  return { success: true, child }
}

// --- ELIMINA BAMBINO ---
export async function deleteChild(childId: string) {
  const supabase = await createClient()
  
  // 1. Verifica autenticazione
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Non autenticato' }
  }

  // 2. Verifica che il bambino appartenga all'utente
  const { data: existingChild, error: checkError } = await supabase
    .from('children')
    .select('parent_id')
    .eq('id', childId)
    .single()

  if (checkError || !existingChild) {
    return { error: 'Bambino non trovato' }
  }

  if (existingChild.parent_id !== user.id) {
    return { error: 'Non autorizzato' }
  }

  // 3. Verifica se ci sono iscrizioni attive
  // Il trigger trg_check_active_enrollments_child dovrebbe bloccare automaticamente,
  // ma facciamo un check preventivo per dare un messaggio più chiaro
  const { data: activeEnrollments } = await supabase
    .from('enrollments')
    .select('id, camps(nome, data_fine)')
    .eq('child_id', childId)

  if (activeEnrollments && activeEnrollments.length > 0) {
    const hasActive = activeEnrollments.some(e => 
      e.camps && Array.isArray(e.camps) && e.camps.length > 0 && new Date(e.camps[0].data_fine) >= new Date()
    )
    
    if (hasActive) {
      return { 
        error: 'Impossibile eliminare: ci sono iscrizioni attive per questo bambino. Attendi la fine dei campi o contattaci.' 
      }
    }
  }

  // 4. Elimina il bambino
  const { error: deleteError } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)

  if (deleteError) {
    console.error('Errore eliminazione bambino:', deleteError)
    return { error: deleteError.message }
  }

  // 5. Ricarica la pagina
  revalidatePath('/Utente')

  return { success: true }
}