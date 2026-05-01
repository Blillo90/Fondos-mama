'use client'

import { useState, useEffect } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import { Save, Info, RefreshCw, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

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

const ACTUAL_FUNDS = [
  { id: 'sabadell-prudente',         name: 'Sabadell Prudente',                       isin: 'ES0111187003', initialAmount: 42977,  participaciones: 3730.3907 },
  { id: 'sabadell-rendimiento',      name: 'Sabadell Rendimiento',                    isin: 'ES0173829039', initialAmount: 13470,  participaciones: 1379.7434 },
  { id: 'sabadell-consolida94',      name: 'Sabadell Consolida 94',                   isin: 'ES0111203008', initialAmount: 10450,  participaciones: 1002.3286 },
  { id: 'sabadell-interes-euro',     name: 'Sabadell Interés Euro',                   isin: 'ES0174403008', initialAmount: 4780,   participaciones: 478.0 },
  { id: 'sabadell-bonos-euro',       name: 'Sabadell Bonos Euro',                     isin: 'ES0173828007', initialAmount: 3136,   participaciones: 313.6 },
  { id: 'sabadell-sel-alternativa',  name: 'Sabadell Selección Alternativa',          isin: 'ES0182282014', initialAmount: 2174,   participaciones: 217.4 },
  { id: 'sabadell-euro-yield',       name: 'Sabadell Euro Yield',                     isin: 'ES0184976001', initialAmount: 1379,   participaciones: 137.9 },
  { id: 'bnp-bond-6m',               name: 'BNP Paribas Enhanced Bond 6M',            isin: 'LU0325598752', initialAmount: 929,    participaciones: 92.9 },
  { id: 'sabadell-bonos-flotantes',  name: 'Sabadell Bonos Flotantes Euro',           isin: 'ES0174356016', initialAmount: 788,    participaciones: 78.8 },
  { id: 'amundi-abs-responsible',    name: 'Amundi ABS Responsible',                  isin: 'FR0010319996', initialAmount: 742,    participaciones: 74.2 },
  { id: 'mg-european-credit',        name: 'M&G European Credit QI',                  isin: 'LU2188668326', initialAmount: 731,    participaciones: 73.1 },
  { id: 'eurizon-euro-bond',         name: 'Eurizon Fund II Euro Bond Z',             isin: 'LU0278427041', initialAmount: 707,    participaciones: 70.7 },
  { id: 'sabadell-usa-bolsa',        name: 'Sabadell Estados Unidos Bolsa',           isin: 'ES0138983004', initialAmount: 657,    participaciones: 65.7 },
  { id: 'sabadell-bonos-sos',        name: 'Sabadell Bonos Sostenibles España',       isin: 'ES0158862021', initialAmount: 510,    participaciones: 51.0 },
  { id: 'axa-europe-hy',             name: 'AXA IM Europe SD High Yield',             isin: 'LU0658025209', initialAmount: 478,    participaciones: 47.8 },
  { id: 'muzinich-yield',            name: 'Muzinich Enhanced Yield ST',              isin: 'IE00BYXHR262', initialAmount: 476,    participaciones: 47.6 },
  { id: 'generali-bond',             name: 'Generali Euro Bond 1-3 Years G',         isin: 'LU1373301057', initialAmount: 406,    participaciones: 40.6 },
  { id: 'lazard-capital-sri',        name: 'Lazard Capital SRI SC',                   isin: 'FR0013311446', initialAmount: 329,    participaciones: 32.9 },
  { id: 'sabadell-dolar-fijo',       name: 'Sabadell Dólar Fijo',                     isin: 'ES0138950003', initialAmount: 317,    participaciones: 31.7 },
  { id: 'jpm-america-equity',        name: 'JPM America Equity',                      isin: 'LU1734444273', initialAmount: 294,    participaciones: 29.4 },
  { id: 'sabadell-emergente-mixto',  name: 'Sabadell Emergente Mixto Flexible',       isin: 'ES0105142006', initialAmount: 273,    participaciones: 27.3 },
  { id: 'axa-credit-sdx',            name: 'AXA WF Euro Credit SD X',                isin: 'LU1601096537', initialAmount: 261,    participaciones: 26.1 },
  { id: 'axa-credit-sdi',            name: 'AXA WF Euro Credit SD I',                isin: 'LU0227127643', initialAmount: 259,    participaciones: 25.9 },
  { id: 'jpm-em-local',              name: 'JPM EM Local Currency Debt',              isin: 'LU0804757648', initialAmount: 215,    participaciones: 21.5 },
  { id: 'amundi-abs-multi',          name: 'Amundi ABS Ret Multi-Strategy J',         isin: 'LU1882440925', initialAmount: 211,    participaciones: 21.1 },
  { id: 'sabadell-bolsas-emergentes',name: 'Sabadell Bolsas Emergentes',              isin: 'ES0175083007', initialAmount: 180,    participaciones: 18.0 },
  { id: 'sabadell-economia-digital', name: 'Sabadell Economía Digital',               isin: 'ES0138528015', initialAmount: 180,    participaciones: 18.0 },
  { id: 'amundi-us-research-value',  name: 'Amundi US Equity Research Value J21',    isin: 'LU2931223932', initialAmount: 152,    participaciones: 15.2 },
  { id: 'sabadell-europa-futuro',    name: 'Sabadell Europa Bolsa Futuro',            isin: 'ES0183339003', initialAmount: 128,    participaciones: 12.8 },
  { id: 'amundi-us-growth',          name: 'Amundi US Equity Fundamental Growth J2', isin: 'LU2732984955', initialAmount: 108,    participaciones: 10.8 },
  { id: 'alma-eikoh-japan',          name: 'Alma Eikoh Japan Large Cap Equity',       isin: 'LU1870374508', initialAmount: 102,    participaciones: 10.2 },
  { id: 'ct-us-contrarian',          name: 'CT Lux US Contrarian Core Equities ZE',  isin: 'LU0957798324', initialAmount: 78,     participaciones: 7.8 },
  { id: 'loomis-us-growth',          name: 'Loomis Sayles US Growth Equity S1',       isin: 'LU1435387458', initialAmount: 61,     participaciones: 6.1 },
  { id: 'ab-us-equity',              name: 'AB Select US Equity Portfolio S1',        isin: 'LU1764069099', initialAmount: 58,     participaciones: 5.8 },
  { id: 'amundi-commodities',        name: 'Amundi SF EUR Commodities R',             isin: 'LU1706853931', initialAmount: 54,     participaciones: 5.4 },
  { id: 'sabadell-economia-verde',   name: 'Sabadell Economía Verde',                 isin: 'ES0138529013', initialAmount: 53,     participaciones: 5.3 },
  { id: 'sabadell-espana-futuro',    name: 'Sabadell España Bolsa Futuro',            isin: 'ES0111092005', initialAmount: 3,      participaciones: 0.3 },
]

export default function AdminPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [objetivoValues, setObjetivoValues] = useState<Record<string, string>>({})
  const [actualFundValues, setActualFundValues] = useState<Record<string, string>>({})
  const [showActualFunds, setShowActualFunds] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetchResults, setFetchResults] = useState<{ id: string; name: string; nav: number | null; dailyReturn: number | null; date: string | null; error?: string }[] | null>(null)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    fetch('/api/latest-fund-values')
      .then((r) => r.json())
      .then((data) => {
        if (data.objetivo && Object.keys(data.objetivo).length > 0) {
          setObjetivoValues(data.objetivo)
        }
        if (data.actual && Object.keys(data.actual).length > 0) {
          // Stored values are total €; convert to NAV for funds with participaciones
          const converted = { ...data.actual }
          ACTUAL_FUNDS.forEach((f) => {
            if (f.participaciones && converted[f.id]) {
              const total = parseFloat(converted[f.id])
              if (!isNaN(total) && total > 0) {
                converted[f.id] = (total / f.participaciones).toFixed(4)
              }
            }
          })
          setActualFundValues(converted)
        }
      })
      .catch(() => {})
  }, [])

  const objetivoTotal = Object.values(objetivoValues).reduce((s, v) => s + (parseFloat(v) || 0), 0)

  // For funds with participaciones, the input is NAV; convert to total for display/save
  const getActualFundTotal = (fund: typeof ACTUAL_FUNDS[0]) => {
    const v = parseFloat(actualFundValues[fund.id] ?? '')
    if (isNaN(v) || v <= 0) return 0
    return fund.participaciones ? v * fund.participaciones : v
  }
  const actualFundsTotal = ACTUAL_FUNDS.reduce((s, f) => s + getActualFundTotal(f), 0)

  const handleFetchPrices = async () => {
    setFetching(true)
    setFetchError('')
    setFetchResults(null)
    try {
      const res = await fetch('/api/fetch-prices')
      if (!res.ok) throw new Error('Error al obtener precios')
      const data = await res.json()
      const results = data.results as { id: string; name: string; nav: number | null; dailyReturn: number | null; date: string | null; portfolio?: string; initialAmount?: number; error?: string }[]
      setFetchResults(results.filter((r) => r.portfolio === 'objetivo'))

      const newObjetivoValues: Record<string, string> = {}
      const newActualValues: Record<string, string> = {}

      results.forEach((r) => {
        if (r.nav === null) return
        if (r.portfolio === 'objetivo') {
          const fund = TARGET_FUNDS.find((f) => f.id === r.id)
          if (fund) {
            const prev = parseFloat(objetivoValues[r.id] ?? '')
            if (!isNaN(prev) && prev > 0 && r.dailyReturn !== null) {
              newObjetivoValues[r.id] = (prev * (1 + r.dailyReturn / 100)).toFixed(2)
            } else if ((isNaN(prev) || prev === 0) && r.initialAmount) {
              newObjetivoValues[r.id] = r.initialAmount.toFixed(2)
            }
          }
        } else if (r.portfolio === 'actual') {
          const fund = ACTUAL_FUNDS.find((f) => f.id === r.id)
          const parts = fund?.participaciones
          const prev = parseFloat(actualFundValues[r.id] ?? '')
          if (parts) {
            // Input is NAV — apply daily return directly to NAV
            if (!isNaN(prev) && prev > 0 && r.dailyReturn !== null) {
              newActualValues[r.id] = (prev * (1 + r.dailyReturn / 100)).toFixed(4)
            } else if ((isNaN(prev) || prev === 0) && r.initialAmount && r.dailyReturn !== null) {
              const initialNav = r.initialAmount / parts
              newActualValues[r.id] = (initialNav * (1 + r.dailyReturn / 100)).toFixed(4)
            }
          } else {
            // Input is total €
            if (!isNaN(prev) && prev > 0 && r.dailyReturn !== null) {
              newActualValues[r.id] = (prev * (1 + r.dailyReturn / 100)).toFixed(2)
            } else if ((isNaN(prev) || prev === 0) && r.initialAmount && r.dailyReturn !== null) {
              newActualValues[r.id] = (r.initialAmount * (1 + r.dailyReturn / 100)).toFixed(2)
            }
          }
        }
      })

      if (Object.keys(newObjetivoValues).length > 0) {
        setObjetivoValues((prev) => ({ ...prev, ...newObjetivoValues }))
      }
      if (Object.keys(newActualValues).length > 0) {
        setActualFundValues((prev) => ({ ...prev, ...newActualValues }))
        setShowActualFunds(true)
      }
    } catch (e: unknown) {
      setFetchError(e instanceof Error ? e.message : 'Error al obtener precios')
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async () => {
    if (!date) { setError('Selecciona una fecha'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          actualTotal: actualFundsTotal > 0 ? actualFundsTotal : 0,
          // Convert NAV inputs → total € for funds with participaciones
          actualFundValues: Object.fromEntries(
            ACTUAL_FUNDS
              .map((f) => {
                const total = getActualFundTotal(f)
                return total > 0 ? [f.id, String(total.toFixed(2))] : null
              })
              .filter(Boolean) as [string, string][]
          ),
          objetivoValues,
          objetivoTotal,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2c4f]">Actualizar Valores Diarios</h1>
        <p className="text-gray-500 mt-1">Introduce los valores actuales de cada fondo para el seguimiento diario</p>
      </div>

      {/* Info Supabase */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold">Necesitas configurar Supabase</p>
          <p className="mt-1">
            1. Crea un proyecto en <strong>supabase.com</strong><br />
            2. Ejecuta el archivo <code className="bg-blue-100 px-1 rounded">supabase/schema.sql</code><br />
            3. Añade las variables de entorno en Vercel:<br />
            <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
            <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          </p>
        </div>
      </div>

      {/* Fecha */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del registro</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cartera Actual - fondos individuales colapsable */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <button
          onClick={() => setShowActualFunds(!showActualFunds)}
          className="w-full flex items-center justify-between"
        >
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm">Cartera Actual · {ACTUAL_FUNDS.length} fondos</p>
            <p className="text-xs text-gray-400 mt-0.5">Valor actual de cada fondo en Banco Sabadell</p>
          </div>
          <div className="flex items-center gap-3">
            {actualFundsTotal > 0 && (
              <span className="text-sm font-semibold text-[#0f2c4f]">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(actualFundsTotal)}
              </span>
            )}
            {showActualFunds ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </div>
        </button>

        {showActualFunds && (
          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            {ACTUAL_FUNDS.map((f) => {
              const isNav = !!f.participaciones
              const inputVal = actualFundValues[f.id] ?? ''
              const parsedInput = parseFloat(inputVal)
              const computedTotal = isNav && !isNaN(parsedInput) && parsedInput > 0
                ? parsedInput * f.participaciones!
                : null
              const placeholderNav = isNav
                ? (f.initialAmount / f.participaciones!).toFixed(4)
                : String(f.initialAmount)
              return (
                <div key={f.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400 font-mono">
                      {f.isin}
                      {isNav
                        ? ` · ${f.participaciones!.toFixed(2)} part.`
                        : ` · ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(f.initialAmount)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {computedTotal !== null && (
                      <span className="text-xs text-gray-500 tabular-nums">
                        = {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(computedTotal)}
                      </span>
                    )}
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400 text-xs">{isNav ? 'VL' : '€'}</span>
                      <input
                        type="number"
                        value={inputVal}
                        onChange={(e) => setActualFundValues((prev) => ({ ...prev, [f.id]: e.target.value }))}
                        placeholder={placeholderNav}
                        className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            {actualFundsTotal > 0 && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 font-semibold">
                <span className="text-sm text-gray-700">Total Cartera Actual</span>
                <span className="text-[#0f2c4f]">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(actualFundsTotal)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auto-fetch prices */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionHeader
          title="Obtener Precios Automáticamente"
          subtitle="Consulta el valor liquidativo actual de cada fondo desde Yahoo Finance"
        />
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleFetchPrices}
            disabled={fetching}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 text-sm"
          >
            <RefreshCw size={15} className={fetching ? 'animate-spin' : ''} />
            {fetching ? 'Obteniendo precios...' : 'Obtener VL automáticamente'}
          </button>
          <span className="text-xs text-gray-400">Los fondos publican el VL con 1–2 días hábiles de retraso</span>
        </div>

        {fetchError && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle size={15} /> {fetchError}
          </div>
        )}

        {fetchResults && (
          <div className="mt-4 space-y-2">
            {fetchResults.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-700 truncate flex-1">{r.name}</span>
                {r.nav !== null ? (
                  <div className="flex items-center gap-3 ml-2">
                    <span className="font-mono text-gray-900">{r.nav.toFixed(4)} €</span>
                    {r.dailyReturn !== null && (
                      <span className={`text-xs font-semibold ${r.dailyReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {r.dailyReturn >= 0 ? '+' : ''}{r.dailyReturn.toFixed(2)}%
                      </span>
                    )}
                    <CheckCircle size={14} className="text-emerald-500" />
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 ml-2">No disponible</span>
                )}
              </div>
            ))}
            <p className="text-xs text-gray-400 pt-1">
              Los valores de la cartera objetivo se han actualizado en los campos de abajo usando el cambio diario.
            </p>
          </div>
        )}
      </div>

      {/* Cartera Objetivo */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionHeader
          title="Cartera Objetivo"
          subtitle="Valor actual de cada fondo objetivo (consultar en Morningstar o usar el botón de arriba)"
        />
        <div className="space-y-3">
          {TARGET_FUNDS.map((f) => (
            <div key={f.id} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">{f.name}</p>
                <p className="text-xs text-gray-400 font-mono">{f.isin} · {f.weight}%</p>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 text-sm">€</span>
                <input
                  type="number"
                  value={objetivoValues[f.id] ?? ''}
                  onChange={(e) => setObjetivoValues((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  placeholder={String(Math.round(91664.82 * f.weight / 100))}
                  className="border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>
            </div>
          ))}

          {objetivoTotal > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 font-semibold">
              <span className="text-sm text-gray-700">Total Cartera Objetivo</span>
              <span className="text-emerald-600">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(objetivoTotal)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Guardar */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-[#0f2c4f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar registro'}
      </button>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
          Valores guardados correctamente en Supabase. Los gráficos se actualizarán automáticamente.
        </div>
      )}

      {/* Cómo obtener los valores */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h4 className="font-semibold text-gray-700 mb-3 text-sm">¿Dónde consultar los valores?</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Banco Sabadell Online:</strong> Mis Productos → Fondos de Inversión</li>
          <li>• <strong>Morningstar.es:</strong> Buscar por ISIN del fondo</li>
          <li>• <strong>Investing.com:</strong> Buscar el fondo por nombre o ISIN</li>
          <li>• <strong>Frecuencia recomendada:</strong> Actualizar 1 vez por semana (los fondos publican VL con 1-2 días de retardo)</li>
        </ul>
      </div>
    </div>
  )
}
