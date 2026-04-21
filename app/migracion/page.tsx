import SectionHeader from '@/components/ui/SectionHeader'
import KpiCard from '@/components/ui/KpiCard'
import MigrationProgress from '@/components/MigrationProgress'
import { createClient } from '@supabase/supabase-js'
import { MIGRATION_PHASES, MONTH_LABELS, formatEUR } from '@/lib/constants'
import { Transfer } from '@/lib/types'
import { CheckCircle2, Clock, Info } from 'lucide-react'

async function getTransfers(): Promise<Transfer[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []
  const supabase = createClient(url, key)
  const { data } = await supabase
    .from('transfers')
    .select('*, from_fund:funds!transfers_from_fund_id_fkey(*), to_fund:funds!transfers_to_fund_id_fkey(*)')
    .order('month_num', { ascending: true })
  return (data as Transfer[]) ?? []
}

const BEST_PRACTICES = [
  {
    n: 1,
    title: 'Antes del Mes 1',
    desc: 'Llamar a Sabadell para pedir acceso a la clase institucional del Man Alpha (clase \'I\'). Coste actual 2.97% es inaceptable.',
    type: 'urgent',
  },
  {
    n: 2,
    title: 'Cada semana',
    desc: 'Ejecutar ~2 traspasos por semana (no todos el mismo día). Diversifica el riesgo de entrada a precios puntuales.',
    type: 'info',
  },
  {
    n: 3,
    title: 'Siempre por TRASPASO',
    desc: 'Nunca reembolsar y volver a suscribir. Los traspasos entre fondos no tributan en IRPF (diferimiento fiscal).',
    type: 'important',
  },
  {
    n: 4,
    title: 'Revisión mensual',
    desc: 'Verificar que todos los traspasos del mes están ejecutados. En Sabadell tardan 3-7 días hábiles.',
    type: 'info',
  },
  {
    n: 5,
    title: 'Si el mercado cae > 10%',
    desc: 'Acelerar los traspasos pendientes hacia equity. Si la caída > 15%, traspasar más desde Sabadell Prudente hacia equity.',
    type: 'info',
  },
  {
    n: 6,
    title: 'Si el mercado sube > 15%',
    desc: 'Ralentizar los traspasos hacia equity esperando corrección. Los traspasos hacia renta fija no son sensibles a esto.',
    type: 'info',
  },
]

export default async function MigracionPage() {
  const transfers = await getTransfers()

  const total = transfers.length || 49
  const executed = transfers.filter((t) => t.status === 'executed').length
  const pct = total > 0 ? Math.round((executed / total) * 100) : 0
  const totalAmount = transfers.reduce((s, t) => s + t.planned_amount, 0) || 84131.45
  const executedAmount = transfers.filter(t => t.status === 'executed').reduce((s, t) => s + t.planned_amount, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2c4f]">Plan de Migración</h1>
          <p className="text-gray-500 mt-1">6 meses · Mayo–Octubre 2026 · 49 traspasos · Dollar-cost averaging</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Progreso global</p>
          <p className="text-3xl font-bold text-[#0f2c4f]">{pct}%</p>
          <p className="text-xs text-gray-400 mt-1">{executed}/{total} traspasos ejecutados</p>
        </div>
      </div>

      {/* KPIs progreso */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Traspasos ejecutados" value={`${executed}/${total}`} sub={`${pct}% completado`} color="blue" />
        <KpiCard label="Importe migrado" value={formatEUR(executedAmount)} sub={`de ${formatEUR(totalAmount)}`} color="green" />
        <KpiCard label="Pendiente migrar" value={formatEUR(totalAmount - executedAmount)} sub="en fondos actuales" color="orange" />
        <KpiCard label="Duración" value="6 meses" sub="May–Oct 2026" color="blue" />
      </div>

      {/* Barra de progreso general */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Mayo 2026</span>
          <span className="font-medium text-gray-700">{pct}% completado</span>
          <span>Octubre 2026</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Inicio: 91.664€</span>
          <span>Objetivo final: 12 fondos optimizados</span>
        </div>
      </div>

      {/* Fases */}
      <div>
        <SectionHeader title="Fases de migración" subtitle="3 fases progresivas de menor a mayor riesgo" />
        <div className="grid grid-cols-3 gap-4">
          {MIGRATION_PHASES.map((phase) => (
            <div key={phase.phase} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: phase.color }}
                >
                  {phase.phase}
                </span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Fase {phase.phase} · Meses {phase.months}</p>
                </div>
              </div>
              <p className="font-medium text-gray-700 text-sm">{phase.label}</p>
              <p className="text-xs text-gray-500 mt-1">{phase.description}</p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">{phase.transfers} traspasos</span>
                <span className="font-semibold text-gray-700">{formatEUR(phase.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estrategia */}
      <div className="bg-[#0f2c4f] text-white rounded-xl p-5">
        <h3 className="font-bold mb-2">¿Por qué 6 meses y no más ni menos?</h3>
        <p className="text-blue-200 text-sm leading-relaxed">
          Seis meses es el punto óptimo entre el riesgo de timing (hacerlo de golpe puede cristalizar una caída de mercado)
          y el coste de oportunidad (alargarlo deja el dinero en fondos ineficientes). Si el mercado cae un 15% durante la migración,
          la opción de 6 meses pierde <strong className="text-white">7.562€</strong> vs{' '}
          <strong className="text-white">13.750€</strong> si se hiciera de golpe. El plan escala los fondos de mayor riesgo
          (equity, alternativos) a los meses 5-6, cuando ya se ha validado la operativa con Sabadell.
        </p>
      </div>

      {/* Traspasos detallados */}
      <div>
        <SectionHeader
          title="Detalle de traspasos por mes"
          subtitle={transfers.length > 0 ? 'Estado actualizado desde Supabase' : 'Conecta Supabase para gestionar el estado de cada traspaso'}
        />
        {transfers.length > 0 ? (
          <MigrationProgress transfers={transfers} />
        ) : (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <div key={month} className="border border-gray-200 rounded-xl p-4 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-700">Mes {month} · {MONTH_LABELS[month].label}</span>
                  </div>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock size={14} /> Pendiente conexión Supabase
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buenas prácticas */}
      <div>
        <SectionHeader title="Buenas prácticas operativas" subtitle="Guía para maximizar el resultado durante los 6 meses" />
        <div className="grid grid-cols-2 gap-3">
          {BEST_PRACTICES.map((bp) => (
            <div key={bp.n} className={`flex gap-3 p-4 rounded-xl border ${
              bp.type === 'urgent' ? 'bg-red-50 border-red-200' :
              bp.type === 'important' ? 'bg-amber-50 border-amber-200' :
              'bg-white border-gray-200'
            }`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                bp.type === 'urgent' ? 'bg-red-500 text-white' :
                bp.type === 'important' ? 'bg-amber-500 text-white' :
                'bg-[#0f2c4f] text-white'
              }`}>{bp.n}</span>
              <div>
                <p className="font-semibold text-sm text-gray-800">{bp.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{bp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
