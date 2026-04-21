import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TARGET_FUNDS = [
  { id: 'nb-short-duration', name: 'NB Short Duration Bond', isin: 'IE00BFZMJT78', weight: 20.7 },
  { id: 'schroder-euro-credit', name: 'Schroder Euro Credit', isin: 'LU2080996049', weight: 13.8 },
  { id: 'jpm-us-equity-focus', name: 'JPMorgan US Equity Focus', isin: 'LU2510715605', weight: 16.1 },
  { id: 'amundi-us-equity-value', name: 'Amundi US Equity Value R2', isin: 'LU1894686523', weight: 9.2 },
  { id: 'eleva-european', name: 'Eleva European Selection', isin: 'LU1111643042', weight: 10.4 },
  { id: 'sabadell-euroaccion', name: 'Sabadell Euroacción', isin: 'ES0111098002', weight: 4.6 },
  { id: 'mfs-meridian-em-debt', name: 'MFS Meridian EM Debt', isin: 'LU0583240782', weight: 5.2 },
  { id: 'nb-em-debt-hard', name: 'NB EM Debt Hard CCY', isin: 'IE00B986G486', weight: 4.8 },
  { id: 'ofi-precious-metals', name: 'OFI Precious Metals', isin: 'FR0011170786', weight: 6.3 },
  { id: 'man-alpha-alternative', name: 'Man Alpha Select Alternative', isin: 'IE00B3LJVG97', weight: 2.0 },
  { id: 'atlas-infrastructure', name: 'Atlas Global Infrastructure', isin: 'IE000NPCPQI2', weight: 1.7 },
  { id: 'sabadell-prudente-residual', name: 'Sabadell Prudente (residual)', isin: 'ES0111187003', weight: 5.2 },
]

const MS_UNIVERSE = 'FOGBR$ALL|FOESP$ALL|FOIRL$ALL|FOLUX$ALL|FOFRA$ALL|FOEUR$ALL'
const MS_DATA_POINTS = 'SecId,LegalName,ClosePrice,ClosePriceDate,DayReturn,OneDayReturn,Currency,ISIN'

async function fetchMorningstarPrice(isin: string): Promise<{ nav: number | null; dailyReturn: number | null; date: string | null }> {
  const url = `https://lt.morningstar.com/api/rest.svc/klr5zyak8x/security/screener?page=1&pageSize=1&sortOrder=LegalName+asc&outputType=json&version=1&languageId=es-ES&currencyId=EUR&universeIds=${MS_UNIVERSE}&securityDataPoints=${MS_DATA_POINTS}&term=${isin}`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Referer': 'https://www.morningstar.es/',
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) return { nav: null, dailyReturn: null, date: null }

  const json = await res.json()
  const rows: unknown[] = json?.rows ?? []
  if (rows.length === 0) return { nav: null, dailyReturn: null, date: null }

  const row = rows[0] as Record<string, unknown>
  const nav = typeof row.ClosePrice === 'number' ? row.ClosePrice : null
  const dailyReturn = typeof row.OneDayReturn === 'number'
    ? row.OneDayReturn
    : typeof row.DayReturn === 'number'
    ? row.DayReturn
    : null
  const date = typeof row.ClosePriceDate === 'string' ? row.ClosePriceDate : null

  return { nav, dailyReturn, date }
}

export async function GET() {
  const results: {
    id: string
    name: string
    isin: string
    nav: number | null
    dailyReturn: number | null
    date: string | null
    error?: string
  }[] = []

  await Promise.all(
    TARGET_FUNDS.map(async (fund) => {
      try {
        const data = await fetchMorningstarPrice(fund.isin)
        results.push({ id: fund.id, name: fund.name, isin: fund.isin, ...data })
      } catch {
        results.push({ id: fund.id, name: fund.name, isin: fund.isin, nav: null, dailyReturn: null, date: null, error: 'Fetch failed' })
      }
    })
  )

  // Save to Supabase if configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  let saved = false

  if (url && key) {
    try {
      const supabase = createClient(url, key)
      const today = new Date().toISOString().split('T')[0]

      const fundValues = results
        .filter((r) => r.nav !== null)
        .map((r) => ({
          fund_isin: r.isin,
          date: r.date ?? today,
          nav: r.nav,
          daily_return_pct: r.dailyReturn,
        }))

      if (fundValues.length > 0) {
        await supabase.from('fund_values').upsert(fundValues, { onConflict: 'fund_isin,date' })
        saved = true
      }
    } catch {
      // Supabase save failed — return prices anyway
    }
  }

  return NextResponse.json({ results, saved })
}
