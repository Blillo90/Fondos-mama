import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TARGET_FUNDS = [
  { id: 'nb-short-duration',         name: 'NB Short Duration Bond',         isin: 'IE00BFZMJT78', portfolio: 'objetivo', initialAmount: 18988 },
  { id: 'schroder-euro-credit',       name: 'Schroder Euro Credit',            isin: 'LU2080996049', portfolio: 'objetivo', initialAmount: 12658 },
  { id: 'jpm-us-equity-focus',        name: 'JPMorgan US Equity Focus',        isin: 'LU2510715605', portfolio: 'objetivo', initialAmount: 14768 },
  { id: 'amundi-us-equity-value',     name: 'Amundi US Equity Value R2',       isin: 'LU1894686523', portfolio: 'objetivo', initialAmount: 8439  },
  { id: 'eleva-european',             name: 'Eleva European Selection',        isin: 'LU1111643042', portfolio: 'objetivo', initialAmount: 9494  },
  { id: 'sabadell-euroaccion',        name: 'Sabadell Euroacción',             isin: 'ES0111098002', portfolio: 'objetivo', initialAmount: 4219  },
  { id: 'mfs-meridian-em-debt',       name: 'MFS Meridian EM Debt',            isin: 'LU0583240782', portfolio: 'objetivo', initialAmount: 4747  },
  { id: 'nb-em-debt-hard',            name: 'NB EM Debt Hard CCY',             isin: 'IE00B986G486', portfolio: 'objetivo', initialAmount: 4430  },
  { id: 'ofi-precious-metals',        name: 'OFI Precious Metals',             isin: 'FR0011170786', portfolio: 'objetivo', initialAmount: 5802  },
  { id: 'man-alpha-alternative',      name: 'Man Alpha Select Alternative',    isin: 'IE00B3LJVG97', portfolio: 'objetivo', initialAmount: 1793  },
  { id: 'atlas-infrastructure',       name: 'Atlas Global Infrastructure',     isin: 'IE000NPCPQI2', portfolio: 'objetivo', initialAmount: 1582  },
  { id: 'sabadell-prudente-residual', name: 'Sabadell Prudente (residual)',    isin: 'ES0111187003', portfolio: 'objetivo', initialAmount: 4747  },
]

const ACTUAL_FUNDS = [
  { id: 'sabadell-prudente',          name: 'Sabadell Prudente',                       isin: 'ES0111187003', portfolio: 'actual', initialAmount: 42977, participaciones: 3730.3907 },
  { id: 'sabadell-rendimiento',       name: 'Sabadell Rendimiento',                    isin: 'ES0173829039', portfolio: 'actual', initialAmount: 13470, participaciones: 1379.7434 },
  { id: 'sabadell-consolida94',       name: 'Sabadell Consolida 94',                   isin: 'ES0111203008', portfolio: 'actual', initialAmount: 10450, participaciones: 1002.3286 },
  { id: 'sabadell-interes-euro',      name: 'Sabadell Interés Euro',                   isin: 'ES0174403008', portfolio: 'actual', initialAmount: 4780,  participaciones: 478.0    },
  { id: 'sabadell-bonos-euro',        name: 'Sabadell Bonos Euro',                     isin: 'ES0173828007', portfolio: 'actual', initialAmount: 3136,  participaciones: 313.6    },
  { id: 'sabadell-sel-alternativa',   name: 'Sabadell Selección Alternativa',          isin: 'ES0182282014', portfolio: 'actual', initialAmount: 2174,  participaciones: 217.4    },
  { id: 'sabadell-euro-yield',        name: 'Sabadell Euro Yield',                     isin: 'ES0184976001', portfolio: 'actual', initialAmount: 1379,  participaciones: 137.9    },
  { id: 'bnp-bond-6m',                name: 'BNP Paribas Enhanced Bond 6M',            isin: 'LU0325598752', portfolio: 'actual', initialAmount: 929,   participaciones: 92.9     },
  { id: 'sabadell-bonos-flotantes',   name: 'Sabadell Bonos Flotantes Euro',           isin: 'ES0174356016', portfolio: 'actual', initialAmount: 788,   participaciones: 78.8     },
  { id: 'amundi-abs-responsible',     name: 'Amundi ABS Responsible',                  isin: 'FR0010319996', portfolio: 'actual', initialAmount: 742,   participaciones: 74.2     },
  { id: 'mg-european-credit',         name: 'M&G European Credit QI',                  isin: 'LU2188668326', portfolio: 'actual', initialAmount: 731,   participaciones: 73.1     },
  { id: 'eurizon-euro-bond',          name: 'Eurizon Fund II Euro Bond Z',             isin: 'LU0278427041', portfolio: 'actual', initialAmount: 707,   participaciones: 70.7     },
  { id: 'sabadell-usa-bolsa',         name: 'Sabadell Estados Unidos Bolsa',           isin: 'ES0138983004', portfolio: 'actual', initialAmount: 657,   participaciones: 65.7     },
  { id: 'sabadell-bonos-sos',         name: 'Sabadell Bonos Sostenibles España',       isin: 'ES0158862021', portfolio: 'actual', initialAmount: 510,   participaciones: 51.0     },
  { id: 'axa-europe-hy',              name: 'AXA IM Europe SD High Yield',             isin: 'LU0658025209', portfolio: 'actual', initialAmount: 478,   participaciones: 47.8     },
  { id: 'muzinich-yield',             name: 'Muzinich Enhanced Yield ST',              isin: 'IE00BYXHR262', portfolio: 'actual', initialAmount: 476,   participaciones: 47.6     },
  { id: 'generali-bond',              name: 'Generali Euro Bond 1-3 Years G',          isin: 'LU1373301057', portfolio: 'actual', initialAmount: 406,   participaciones: 40.6     },
  { id: 'lazard-capital-sri',         name: 'Lazard Capital SRI SC',                   isin: 'FR0013311446', portfolio: 'actual', initialAmount: 329,   participaciones: 32.9     },
  { id: 'sabadell-dolar-fijo',        name: 'Sabadell Dólar Fijo',                     isin: 'ES0138950003', portfolio: 'actual', initialAmount: 317,   participaciones: 31.7     },
  { id: 'jpm-america-equity',         name: 'JPM America Equity',                      isin: 'LU1734444273', portfolio: 'actual', initialAmount: 294,   participaciones: 29.4     },
  { id: 'sabadell-emergente-mixto',   name: 'Sabadell Emergente Mixto Flexible',       isin: 'ES0105142006', portfolio: 'actual', initialAmount: 273,   participaciones: 27.3     },
  { id: 'axa-credit-sdx',             name: 'AXA WF Euro Credit SD X',                isin: 'LU1601096537', portfolio: 'actual', initialAmount: 261,   participaciones: 26.1     },
  { id: 'axa-credit-sdi',             name: 'AXA WF Euro Credit SD I',                isin: 'LU0227127643', portfolio: 'actual', initialAmount: 259,   participaciones: 25.9     },
  { id: 'jpm-em-local',               name: 'JPM EM Local Currency Debt',              isin: 'LU0804757648', portfolio: 'actual', initialAmount: 215,   participaciones: 21.5     },
  { id: 'amundi-abs-multi',           name: 'Amundi ABS Ret Multi-Strategy J',         isin: 'LU1882440925', portfolio: 'actual', initialAmount: 211,   participaciones: 21.1     },
  { id: 'sabadell-bolsas-emergentes', name: 'Sabadell Bolsas Emergentes',              isin: 'ES0175083007', portfolio: 'actual', initialAmount: 180,   participaciones: 18.0     },
  { id: 'sabadell-economia-digital',  name: 'Sabadell Economía Digital',               isin: 'ES0138528015', portfolio: 'actual', initialAmount: 180,   participaciones: 18.0     },
  { id: 'amundi-us-research-value',   name: 'Amundi US Equity Research Value J21',     isin: 'LU2931223932', portfolio: 'actual', initialAmount: 152,   participaciones: 15.2     },
  { id: 'sabadell-europa-futuro',     name: 'Sabadell Europa Bolsa Futuro',            isin: 'ES0183339003', portfolio: 'actual', initialAmount: 128,   participaciones: 12.8     },
  { id: 'amundi-us-growth',           name: 'Amundi US Equity Fundamental Growth J2',  isin: 'LU2732984955', portfolio: 'actual', initialAmount: 108,   participaciones: 10.8     },
  { id: 'alma-eikoh-japan',           name: 'Alma Eikoh Japan Large Cap Equity',       isin: 'LU1870374508', portfolio: 'actual', initialAmount: 102,   participaciones: 10.2     },
  { id: 'ct-us-contrarian',           name: 'CT Lux US Contrarian Core Equities ZE',  isin: 'LU0957798324', portfolio: 'actual', initialAmount: 78,    participaciones: 7.8      },
  { id: 'loomis-us-growth',           name: 'Loomis Sayles US Growth Equity S1',       isin: 'LU1435387458', portfolio: 'actual', initialAmount: 61,    participaciones: 6.1      },
  { id: 'ab-us-equity',               name: 'AB Select US Equity Portfolio S1',        isin: 'LU1764069099', portfolio: 'actual', initialAmount: 58,    participaciones: 5.8      },
  { id: 'amundi-commodities',         name: 'Amundi SF EUR Commodities R',             isin: 'LU1706853931', portfolio: 'actual', initialAmount: 54,    participaciones: 5.4      },
  { id: 'sabadell-economia-verde',    name: 'Sabadell Economía Verde',                 isin: 'ES0138529013', portfolio: 'actual', initialAmount: 53,    participaciones: 5.3      },
  { id: 'sabadell-espana-futuro',     name: 'Sabadell España Bolsa Futuro',            isin: 'ES0111092005', portfolio: 'actual', initialAmount: 3,     participaciones: 0.3      },
]

const ALL_FUNDS = [...TARGET_FUNDS, ...ACTUAL_FUNDS]

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
}

type PriceResult = {
  nav: number | null
  dailyReturn: number | null
  date: string | null
  source: string
  error?: string
}

function parseEsNumber(s: string): number {
  const cleaned = s.trim().replace(/\s/g, '')
  // "1.234,56" → thousands dot, decimal comma
  if (cleaned.includes('.') && cleaned.includes(',')) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'))
  }
  // "11,4321" → decimal comma only
  if (/^\d+,\d+$/.test(cleaned)) return parseFloat(cleaned.replace(',', '.'))
  return parseFloat(cleaned)
}

function parseDateES(dateStr: string): string | null {
  const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

// -----------------------------------------------
// SOURCE 1: Morningstar ES — search + snapshot HTML
// -----------------------------------------------
async function fetchMorningstar(isin: string): Promise<PriceResult> {
  try {
    const searchRes = await fetch(
      `https://www.morningstar.es/es/util/SecuritySearch.ashx?rows=5&securityTypes=FO%2CETF&term=${encodeURIComponent(isin)}&languageId=es-ES`,
      { headers: FETCH_HEADERS, cache: 'no-store' }
    )
    if (!searchRes.ok) return { nav: null, dailyReturn: null, date: null, source: 'morningstar', error: `Search ${searchRes.status}` }

    let searchData: Array<{ i: string; n: string; t: string }>
    try { searchData = await searchRes.json() } catch {
      return { nav: null, dailyReturn: null, date: null, source: 'morningstar', error: 'Search JSON error' }
    }

    const mstarId = searchData?.[0]?.i
    if (!mstarId) return { nav: null, dailyReturn: null, date: null, source: 'morningstar', error: 'Not in Morningstar' }

    await new Promise(r => setTimeout(r, 100))

    const snapRes = await fetch(
      `https://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=${mstarId}&tab=0`,
      { headers: FETCH_HEADERS, cache: 'no-store' }
    )
    if (!snapRes.ok) return { nav: null, dailyReturn: null, date: null, source: 'morningstar', error: `Snapshot ${snapRes.status}` }

    const html = await snapRes.text()

    // NAV patterns — Morningstar ES wraps the price in a <p id="Col0NaV"> or similar
    const navPatterns = [
      /id="Col0NaV"[^>]*>\s*([\d.,]+)\s*</,
      /Col0NaV">([\d.,]+)</,
      /"price"[^>]*>\s*([\d.,]+)\s*</,
    ]
    let nav: number | null = null
    for (const pat of navPatterns) {
      const m = html.match(pat)
      if (m) {
        const n = parseEsNumber(m[1])
        if (!isNaN(n) && n > 0.001) { nav = n; break }
      }
    }

    // Daily return (1-day % change)
    const retPatterns = [
      /id="Col0DReturn1D"[^>]*>\s*([-\d.,]+)\s*</,
      /id="Col0DReturn1W"[^>]*>\s*([-\d.,]+)\s*</,
    ]
    let dailyReturn: number | null = null
    for (const pat of retPatterns) {
      const m = html.match(pat)
      if (m) {
        const n = parseEsNumber(m[1])
        if (!isNaN(n)) { dailyReturn = n; break }
      }
    }

    // NAV date
    let date: string | null = null
    const dateMatch = html.match(/id="Col0NaVDate"[^>]*>\s*(\d{2}\/\d{2}\/\d{4})\s*</)
                   ?? html.match(/(\d{2}\/\d{2}\/\d{4})/)
    if (dateMatch) date = parseDateES(dateMatch[1])
    if (!date) date = new Date().toISOString().split('T')[0]

    if (nav === null) return { nav: null, dailyReturn: null, date: null, source: 'morningstar', error: 'NAV not parsed' }

    return { nav, dailyReturn, date, source: 'morningstar' }
  } catch (e) {
    return { nav: null, dailyReturn: null, date: null, source: 'morningstar', error: String(e) }
  }
}

// -----------------------------------------------
// SOURCE 2: Yahoo Finance
// -----------------------------------------------
async function fetchYahoo(isin: string): Promise<PriceResult> {
  try {
    const searchRes = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${isin}&lang=es-ES&region=ES&quotesCount=6&newsCount=0&listsCount=0`,
      { headers: FETCH_HEADERS, cache: 'no-store' }
    )
    if (!searchRes.ok) return { nav: null, dailyReturn: null, date: null, source: 'yahoo', error: `Search ${searchRes.status}` }

    const searchJson = await searchRes.json()
    const quotes: Array<{ symbol: string; quoteType?: string }> = searchJson?.quotes ?? []
    const match = quotes.find(q => q.quoteType === 'MUTUALFUND')
                ?? quotes.find(q => q.quoteType === 'ETF')
                ?? quotes[0]
    const symbol = match?.symbol
    if (!symbol) return { nav: null, dailyReturn: null, date: null, source: 'yahoo', error: 'No symbol' }

    const quoteRes = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
      { headers: FETCH_HEADERS, cache: 'no-store' }
    )
    if (!quoteRes.ok) return { nav: null, dailyReturn: null, date: null, source: 'yahoo', error: `Quote ${quoteRes.status}` }

    const quoteData = await quoteRes.json()
    const meta = quoteData?.chart?.result?.[0]?.meta
    if (!meta) return { nav: null, dailyReturn: null, date: null, source: 'yahoo', error: 'No meta' }

    const nav: number | null = meta.regularMarketPrice ?? null
    const prev: number | null = meta.chartPreviousClose ?? meta.previousClose ?? null
    const dailyReturn = nav !== null && prev ? ((nav - prev) / prev) * 100 : null
    const ts: number | null = meta.regularMarketTime ?? null
    const date = ts ? new Date(ts * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

    return { nav, dailyReturn, date, source: 'yahoo' }
  } catch (e) {
    return { nav: null, dailyReturn: null, date: null, source: 'yahoo', error: String(e) }
  }
}

// -----------------------------------------------
// Concurrency-limited execution
// -----------------------------------------------
async function withConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit = 4
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let idx = 0
  async function worker() {
    while (idx < items.length) {
      const i = idx++
      results[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

type FundInput = (typeof ALL_FUNDS)[0]

async function fetchFundPrice(fund: FundInput) {
  const mstar = await fetchMorningstar(fund.isin)
  if (mstar.nav !== null) return { ...fund, ...mstar }

  await new Promise(r => setTimeout(r, 150))

  const yahoo = await fetchYahoo(fund.isin)
  if (yahoo.nav !== null) return { ...fund, ...yahoo }

  return {
    ...fund,
    nav: null as number | null,
    dailyReturn: null as number | null,
    date: null as string | null,
    source: 'none',
    error: `MS: ${mstar.error ?? '?'} | YF: ${yahoo.error ?? '?'}`,
  }
}

export async function GET() {
  const results = await withConcurrency(ALL_FUNDS, fetchFundPrice, 4)

  const found = results.filter(r => r.nav !== null).length
  const total = results.length

  return NextResponse.json({
    results,
    summary: { found, total, pct: Math.round((found / total) * 100) },
    fetchedAt: new Date().toISOString(),
  })
}
