interface KpiCardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: 'blue' | 'green' | 'red' | 'orange' | 'gray'
}

const colorMap = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-emerald-50 border-emerald-200',
  red: 'bg-red-50 border-red-200',
  orange: 'bg-amber-50 border-amber-200',
  gray: 'bg-gray-50 border-gray-200',
}

const valueColorMap = {
  blue: 'text-blue-700',
  green: 'text-emerald-700',
  red: 'text-red-700',
  orange: 'text-amber-700',
  gray: 'text-gray-700',
}

export default function KpiCard({ label, value, sub, color = 'gray' }: KpiCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${valueColorMap[color]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}
