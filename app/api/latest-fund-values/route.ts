import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ objetivo: {}, actual: {} })

  const supabase = createClient(url, key)

  const [{ data: objetivoRows }, { data: actualRows }] = await Promise.all([
    supabase
      .from('fund_values')
      .select('fund_id, value, date')
      .eq('portfolio_id', 'objetivo')
      .order('date', { ascending: false }),
    supabase
      .from('fund_values')
      .select('fund_id, value, date')
      .eq('portfolio_id', 'actual')
      .order('date', { ascending: false }),
  ])

  const latestObjetivo: Record<string, string> = {}
  for (const v of (objetivoRows ?? [])) {
    if (!(v.fund_id in latestObjetivo)) latestObjetivo[v.fund_id] = String(v.value)
  }

  const latestActual: Record<string, string> = {}
  for (const v of (actualRows ?? [])) {
    if (!(v.fund_id in latestActual)) latestActual[v.fund_id] = String(v.value)
  }

  return NextResponse.json({ objetivo: latestObjetivo, actual: latestActual })
}
