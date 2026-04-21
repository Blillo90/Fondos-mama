import { Transfer } from '@/lib/types'
import { MONTH_LABELS } from '@/lib/constants'
import { CheckCircle2, Clock, SkipForward } from 'lucide-react'

interface Props {
  transfers: Transfer[]
}

const formatEUR = (v: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'executed') return <CheckCircle2 size={16} className="text-emerald-500" />
  if (status === 'skipped') return <SkipForward size={16} className="text-gray-400" />
  return <Clock size={16} className="text-amber-400" />
}

const phaseColors: Record<string, string> = {
  A: 'bg-blue-100 text-blue-700 border-blue-200',
  B: 'bg-green-100 text-green-700 border-green-200',
  C: 'bg-rose-100 text-rose-700 border-rose-200',
}

export default function MigrationProgress({ transfers }: Props) {
  const byMonth: Record<number, Transfer[]> = {}
  for (const t of transfers) {
    if (!byMonth[t.month_num]) byMonth[t.month_num] = []
    byMonth[t.month_num].push(t)
  }

  return (
    <div className="space-y-8">
      {[1, 2, 3, 4, 5, 6].map((month) => {
        const monthTransfers = byMonth[month] ?? []
        const executed = monthTransfers.filter((t) => t.status === 'executed').length
        const total = monthTransfers.length
        const totalAmount = monthTransfers.reduce((s, t) => s + t.planned_amount, 0)
        const pct = total > 0 ? Math.round((executed / total) * 100) : 0
        const info = MONTH_LABELS[month]

        return (
          <div key={month} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-800">Mes {month} · {info.label}</span>
                <span className="ml-3 text-sm text-gray-500">
                  {executed}/{total} traspasos · {formatEUR(totalAmount)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-10 text-right">{pct}%</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {monthTransfers.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <StatusIcon status={t.status} />
                  <span className={`text-xs font-medium px-2 py-0.5 rounded border ${phaseColors[t.phase] ?? ''}`}>
                    Fase {t.phase}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-700 truncate">{t.from_fund?.name}</span>
                      <span className="text-gray-400 flex-shrink-0">→</span>
                      <span className="font-medium text-[#0f2c4f] truncate">{t.to_fund?.name}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium tabular-nums text-gray-700 flex-shrink-0">
                    {formatEUR(t.planned_amount)}
                  </span>
                  {t.status === 'executed' && t.executed_at && (
                    <span className="text-xs text-gray-400">{t.executed_at}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
