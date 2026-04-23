export const dynamic = 'force-dynamic'

import SectionHeader from '@/components/ui/SectionHeader'
import KpiCard from '@/components/ui/KpiCard'
import FundTable from '@/components/FundTable'
import AllocationPie from '@/components/charts/AllocationPie'
import { createClient } from '@supabase/supabase-js'
import { PORTFOLIO_OBJETIVO, OBJETIVO_ALLOCATION, INITIAL_VALUE, formatEUR, formatPct } from '@/lib/constants'
import { PortfolioFund } from '@/lib/types'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'

async function getCartObjetivo(): Promise<PortfolioFund[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []
  const supabase = createClient(url, key)

  const [{ data: funds }, { data: values }] = await Promise.all([
    supabase
      .from('portfolio_funds')
      .select('*, fund:funds(*)')
      .eq('portfolio_id', 'objetivo')
      .order('initial_amount', { ascending: false }),
    supabase
      .from('fund_values')
      .select('fund_id, value, date')
      .eq('portfolio_id', 'objetivo')
      .order('date', { ascending: false }),
  ])

  // Latest value per fund_id
  const latestByFund: Record<string, number> = {}
  for (const v of (values ?? [])) {
    if (!(v.fund_id in latestByFund)) latestByFund[v.fund_id] = v.value
  }

  return ((funds ?? []) as PortfolioFund[]).map((f) => ({
    ...f,
    currentValue: latestByFund[f.fund_id] ?? undefined,
  }))
}

const fundAnalysis = [
  {
    name: 'Eleva European Selection',
    cagr: 10.3, sharpe: 0.48, status: 'core',
    note: 'Núcleo de cartera. Mejor rentabilidad ajustada a riesgo del grupo.',
  },
  {
    name: 'Atlas Global Infrastructure',
    cagr: 9.1, sharpe: 0.50, status: 'core',
    note: 'Mejor Sharpe de toda la cartera. Infraestructura como activo real.',
  },
  {
    name: 'OFI Precious Metals',
    cagr: 8.6, sharpe: 0.33, status: 'core',
    note: 'Cobertura contra inflación. +60% en 2025 (año excepcional).',
  },
  {
    name: 'MFS Meridian EM Debt',
    cagr: 7.9, sharpe: 0.94, status: 'watch',
    note: 'Mayor Sharpe de RF. Solo 3 años de datos. Vigilar exposición emergente.',
  },
  {
    name: 'JPMorgan US Equity Focus',
    cagr: 8.0, sharpe: null, status: 'core',
    note: '+6.80% en 2025 vs -1.54% del JPM America Equity actual. +8.34 pp de diferencia.',
  },
  {
    name: 'Man Alpha Select Alternative',
    cagr: 5.5, sharpe: 0.44, status: 'urgent',
    note: 'URGENTE: Coste 2.97% vs ganancia 2.86%. Negociar clase I (objetivo: 0.5-0.8%).',
  },
  {
    name: 'Amundi US Equity Value R2',
    cagr: 6.7, sharpe: 0.26, status: 'watch',
    note: 'Solo +2.58% en 2025. Value vs Growth. A largo plazo sólido. Vigilar 2026.',
  },
  {
    name: 'NB Short Duration Bond',
    cagr: 2.3, sharpe: -0.79, status: 'ok',
    note: 'RF corto plazo. Sharpe negativo histórico pero útil con tipos altos actuales.',
  },
  {
    name: 'Schroder Euro Credit',
    cagr: 1.1, sharpe: -0.63, status: 'consider',
    note: 'Bajo Euribor. Considerar reducir peso cuando BCE baje tipos significativamente.',
  },
]

async function getLatestSnapshot(portfolioId: string): Promise<number | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const supabase = createClient(url, key)
  const { data } = await supabase
    .from('portfolio_snapshots')
    .select('total_value')
    .eq('portfolio_id', portfolioId)
    .order('date', { ascending: false })
    .limit(1)
    .single()
  return data?.total_value ?? null
}

export default async function CarteraObjetivoPage() {
  const [funds, currentTotal] = await Promise.all([
    getCartObjetivo(),
    getLatestSnapshot('objetivo'),
  ])
  const displayTotal = (currentTotal ?? funds.reduce((s, f) => s + (f.currentValue ?? f.initial_amount), 0)) || INITIAL_VALUE
  const gainAbs = currentTotal ? currentTotal - INITIAL_VALUE : null
  const gainPct = gainAbs !== null ? (gainAbs / INITIAL_VALUE) * 100 : null

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2c4f]">Cartera Objetivo</h1>
          <p className="text-gray-500 mt-1">12 fondos optimizados · Perfil moderado · TER 0.55%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Valor actual</p>
          <p className="text-2xl font-bold text-emerald-700">{formatEUR(displayTotal)}</p>
          {gainPct !== null && (
            <p className={`text-sm font-semibold mt-0.5 ${gainPct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(2)}% ({gainAbs! >= 0 ? '+' : ''}{formatEUR(gainAbs!)})
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">Inicial: {formatEUR(INITIAL_VALUE)}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Rentabilidad neta" value={formatPct(PORTFOLIO_OBJETIVO.netReturn)} sub="Tras costes" color="green" />
        <KpiCard label="TER anual" value={formatPct(PORTFOLIO_OBJETIVO.ter)} sub="504€/año" color="green" />
        <KpiCard label="Ahorro vs actual" value={formatEUR(PORTFOLIO_OBJETIVO.annualSavings)} sub="+0.9%/año" color="green" />
        <KpiCard label="Fondos" value={String(PORTFOLIO_OBJETIVO.totalFunds)} sub="Vs 49 actuales" color="blue" />
      </div>

      {/* Alerta Man Alpha */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-amber-800">Ajuste urgente antes de ejecutar la migración</p>
          <p className="text-amber-700 mt-1">
            <strong>Man Alpha Select Alternative:</strong> Contactar con Sabadell para pedir acceso a la clase institucional (clase &#39;I&#39;).
            Coste actual 2.97% → objetivo 0.5-0.8%. Si no es posible, sustituir por un alternativo equivalente.
          </p>
        </div>
      </div>

      {/* Distribución y análisis */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-medium text-gray-700 mb-3">Distribución objetivo</h4>
          <AllocationPie data={OBJETIVO_ALLOCATION} height={260} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-medium text-gray-700 mb-4">Comparativa de costes</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-red-700">Cartera Actual</p>
                <p className="text-xs text-red-500">TER 1.45% · 49 fondos</p>
              </div>
              <span className="text-xl font-bold text-red-600">1.333€/año</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Cartera Objetivo</p>
                <p className="text-xs text-emerald-500">TER 0.55% · 12 fondos</p>
              </div>
              <span className="text-xl font-bold text-emerald-600">504€/año</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm font-semibold text-blue-700">Ahorro anual</p>
                <p className="text-xs text-blue-500">+0.9% rentabilidad extra</p>
              </div>
              <span className="text-xl font-bold text-blue-600">828€/año</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#0f2c4f] rounded-lg">
              <div>
                <p className="text-sm font-semibold text-white">Ahorro 10 años</p>
                <p className="text-xs text-blue-300">Con efecto compuesto</p>
              </div>
              <span className="text-xl font-bold text-white">+12.000€</span>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis fondo por fondo */}
      <div>
        <SectionHeader title="Análisis por fondo" subtitle="Clasificación por calidad y alertas" />
        <div className="space-y-2">
          {fundAnalysis.map((f) => {
            const badgeConfig = {
              core: { label: 'Núcleo', cls: 'bg-emerald-100 text-emerald-700' },
              ok: { label: 'Correcto', cls: 'bg-blue-100 text-blue-700' },
              watch: { label: 'Vigilar', cls: 'bg-amber-100 text-amber-700' },
              urgent: { label: 'URGENTE', cls: 'bg-red-100 text-red-700' },
              consider: { label: 'Revisar', cls: 'bg-gray-100 text-gray-700' },
            }[f.status] ?? { label: 'Info', cls: 'bg-gray-100 text-gray-700' }
            return (
              <div key={f.name} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4">
                {f.status === 'urgent' && <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />}
                {f.status === 'core' && <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />}
                {['ok', 'watch', 'consider'].includes(f.status) && <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-800">{f.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeConfig.cls}`}>
                      {badgeConfig.label}
                    </span>
                    {f.cagr && (
                      <span className="text-xs text-emerald-600 font-medium">CAGR +{f.cagr}%</span>
                    )}
                    {f.sharpe != null && (
                      <span className={`text-xs font-medium ${f.sharpe >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                        Sharpe {f.sharpe >= 0 ? '+' : ''}{f.sharpe}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{f.note}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabla de fondos */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionHeader title="Composición objetivo · 12 fondos" subtitle="Pesos y datos de rentabilidad histórica" />
        {funds.length > 0 ? (
          <FundTable funds={funds} showCagr showSharpe showTer showRent2025 showCurrentValue />
        ) : (
          <p className="text-center py-8 text-gray-400 text-sm">
            Conecta Supabase para ver los fondos en tiempo real.
          </p>
        )}
      </div>
    </div>
  )
}
