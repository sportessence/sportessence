import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Verifica che la richiesta provenga da una fonte autorizzata (opzionale ma consigliato)
  const authHeader = request.headers.get('authorization')
  
  // Aggiungi un secret per sicurezza (opzionale)
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  try {
    const supabase = await createClient()
    
    // Fai una query semplice per "svegliare" il database
    const { data, error } = await supabase
      .from('camps')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Keepalive error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        }, 
        { status: 500 }
      )
    }

    console.log('✅ Database keepalive successful')
    return NextResponse.json({ 
      success: true, 
      message: 'Database is alive',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Keepalive exception:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}