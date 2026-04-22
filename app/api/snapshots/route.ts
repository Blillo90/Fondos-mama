import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase no configurado. Añade las variables de entorno.' }, { status: 500 })
  }

  const supabase = createClient(url, key)

  try {
    const body = await req.json()
    const { date, actualTotal, actualFundValues, objetivoValues, objetivoTotal } = body

    if (!date) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

    const upserts = []

    if (actualTotal > 0) {
      upserts.push({ portfolio_id: 'actual', date, total_value: actualTotal })
    }
    if (objetivoTotal > 0) {
      upserts.push({ portfolio_id: 'objetivo', date, total_value: objetivoTotal })
    }

    if (upserts.length > 0) {
      const { error } = await supabase.from('portfolio_snapshots').upsert(upserts, { onConflict: 'portfolio_id,date' })
      if (error) throw error
    }

    // Guardar valores individuales por fondo (objetivo)
    const fundValues = Object.entries(objetivoValues as Record<string, string>)
      .filter(([, v]) => parseFloat(v) > 0)
      .map(([fund_id, value]) => ({
        fund_id,
        portfolio_id: 'objetivo',
        date,
        value: parseFloat(value),
      }))

    if (fundValues.length > 0) {
      const { error } = await supabase.from('fund_values').upsert(fundValues, { onConflict: 'fund_id,portfolio_id,date' })
      if (error) throw error
    }

    // Guardar valores individuales por fondo (actual)
    if (actualFundValues && typeof actualFundValues === 'object') {
      const actualValues = Object.entries(actualFundValues as Record<string, string>)
        .filter(([, v]) => parseFloat(v) > 0)
        .map(([fund_id, value]) => ({
          fund_id,
          portfolio_id: 'actual',
          date,
          value: parseFloat(value),
        }))
      if (actualValues.length > 0) {
        const { error } = await supabase.from('fund_values').upsert(actualValues)
        if (error) throw error
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg =
      e instanceof Error
        ? e.message
        : typeof e === 'object' && e !== null && 'message' in e
          ? String((e as Record<string, unknown>).message)
          : JSON.stringify(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
