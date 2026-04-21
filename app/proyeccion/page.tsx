import SectionHeader from '@/components/ui/SectionHeader'
import KpiCard from '@/components/ui/KpiCard'
import ProjectionChart from '@/components/charts/ProjectionChart'
import ScenarioChart from '@/components/charts/ScenarioChart'
import { PROJECTIONS, SCENARIOS, formatEUR, formatPct } from '@/lib/constants'

export default function ProyeccionPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2c4f]">Proyección a 1 y 2 años</h1>
        <p className="text-gray-500 mt-1">
          Estimación basada en: 30% rentabilidad real 2025 + 70% CAGR histórico. No garantiza rentabilidades futuras.
        </p>
      </div>

      {/* KPIs año 1 */}
      <div>
        <SectionHeader title="Proyección a 1 año (Abril 2026 → Abril 2027)" />
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-3 font-medium">Sin migrar</p>
            <div className="grid grid-cols-2 gap-3">
              <KpiCard label="Valor final" value={formatEUR(PROJECTIONS.oneYear.sinMigrar)} color="gray" />
              <KpiCard label="Rentabilidad neta" value="+1.79%" color="gray" />
              <KpiCard label="Ganancia" value={formatEUR(PROJECTIONS.oneYear.sinMigrar - 91668)} color="gray" />
              <KpiCard label="Costes anuales" value="−1.45%" sub="1.333€" color="red" />
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-sm text-emerald-600 mb-3 font-medium">Tras migrar (cartera objetivo)</p>
            <div className="grid grid-cols-2 gap-3">
              <KpiCard label="Valor final" value={formatEUR(PROJECTIONS.oneYear.migrando)} color="green" />
              <KpiCard label="Rentabilidad neta" value="+5.26%*" color="green" />
              <KpiCard label="Ganancia" value={formatEUR(PROJECTIONS.oneYear.migrando - 91668)} color="green" />
              <KpiCard label="Costes anuales" value="−0.55%" sub="504€" color="green" />
            </div>
          </div>
        </div>
        <div className="bg-[#0f2c4f] text-white rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-300">Diferencia a 1 año a favor de migrar</p>
            <p className="text-xs text-blue-400 mt-1">* Año 1: 5.26% efectivo porque 6 meses aún en fondos actuales</p>
          </div>
          <p className="text-3xl font-bold">+{formatEUR(PROJECTIONS.oneYear.ventaja)}</p>
        </div>
      </div>

      {/* KPIs año 2 */}
      <div>
        <SectionHeader
          title="Proyección a 2 años (Abril 2026 → Abril 2028)"
          subtitle="El segundo año es donde el efecto compuesto empieza a ser realmente visible"
        />
        <div className="grid grid-cols-5 gap-4 mb-4">
          <KpiCard label="Sin migrar (2 años)" value={formatEUR(PROJECTIONS.twoYears.sinMigrar)} sub={`+${formatEUR(PROJECTIONS.twoYears.sinMigrar - 91668)}`} color="gray" />
          <KpiCard label="Migrando (2 años)" value={formatEUR(PROJECTIONS.twoYears.migrando)} sub={`+${formatEUR(PROJECTIONS.twoYears.migrando - 91668)}`} color="green" />
          <KpiCard label="Diferencia total" value={`+${formatEUR(PROJECTIONS.twoYears.ventaja)}`} sub="a favor de migrar" color="green" />
          <KpiCard label="Extra en año 2" value={`+${formatEUR(PROJECTIONS.twoYears.ventaja - PROJECTIONS.oneYear.ventaja)}`} sub="efecto compuesto" color="green" />
          <KpiCard label="Ahorro comisiones" value="+1.650€" sub="2 años acumulado" color="blue" />
        </div>
        <div className="bg-emerald-600 text-white rounded-xl p-4 text-center">
          <p className="text-sm text-emerald-100">La cartera objetivo supera los 100.000€ en el año 2</p>
          <p className="text-2xl font-bold mt-1">{formatEUR(PROJECTIONS.twoYears.migrando)}</p>
        </div>
      </div>

      {/* Gráfico proyección */}
      <div>
        <SectionHeader title="Evolución mes a mes · 24 meses" subtitle="Zona de migración: mayo–octubre 2026" />
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <ProjectionChart height={360} />
        </div>
      </div>

      {/* Hitos */}
      <div>
        <SectionHeader title="Ventaja acumulada mes a mes" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left py-3 font-medium">Momento</th>
                <th className="text-right py-3 font-medium">Sin migrar</th>
                <th className="text-right py-3 font-medium">Migrando</th>
                <th className="text-right py-3 font-medium text-emerald-600">Ventaja</th>
                <th className="text-left py-3 pl-4 font-medium">Nota</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Inicio (Abr 2026)', sinMigrar: 91668, migrando: 91668, ventaja: 0, note: 'Igual en ambos casos', highlight: false },
                { label: '6 meses (Oct 2026)', ...PROJECTIONS.sixMonths, note: 'Migración completada', highlight: false },
                { label: '1 año (Abr 2027)', ...PROJECTIONS.oneYear, note: 'Primera vez +3.000€', highlight: false },
                { label: '18 meses (Oct 2027)', ...PROJECTIONS.eighteenMonths, note: 'Cerca de 100k€', highlight: false },
                { label: '2 años (Abr 2028)', ...PROJECTIONS.twoYears, note: 'Supera 100.000€', highlight: true },
              ].map((row) => (
                <tr key={row.label} className={`border-b border-gray-100 ${row.highlight ? 'bg-emerald-50 font-semibold' : 'hover:bg-gray-50'}`}>
                  <td className="py-3">{row.label}</td>
                  <td className="py-3 text-right tabular-nums text-gray-600">{formatEUR(row.sinMigrar)}</td>
                  <td className="py-3 text-right tabular-nums text-emerald-700">{formatEUR(row.migrando)}</td>
                  <td className="py-3 text-right tabular-nums font-bold text-emerald-600">
                    {row.ventaja > 0 ? `+${formatEUR(row.ventaja)}` : '—'}
                  </td>
                  <td className="py-3 pl-4 text-gray-500 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escenarios */}
      <div>
        <SectionHeader
          title="Escenarios de mercado a 2 años"
          subtitle="En todos los escenarios, incluso con caída del -15%, la cartera objetivo supera a la actual"
        />
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <ScenarioChart />
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left py-3 font-medium">Escenario</th>
                <th className="text-center py-3 font-medium">Mercado</th>
                <th className="text-right py-3 font-medium">Sin migrar</th>
                <th className="text-right py-3 font-medium">Migrando</th>
                <th className="text-right py-3 font-medium text-emerald-600">Diferencia</th>
                <th className="text-left py-3 pl-4 font-medium">Conclusión</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIOS.map((s, i) => (
                <tr key={s.name} className={`border-b border-gray-100 ${i === 2 ? 'bg-blue-50 font-medium' : 'hover:bg-gray-50'}`}>
                  <td className="py-3">{s.name} {i === 2 && <span className="text-xs text-blue-500 ml-1">(más probable)</span>}</td>
                  <td className="py-3 text-center tabular-nums">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      s.market.startsWith('-') ? 'bg-red-100 text-red-700' :
                      s.market.startsWith('+') ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{s.market}</span>
                  </td>
                  <td className="py-3 text-right tabular-nums text-gray-600">{formatEUR(s.sinMigrar)}</td>
                  <td className="py-3 text-right tabular-nums text-emerald-700">{formatEUR(s.migrando)}</td>
                  <td className="py-3 text-right tabular-nums font-bold text-emerald-600">+{formatEUR(s.diferencia)}</td>
                  <td className="py-3 pl-4 text-xs text-gray-500">
                    {i === 0 ? 'Mejor migrado incluso en crisis' :
                     i === 1 ? 'Muy claro' :
                     i === 2 ? 'Escenario más probable' :
                     i === 3 ? 'Rally capturado' : 'La diferencia se amplía'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conclusión */}
      <div className="bg-[#0f2c4f] text-white rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3">Conclusión</h3>
        <p className="text-blue-200 text-sm leading-relaxed">
          En todos los escenarios — incluso el de crisis severa con caída del mercado del -15% — la cartera objetivo
          supera a la actual tras 2 años. La ventaja de costes (ahorro ~825€/año) y la mejor selección de gestores generan
          una diferencia tan consistente que incluso compensa peores condiciones de mercado.
          El único escenario donde no migrar podría ser mejor es una crisis muy pronunciada{' '}
          <strong className="text-white">en los primeros 6 meses justo durante la migración de equity</strong>.
          Por eso el plan escala la exposición a renta variable gradualmente en los meses 3-6.
        </p>
      </div>
    </div>
  )
}
