import { TrendingUp, TrendingDown } from 'lucide-react'

export interface FundChange {
  fund_id: string
  name: string
  change: number
  changePct: number
}

interface Props {
  changes: FundChange[]
  previousDate: string
  latestDate: string
}

const formatEUR = (v: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })

export default function ObjetivoFundChanges({ changes, previousDate, latestDate }: Props) {
  const up = changes.filter((c) => c.changePct > 0).length
  const down = changes.filter((c) => c.changePct < 0).length

  return (
    <div>
      <p className="text-xs text-gray-400 mb-4">
        {formatDate(previousDate)} → {formatDate(latestDate)} ·{' '}
        <span className="text-emerald-600 font-medium">{up} suben</span> ·{' '}
        <span className="text-red-500 font-medium">{down} bajan</span>
      </p>
      <div className="space-y-1">
        {changes.map((c) => {
          const positive = c.changePct >= 0
          const Icon = positive ? TrendingUp : TrendingDown
          const color = positive ? 'text-emerald-600' : 'text-red-500'
          return (
            <div key={c.fund_id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-700 truncate">{c.name}</span>
              <div className={`flex items-center gap-2 flex-shrink-0 ${color}`}>
                <Icon size={14} />
                <span className="text-sm font-semibold tabular-nums w-16 text-right">
                  {positive ? '+' : ''}{c.changePct.toFixed(2)}%
                </span>
                <span className="text-xs text-gray-400 tabular-nums w-24 text-right">
                  {positive ? '+' : ''}{formatEUR(c.change)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
