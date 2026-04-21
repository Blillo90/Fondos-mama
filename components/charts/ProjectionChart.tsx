'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { generateProjectionData } from '@/lib/constants'

interface Props {
  showActualData?: { date: string; actual: number; objetivo: number }[]
  height?: number
}

const formatEUR = (v: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

export default function ProjectionChart({ showActualData, height = 340 }: Props) {
  const projected = generateProjectionData()

  const merged = projected.map((p) => {
    const real = showActualData?.find((d) => d.date === p.date)
    return {
      ...p,
      realActual: real?.actual,
      realObjetivo: real?.objetivo,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={merged} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} />
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
        <ReferenceLine x="Oct 26" stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Fin migración', fontSize: 10 }} />
        <ReferenceLine y={100000} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '100k €', fontSize: 10 }} />
        <Line
          type="monotone"
          dataKey="actual"
          name="Sin migrar (proyectado)"
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="objetivo"
          name="Cartera Objetivo (proyectado)"
          stroke="#059669"
          strokeWidth={2.5}
          dot={false}
        />
        {showActualData && (
          <>
            <Line
              type="monotone"
              dataKey="realActual"
              name="Cartera Actual (real)"
              stroke="#6b7280"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="realObjetivo"
              name="Cartera Objetivo (real)"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
