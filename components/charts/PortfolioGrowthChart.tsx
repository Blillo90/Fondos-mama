'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

export interface GrowthPoint {
  date: string
  actual?: number
  objetivo?: number
}

interface Props {
  data: GrowthPoint[]
  height?: number
}

const formatEUR = (v: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

export default function PortfolioGrowthChart({ data, height = 300 }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={formatted} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
          tick={{ fontSize: 11 }}
          domain={['auto', 'auto']}
        />
        <Tooltip
          formatter={(value, name) => [formatEUR(Number(value)), String(name)]}
          labelStyle={{ fontWeight: 'bold' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual"
          name="Cartera Actual"
          stroke="#6b7280"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="objetivo"
          name="Cartera Objetivo"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
