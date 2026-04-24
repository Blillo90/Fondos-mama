import KpiCard from '@/components/ui/KpiCard'
import SectionHeader from '@/components/ui/SectionHeader'
import ProjectionChart from '@/components/charts/ProjectionChart'
import AllocationPie from '@/components/charts/AllocationPie'
import { createClient } from '@supabase/supabase-js'
import {
  PORTFOLIO_ACTUAL,
  PORTFOLIO_OBJETIVO,
  PROJECTIONS,
  ACTUAL_ALLOCATION,
  OBJETIVO_ALLOCATION,
  formatEUR,
  formatPct,
  CLIENT_NAME,
  INITIAL_VALUE,
} from '@/lib/constants'
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react'

async function getPortfolioSummary(portfolioId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const supabase = createClient(url, key)

  const [{ data: pFunds }, { data: fValues }] = await Promise.all([
    supabase.from('portfolio_funds').select('fund_id, initial_amount').eq('portfolio_id', portfolioId),
    supabase.from('fund_values').select('fund_id, value, date').eq('portfolio_id', portfolioId).order('date', { ascending: false }),
  ])
  if (!pFunds?.length) return null

  const latestByFund: Record<string, { value: number; date: string }> = {}
  for (const v of (fValues ?? [])) {
    if (!(v.fund_id in latestByFund)) latestByFund[v.fund_id] = { value: v.value, date: v.date }
  }

  const updatedCount = pFunds.filter((f) => f.fund_id in latestByFund).length
  if (updatedCount === 0) return null
  const total = pFunds.reduce((s, f) => s + (latestByFund[f.fund_id]?.value ?? f.initial_amount), 0)
  const latestDate = Object.values(latestByFund).map((v) => v.date).sort().at(-1) ?? null

  return { total_value: total, date: latestDate, updatedCount, totalFunds: pFunds.length }
}

export default async function Dashboard() {
  const [actual, objetivo] = await Promise.all([
    getPortfolioSummary('actual'),
    getPortfolioSummary('objetivo'),
  ])
  const savings10y = PORTFOLIO_OBJETIVO.annualSavings * 10

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2c4f]">Dashboard</h1>
          <p className="text-gray-500 mt-1">{CLIENT_NAME} · Banco Sabadell · Perfil Moderado</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Cartera total</p>
          <p className="text-3xl font-bold text-[#0f2c4f]">{formatEUR(INITIAL_VALUE)}</p>
          <p className="text-xs text-gray-400 mt-1">Inicio: Abril 2026</p>
        </div>
      </div>

      {/* Seguimiento real */}
      {(actual || objetivo) && (() => {
        const portfolios = [
          {
            label: 'Cartera Actual',
            data: actual,
            accent: 'text-[#0f2c4f]',
            border: 'border-slate-200',
            bg: 'bg-slate-50',
          },
          {
            label: 'Cartera Objetivo',
            data: objetivo,
            accent: 'text-emerald-700',
            border: 'border-emerald-200',
            bg: 'bg-emerald-50',
          },
        ]
        return (
          <div className="grid grid-cols-2 gap-4">
            {portfolios.map(({ label, data, accent, border, bg }) => {
              if (!data) return (
                <div key={label} className={`rounded-xl border ${border} ${bg} p-5`}>
                  <p className="text-sm font-semibold text-gray-500">{label}</p>
                  <p className="text-xs text-gray-400 mt-1">Sin datos aún — actualiza desde Admin</p>
                </div>
              )
              const gain = data.total_value - INITIAL_VALUE
              const gainPct = (gain / INITIAL_VALUE) * 100
              const Icon = gainPct > 0 ? TrendingUp : gainPct < 0 ? TrendingDown : Minus
              const gainColor = gainPct > 0 ? 'text-emerald-600' : gainPct < 0 ? 'text-red-500' : 'text-gray-500'
              return (
                <div key={label} className={`rounded-xl border ${border} ${bg} p-5`}>
                  <p className="text-sm font-semibold text-gray-600">{label}</p>
                  <p className={`text-3xl font-bold mt-1 ${accent}`}>{formatEUR(data.total_value)}</p>
                  <div className={`flex items-center gap-1.5 mt-1.5 ${gainColor}`}>
                    <Icon size={15} />
                    <span className="text-sm font-semibold">
                      {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(2)}% ({gain >= 0 ? '+' : ''}{formatEUR(gain)})
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">vs inicio {formatEUR(INITIAL_VALUE)} · {data.date} · {'updatedCount' in data ? `${data.updatedCount}/${data.totalFunds} fondos` : ''}</p>
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* Alerta urgente */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <span className="font-semibold text-amber-800">Acción urgente: </span>
          <span className="text-amber-700">
            Contactar con Sabadell para negociar clase institucional del Man Alpha Select Alternative.
            Coste actual 2.97% vs rentabilidad 2.86% → rentabilidad neta prácticamente cero.
          </span>
        </div>
      </div>

      {/* KPIs comparativos */}
      <div>
        <SectionHeader title="Comparativa de Carteras" subtitle="Cartera actual vs cartera objetivo tras la migración" />
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
              Cartera Actual · {PORTFOLIO_ACTUAL.totalFunds} fondos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <KpiCard label="Rentabilidad neta" value={formatPct(PORTFOLIO_ACTUAL.netReturn)} color="gray" />
              <KpiCard label="TER anual" value={`${PORTFOLIO_ACTUAL.ter}%`} sub="1.333 €/año" color="red" />
              <KpiCard label="Rent. bruta" value={formatPct(PORTFOLIO_ACTUAL.grossReturn)} color="gray" />
              <KpiCard label="Fondos" value={String(PORTFOLIO_ACTUAL.totalFunds)} sub="Exceso fragmentación" color="orange" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Cartera Objetivo · {PORTFOLIO_OBJETIVO.totalFunds} fondos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <KpiCard label="Rentabilidad neta" value={formatPct(PORTFOLIO_OBJETIVO.netReturn)} color="green" />
              <KpiCard label="TER anual" value={`${PORTFOLIO_OBJETIVO.ter}%`} sub="504 €/año" color="green" />
              <KpiCard label="Rent. bruta" value={formatPct(PORTFOLIO_OBJETIVO.grossReturn)} color="green" />
              <KpiCard label="Ahorro anual" value={formatEUR(PORTFOLIO_OBJETIVO.annualSavings)} sub="+0.9% extra/año" color="green" />
            </div>
          </div>
        </div>
      </div>

      {/* Proyección */}
      <div>
        <SectionHeader
          title="Proyección a 2 años"
          subtitle="Sin migrar (discontinua) vs Cartera Objetivo (sólida). Línea vertical = fin migración Oct 2026"
        />
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <ProjectionChart />
        </div>
      </div>

      {/* Hitos clave */}
      <div>
        <SectionHeader title="Hitos clave de la proyección" />
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '6 meses (Oct 2026)', ventaja: PROJECTIONS.sixMonths.ventaja, value: PROJECTIONS.sixMonths.migrando, note: 'Migración completada' },
            { label: '1 año (Abr 2027)', ventaja: PROJECTIONS.oneYear.ventaja, value: PROJECTIONS.oneYear.migrando, note: 'Primera vez +3.000€' },
            { label: '18 meses (Oct 2027)', ventaja: PROJECTIONS.eighteenMonths.ventaja, value: PROJECTIONS.eighteenMonths.migrando, note: 'Cerca de 100k€' },
            { label: '2 años (Abr 2028)', ventaja: PROJECTIONS.twoYears.ventaja, value: PROJECTIONS.twoYears.migrando, note: 'Supera 100.000€' },
          ].map((h) => (
            <div key={h.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{h.label}</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">+{formatEUR(h.ventaja)}</p>
              <p className="text-xs text-gray-500 mt-1">{formatEUR(h.value)}</p>
              <p className="text-xs text-gray-400">{h.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribución */}
      <div>
        <SectionHeader title="Distribución de activos" subtitle="Antes y después de la migración" />
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="font-medium text-gray-700 mb-1">Cartera Actual</h4>
            <p className="text-xs text-gray-400 mb-3">73% concentrado en Mixtos Sabadell</p>
            <AllocationPie data={ACTUAL_ALLOCATION} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="font-medium text-gray-700 mb-1">Cartera Objetivo</h4>
            <p className="text-xs text-gray-400 mb-3">Diversificada en 12 fondos optimizados</p>
            <AllocationPie data={OBJETIVO_ALLOCATION} />
          </div>
        </div>
      </div>

      {/* Resumen ejecutivo */}
      <div className="bg-[#0f2c4f] text-white rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3">Resumen ejecutivo</h3>
        <p className="text-blue-200 text-sm leading-relaxed">
          Migrar de {PORTFOLIO_ACTUAL.totalFunds} fondos actuales a {PORTFOLIO_OBJETIVO.totalFunds} fondos objetivo permitirá ahorrar
          aproximadamente <strong className="text-white">{formatEUR(PORTFOLIO_OBJETIVO.annualSavings)} anuales</strong> en costes,
          equivalente a un +0.9% de rentabilidad extra cada año. A 10 años, el ahorro acumulado supera los{' '}
          <strong className="text-white">{formatEUR(savings10y)}</strong> solo en comisiones. La diferencia de valor
          proyectada a 2 años es de <strong className="text-white">{formatEUR(PROJECTIONS.twoYears.ventaja)}</strong> a favor
          de migrar, incluso en el escenario pesimista con caída de mercado del -15%.
        </p>
      </div>
    </div>
  )
}
