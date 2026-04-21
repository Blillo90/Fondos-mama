import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase no configurado. Añade las variables de entorno.' }, { status: 500 })
  }

  const supabase = createClient(url, key)

  try {
    const body = await req.json()
    const { date, actualTotal, objetivoValues, objetivoTotal } = body

    if (!date) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

    const upserts = []

    if (actualTotal > 0) {
      upserts.push({ portfolio_id: 'actual', date, total_value: actualTotal })
    }
    if (objetivoTotal > 0) {
      upserts.push({ portfolio_id: 'objetivo', date, total_value: objetivoTotal })
    }

    if (upserts.length > 0) {
      const { error } = await supabase.from('portfolio_snapshots').upsert(upserts)
      if (error) throw error
    }

    // Guardar valores individuales por fondo
    const fundValues = Object.entries(objetivoValues as Record<string, string>)
      .filter(([, v]) => parseFloat(v) > 0)
      .map(([fund_id, value]) => ({
        fund_id,
        portfolio_id: 'objetivo',
        date,
        value: parseFloat(value),
      }))

    if (fundValues.length > 0) {
      const { error } = await supabase.from('fund_values').upsert(fundValues)
      if (error) throw error
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error desconocido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
