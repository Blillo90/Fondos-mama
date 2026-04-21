import { PortfolioFund } from '@/lib/types'
import { CATEGORY_COLORS } from '@/lib/constants'

interface Props {
  funds: PortfolioFund[]
  showCagr?: boolean
  showSharpe?: boolean
  showTer?: boolean
  showRent2025?: boolean
}

const formatEUR = (v: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

function ColorDot({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] ?? '#94a3b8'
  return <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: color }} />
}

export default function FundTable({ funds, showCagr = true, showSharpe, showTer = true, showRent2025 = true }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
            <th className="text-left py-3 pr-4 font-medium">Fondo</th>
            <th className="text-left py-3 pr-4 font-medium">Categoría</th>
            <th className="text-right py-3 pr-4 font-medium">Peso</th>
            <th className="text-right py-3 pr-4 font-medium">Importe</th>
            {showCagr && <th className="text-right py-3 pr-4 font-medium">CAGR</th>}
            {showSharpe && <th className="text-right py-3 pr-4 font-medium">Sharpe</th>}
            {showTer && <th className="text-right py-3 pr-4 font-medium">TER</th>}
            {showRent2025 && <th className="text-right py-3 font-medium">2025</th>}
          </tr>
        </thead>
        <tbody>
          {funds.map((pf) => (
            <tr key={pf.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4">
                <div className="font-medium text-gray-900 truncate max-w-[200px]" title={pf.fund?.name}>
                  {pf.fund?.name}
                </div>
                <div className="text-xs text-gray-400 font-mono">{pf.fund?.isin}</div>
              </td>
              <td className="py-3 pr-4">
                {pf.fund?.category && (
                  <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    <ColorDot category={pf.fund.category} />
                    {pf.fund.category}
                  </span>
                )}
              </td>
              <td className="py-3 pr-4 text-right font-medium tabular-nums">
                {pf.target_weight.toFixed(1)}%
              </td>
              <td className="py-3 pr-4 text-right tabular-nums">
                {formatEUR(pf.initial_amount)}
              </td>
              {showCagr && (
                <td className={`py-3 pr-4 text-right font-medium tabular-nums ${
                  pf.fund?.cagr && pf.fund.cagr > 5 ? 'text-emerald-600' : 'text-gray-600'
                }`}>
                  {pf.fund?.cagr ? `+${pf.fund.cagr.toFixed(1)}%` : '—'}
                </td>
              )}
              {showSharpe && (
                <td className={`py-3 pr-4 text-right tabular-nums ${
                  pf.fund?.sharpe && pf.fund.sharpe > 0 ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {pf.fund?.sharpe != null ? pf.fund.sharpe.toFixed(2) : '—'}
                </td>
              )}
              {showTer && (
                <td className={`py-3 pr-4 text-right tabular-nums ${
                  pf.fund?.ter && pf.fund.ter > 1.5 ? 'text-red-500' : 'text-gray-600'
                }`}>
                  {pf.fund?.ter ? `${pf.fund.ter.toFixed(2)}%` : '—'}
                </td>
              )}
              {showRent2025 && (
                <td className={`py-3 text-right font-medium tabular-nums ${
                  pf.fund?.rent_2025 != null
                    ? pf.fund.rent_2025 >= 0 ? 'text-emerald-600' : 'text-red-500'
                    : 'text-gray-400'
                }`}>
                  {pf.fund?.rent_2025 != null
                    ? `${pf.fund.rent_2025 >= 0 ? '+' : ''}${pf.fund.rent_2025.toFixed(2)}%`
                    : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
