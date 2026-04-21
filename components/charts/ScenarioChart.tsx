'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { SCENARIOS } from '@/lib/constants'

const formatEUR = (v: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

export default function ScenarioChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={SCENARIOS} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
          tick={{ fontSize: 11 }}
          domain={[85000, 120000]}
        />
        <Tooltip formatter={(value, name) => [formatEUR(Number(value)), String(name)]} />
        <Legend />
        <Bar dataKey="sinMigrar" name="Sin migrar" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="migrando" name="Tras migrar" radius={[4, 4, 0, 0]}>
          {SCENARIOS.map((_, i) => (
            <Cell key={i} fill={i === 2 ? '#059669' : i < 2 ? '#10b981' : '#34d399'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
