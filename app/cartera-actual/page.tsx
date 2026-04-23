import SectionHeader from '@/components/ui/SectionHeader'
import KpiCard from '@/components/ui/KpiCard'
import FundTable from '@/components/FundTable'
import AllocationPie from '@/components/charts/AllocationPie'
import { createClient } from '@supabase/supabase-js'
import { PORTFOLIO_ACTUAL, ACTUAL_ALLOCATION, INITIAL_VALUE, formatEUR, formatPct } from '@/lib/constants'
import { PortfolioFund } from '@/lib/types'
import { AlertTriangle } from 'lucide-react'

async function getCartActual(): Promise<PortfolioFund[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []
  const supabase = createClient(url, key)

  const [{ data: funds }, { data: values }] = await Promise.all([
    supabase
      .from('portfolio_funds')
      .select('*, fund:funds(*)')
      .eq('portfolio_id', 'actual')
      .order('initial_amount', { ascending: false }),
    supabase
      .from('fund_values')
      .select('fund_id, value, date')
      .eq('portfolio_id', 'actual')
      .order('date', { ascending: false }),
  ])

  const latestByFund: Record<string, number> = {}
  for (const v of (values ?? [])) {
    if (!(v.fund_id in latestByFund)) latestByFund[v.fund_id] = v.value
  }

  return ((funds ?? []) as PortfolioFund[]).map((f) => ({
    ...f,
    currentValue: latestByFund[f.fund_id] ?? undefined,
  }))
}

async function getLatestSnapshot(portfolioId: string): Promise<number | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const supabase = createClient(url, key)
  const { data } = await supabase
    .from('portfolio_snapshots')
    .select('total_value, date')
    .eq('portfolio_id', portfolioId)
    .order('date', { ascending: false })
    .limit(1)
    .single()
  return data?.total_value ?? null
}

export default async function CarteraActualPage() {
  const [funds, currentTotal] = await Promise.all([
    getCartActual(),
    getLatestSnapshot('actual'),
  ])
  const initialValue = INITIAL_VALUE
  const updatedCount = funds.filter((f) => f.currentValue != null).length
  // Use currentValue if available, fall back to initial_amount for non-updated funds
  const displayTotal = funds.length > 0
    ? funds.reduce((s, f) => s + (f.currentValue ?? f.initial_amount), 0)
    : initialValue
  // Only show gain if at least some funds are updated; otherwise the number is misleading
  const gainAbs = updatedCount > 0 ? displayTotal - initialValue : null
  const gainPct = gainAbs !== null ? (gainAbs / initialValue) * 100 : null
  const weightedReturn = 1.79
  const weightedCost = 1.45

  const problems = [
    {
      title: 'Concentración excesiva',
      desc: 'El 73% (66.897€) está en fondos mixtos Sabadell (Prudente 42.977€, Consolida 94 10.450€). Poca exposición a renta variable.',
      severity: 'high',
    },
    {
      title: 'Fragmentación innecesaria',
      desc: '49 fondos para 91.665€ = media 1.870€/fondo. Muchas posiciones < 500€ son irrelevantes para el rendimiento.',
      severity: 'medium',
    },
    {
      title: 'Costes elevados',
      desc: 'En 2025 se pagaron 1.332€ en comisiones (1.45%). Man Alpha costó 2.97% cuando solo ganó 2.86% → rentabilidad neta: 0.',
      severity: 'high',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2c4f]">Cartera Actual</h1>
          <p className="text-gray-500 mt-1">Banco Sabadell · {PORTFOLIO_ACTUAL.totalFunds} fondos · En proceso de migración</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Valor actual</p>
          <p className="text-2xl font-bold text-[#0f2c4f]">{formatEUR(displayTotal)}</p>
          {gainPct !== null && (
            <p className={`text-sm font-semibold mt-0.5 ${gainPct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(2)}% ({gainAbs! >= 0 ? '+' : ''}{formatEUR(gainAbs!)})
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">Inicial: {formatEUR(initialValue)} · {updatedCount}/{funds.length} fondos actualizados</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Rentabilidad neta" value={formatPct(weightedReturn)} sub="Neta de comisiones" color="gray" />
        <KpiCard label="TER anual" value={formatPct(weightedCost)} sub="1.333€/año" color="red" />
        <KpiCard label="Fondos" value={String(PORTFOLIO_ACTUAL.totalFunds)} sub="Demasiada fragmentación" color="orange" />
        <KpiCard label="Incentivos banco" value="380€" sub="Pagados a Sabadell 2025" color="red" />
      </div>

      {/* Problemas */}
      <div>
        <SectionHeader title="Problemas identificados" subtitle="Diagnóstico de la cartera actual (ejercicio 2025)" />
        <div className="space-y-3">
          {problems.map((p) => (
            <div key={p.title} className={`flex gap-3 p-4 rounded-xl border ${
              p.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <AlertTriangle size={18} className={p.severity === 'high' ? 'text-red-500' : 'text-amber-500'} />
              <div>
                <p className="font-semibold text-sm text-gray-800">{p.title}</p>
                <p className="text-sm text-gray-600 mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-medium text-gray-700 mb-3">Distribución por activo</h4>
          <AllocationPie data={ACTUAL_ALLOCATION} height={260} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-medium text-gray-700 mb-4">Métricas 2025</h4>
          <div className="space-y-3">
            {[
              { label: 'Coste total anual', value: '1.333 €', sub: '1.45% del saldo medio', bad: true },
              { label: 'Rentabilidad Sabadell Prudente', value: '+4.46%', sub: 'Fondo principal (42.977€)', bad: false },
              { label: 'Coste Man Alpha Select', value: '2.97%', sub: 'Ganó solo 2.86% → neto ≈ 0%', bad: true },
              { label: 'Incentivos pagados al banco', value: '380 €', sub: 'Retrocesiones a Sabadell', bad: true },
              { label: 'Posiciones < 500€', value: '~20 fondos', sub: 'Irrelevantes pero con coste', bad: true },
            ].map((m) => (
              <div key={m.label} className="flex justify-between items-start py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">{m.label}</p>
                  <p className="text-xs text-gray-400">{m.sub}</p>
                </div>
                <span className={`font-bold text-sm ${m.bad ? 'text-red-600' : 'text-emerald-600'}`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de fondos */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionHeader
          title={`Composición detallada · ${funds.length > 0 ? funds.length : PORTFOLIO_ACTUAL.totalFunds} fondos`}
          subtitle="Ordenados por importe. Conecta Supabase para ver datos en tiempo real."
        />
        {funds.length > 0 ? (
          <FundTable funds={funds} showCagr showTer showRent2025 showCurrentValue />
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">Conecta Supabase para ver los fondos en tiempo real.</p>
            <p className="text-xs mt-1">Ver instrucciones en el README o en la página de Actualizar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
