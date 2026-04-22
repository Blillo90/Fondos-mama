import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TARGET_FUNDS = [
  { id: 'nb-short-duration',         name: 'NB Short Duration Bond',         isin: 'IE00BFZMJT78', portfolio: 'objetivo', initialAmount: 18988 },
  { id: 'schroder-euro-credit',       name: 'Schroder Euro Credit',            isin: 'LU2080996049', portfolio: 'objetivo', initialAmount: 12658 },
  { id: 'jpm-us-equity-focus',        name: 'JPMorgan US Equity Focus',        isin: 'LU2510715605', portfolio: 'objetivo', initialAmount: 14768 },
  { id: 'amundi-us-equity-value',     name: 'Amundi US Equity Value R2',       isin: 'LU1894686523', portfolio: 'objetivo', initialAmount: 8439 },
  { id: 'eleva-european',             name: 'Eleva European Selection',        isin: 'LU1111643042', portfolio: 'objetivo', initialAmount: 9494 },
  { id: 'sabadell-euroaccion',        name: 'Sabadell Euroacción',             isin: 'ES0111098002', portfolio: 'objetivo', initialAmount: 4219 },
  { id: 'mfs-meridian-em-debt',       name: 'MFS Meridian EM Debt',            isin: 'LU0583240782', portfolio: 'objetivo', initialAmount: 4747 },
  { id: 'nb-em-debt-hard',            name: 'NB EM Debt Hard CCY',             isin: 'IE00B986G486', portfolio: 'objetivo', initialAmount: 4430 },
  { id: 'ofi-precious-metals',        name: 'OFI Precious Metals',             isin: 'FR0011170786', portfolio: 'objetivo', initialAmount: 5802 },
  { id: 'man-alpha-alternative',      name: 'Man Alpha Select Alternative',    isin: 'IE00B3LJVG97', portfolio: 'objetivo', initialAmount: 1793 },
  { id: 'atlas-infrastructure',       name: 'Atlas Global Infrastructure',     isin: 'IE000NPCPQI2', portfolio: 'objetivo', initialAmount: 1582 },
  { id: 'sabadell-prudente-residual', name: 'Sabadell Prudente (residual)',    isin: 'ES0111187003', portfolio: 'objetivo', initialAmount: 4747 },
]

const ACTUAL_FUNDS = [
  { id: 'sabadell-prudente',          name: 'Sabadell Prudente',                       isin: 'ES0111187003', portfolio: 'actual', initialAmount: 42977 },
  { id: 'sabadell-rendimiento',       name: 'Sabadell Rendimiento',                    isin: 'ES0173829039', portfolio: 'actual', initialAmount: 13470 },
  { id: 'sabadell-consolida-94',      name: 'Sabadell Consolida 94',                   isin: 'ES0111203008', portfolio: 'actual', initialAmount: 10450 },
  { id: 'sabadell-interes-euro',      name: 'Sabadell Interés Euro',                   isin: 'ES0174403008', portfolio: 'actual', initialAmount: 4780 },
  { id: 'sabadell-bonos-euro',        name: 'Sabadell Bonos Euro',                     isin: 'ES0173828007', portfolio: 'actual', initialAmount: 3136 },
  { id: 'sabadell-sel-alternativa',   name: 'Sabadell Selección Alternativa',          isin: 'ES0182282014', portfolio: 'actual', initialAmount: 2174 },
  { id: 'sabadell-euro-yield',        name: 'Sabadell Euro Yield',                     isin: 'ES0184976001', portfolio: 'actual', initialAmount: 1379 },
  { id: 'bnp-enhanced-bond',          name: 'BNP Paribas Enhanced Bond 6M',            isin: 'LU0325598752', portfolio: 'actual', initialAmount: 929 },
  { id: 'sabadell-bonos-flotantes',   name: 'Sabadell Bonos Flotantes Euro',           isin: 'ES0174356016', portfolio: 'actual', initialAmount: 788 },
  { id: 'amundi-abs-responsible',     name: 'Amundi ABS Responsible',                  isin: 'FR0010319996', portfolio: 'actual', initialAmount: 742 },
  { id: 'mg-european-credit',         name: 'M&G European Credit QI',                  isin: 'LU2188668326', portfolio: 'actual', initialAmount: 731 },
  { id: 'eurizon-euro-bond',          name: 'Eurizon Fund II Euro Bond Z',             isin: 'LU0278427041', portfolio: 'actual', initialAmount: 707 },
  { id: 'sabadell-estados-unidos',    name: 'Sabadell Estados Unidos Bolsa',           isin: 'ES0138983004', portfolio: 'actual', initialAmount: 657 },
  { id: 'sabadell-bonos-sostenibles', name: 'Sabadell Bonos Sostenibles España',       isin: 'ES0158862021', portfolio: 'actual', initialAmount: 510 },
  { id: 'axa-europe-high-yield',      name: 'AXA IM Europe SD High Yield',             isin: 'LU0658025209', portfolio: 'actual', initialAmount: 478 },
  { id: 'muzinich-enhanced-yield',    name: 'Muzinich Enhanced Yield ST',              isin: 'IE00BYXHR262', portfolio: 'actual', initialAmount: 476 },
  { id: 'generali-euro-bond',         name: 'Generali Euro Bond 1-3 Years G',         isin: 'LU1373301057', portfolio: 'actual', initialAmount: 406 },
  { id: 'lazard-capital-sri',         name: 'Lazard Capital SRI SC',                   isin: 'FR0013311446', portfolio: 'actual', initialAmount: 329 },
  { id: 'sabadell-dolar-fijo',        name: 'Sabadell Dólar Fijo',                     isin: 'ES0138950003', portfolio: 'actual', initialAmount: 317 },
  { id: 'jpm-america-equity',         name: 'JPM America Equity',                      isin: 'LU1734444273', portfolio: 'actual', initialAmount: 294 },
  { id: 'sabadell-emergente-mixto',   name: 'Sabadell Emergente Mixto Flexible',       isin: 'ES0105142006', portfolio: 'actual', initialAmount: 273 },
  { id: 'axa-euro-credit-x',          name: 'AXA WF Euro Credit SD X',                isin: 'LU1601096537', portfolio: 'actual', initialAmount: 261 },
  { id: 'axa-credit-sdi',             name: 'AXA WF Euro Credit SD I',                isin: 'LU0227127643', portfolio: 'actual', initialAmount: 259 },
  { id: 'jpm-em-local',               name: 'JPM EM Local Currency Debt',              isin: 'LU0804757648', portfolio: 'actual', initialAmount: 215 },
  { id: 'amundi-multi-strategy',      name: 'Amundi ABS Ret Multi-Strategy J',         isin: 'LU1882440925', portfolio: 'actual', initialAmount: 211 },
  { id: 'sabadell-bolsas-emergentes', name: 'Sabadell Bolsas Emergentes',              isin: 'ES0175083007', portfolio: 'actual', initialAmount: 180 },
  { id: 'sabadell-economia-digital',  name: 'Sabadell Economía Digital',               isin: 'ES0138528015', portfolio: 'actual', initialAmount: 180 },
  { id: 'amundi-us-research-value',   name: 'Amundi US Equity Research Value J21',    isin: 'LU2931223932', portfolio: 'actual', initialAmount: 152 },
  { id: 'sabadell-europa-futuro',     name: 'Sabadell Europa Bolsa Futuro',            isin: 'ES0183339003', portfolio: 'actual', initialAmount: 128 },
  { id: 'amundi-us-growth',           name: 'Amundi US Equity Fundamental Growth J2', isin: 'LU2732984955', portfolio: 'actual', initialAmount: 108 },
  { id: 'alma-eikoh-japan',           name: 'Alma Eikoh Japan Large Cap Equity',       isin: 'LU1870374508', portfolio: 'actual', initialAmount: 102 },
  { id: 'ct-us-contrarian',           name: 'CT Lux US Contrarian Core Equities ZE',  isin: 'LU0957798324', portfolio: 'actual', initialAmount: 78 },
  { id: 'loomis-us-growth',           name: 'Loomis Sayles US Growth Equity S1',       isin: 'LU1435387458', portfolio: 'actual', initialAmount: 61 },
  { id: 'ab-us-equity',               name: 'AB Select US Equity Portfolio S1',        isin: 'LU1764069099', portfolio: 'actual', initialAmount: 58 },
  { id: 'amundi-commodities',         name: 'Amundi SF EUR Commodities R',             isin: 'LU1706853931', portfolio: 'actual', initialAmount: 54 },
  { id: 'sabadell-economia-verde',    name: 'Sabadell Economía Verde',                 isin: 'ES0138529013', portfolio: 'actual', initialAmount: 53 },
  { id: 'sabadell-espana-futuro',     name: 'Sabadell España Bolsa Futuro',            isin: 'ES0111092005', portfolio: 'actual', initialAmount: 3 },
]

const ALL_FUNDS = [...TARGET_FUNDS, ...ACTUAL_FUNDS]

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
    portfolio: string
    initialAmount: number
    nav: number | null
    dailyReturn: number | null
    date: string | null
    symbol?: string
    error?: string
  }[] = []

  await Promise.all(
    ALL_FUNDS.map(async (fund) => {
      try {
        const data = await fetchYahooPrice(fund.isin)
        results.push({ id: fund.id, name: fund.name, isin: fund.isin, portfolio: fund.portfolio, initialAmount: fund.initialAmount, ...data })
      } catch {
        results.push({ id: fund.id, name: fund.name, isin: fund.isin, portfolio: fund.portfolio, initialAmount: fund.initialAmount, nav: null, dailyReturn: null, date: null, error: 'Fetch failed' })
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
