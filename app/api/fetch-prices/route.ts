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

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'es-ES,es;q=0.9',
}

async function fetchYahooPrice(isin: string): Promise<{ nav: number | null; dailyReturn: number | null; date: string | null; symbol?: string }> {
  // Step 1: find ticker by ISIN
  const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${isin}&lang=es-ES&region=ES&quotesCount=6&newsCount=0&listsCount=0`

  let symbol: string | null = null
  try {
    const searchRes = await fetch(searchUrl, { headers: YAHOO_HEADERS, next: { revalidate: 0 } })
    if (searchRes.ok) {
      const json = await searchRes.json()
      const quotes: { symbol: string; quoteType?: string }[] = json?.quotes ?? []
      const match =
        quotes.find((q) => q.quoteType === 'MUTUALFUND') ??
        quotes.find((q) => q.quoteType === 'ETF') ??
        quotes[0]
      symbol = match?.symbol ?? null
    }
  } catch {
    return { nav: null, dailyReturn: null, date: null }
  }

  if (!symbol) return { nav: null, dailyReturn: null, date: null }

  // Step 2: fetch quote details
  try {
    const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d&includeAdjustedClose=false`
    const quoteRes = await fetch(quoteUrl, { headers: YAHOO_HEADERS, next: { revalidate: 0 } })
    if (!quoteRes.ok) return { nav: null, dailyReturn: null, date: null, symbol }

    const quoteData = await quoteRes.json()
    const meta = quoteData?.chart?.result?.[0]?.meta
    if (!meta) return { nav: null, dailyReturn: null, date: null, symbol }

    const nav: number | null = meta.regularMarketPrice ?? null
    const prev: number | null = meta.chartPreviousClose ?? meta.previousClose ?? null
    const dailyReturn = nav !== null && prev ? ((nav - prev) / prev) * 100 : null
    const ts: number | null = meta.regularMarketTime ?? null
    const date = ts ? new Date(ts * 1000).toISOString().split('T')[0] : null

    return { nav, dailyReturn, date, symbol }
  } catch {
    return { nav: null, dailyReturn: null, date: null, symbol }
  }
}

export async function GET() {
  const results: {
    id: string
    name: string
    isin: string
    nav: number | null
    dailyReturn: number | null
    date: string | null
    symbol?: string
    error?: string
  }[] = []

  await Promise.all(
    TARGET_FUNDS.map(async (fund) => {
      try {
        const data = await fetchYahooPrice(fund.isin)
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
