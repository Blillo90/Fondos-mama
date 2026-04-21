'use client'

import { useState } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import { Save, Info } from 'lucide-react'

const TARGET_FUNDS = [
  { id: 'nb-short-duration', name: 'NB Short Duration Bond', isin: 'IE00BFZMJT78', weight: 20.7 },
  { id: 'schroder-euro-credit', name: 'Schroder Euro Credit', isin: 'LU2080996049', weight: 13.8 },
  { id: 'jpm-us-equity-focus', name: 'JPMorgan US Equity Focus', isin: 'LU2510715605', weight: 16.1 },
  { id: 'amundi-us-equity-value', name: 'Amundi US Equity Value R2', isin: 'LU1894686523', weight: 9.2 },
  { id: 'eleva-european', name: 'Eleva European Selection', isin: 'LU1111643042', weight: 10.4 },
  { id: 'sabadell-euroaccion', name: 'Sabadell Euroacción', isin: 'ES0111098002', weight: 4.6 },
  { id: 'mfs-meridian-em-debt', name: 'MFS Meridian EM Debt', isin: 'LU0583240782', weight: 5.2 },
  { id: 'nb-em-debt-hard', name: 'NB EM Debt Hard CCY', isin: 'IE00B986G486', weight: 4.8 },
  { id: 'ofi-precious-metals', name: 'OFI Precious Metals', isin: 'FR0011170786', weight: 6.3 },
  { id: 'man-alpha-alternative', name: 'Man Alpha Select Alternative', isin: 'IE00B3LJVG97', weight: 2.0 },
  { id: 'atlas-infrastructure', name: 'Atlas Global Infrastructure', isin: 'IE000NPCPQI2', weight: 1.7 },
  { id: 'sabadell-prudente-residual', name: 'Sabadell Prudente (residual)', isin: 'ES0111187003', weight: 5.2 },
]

export default function AdminPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [objetivoValues, setObjetivoValues] = useState<Record<string, string>>({})
  const [actualTotal, setActualTotal] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const objetivoTotal = Object.values(objetivoValues).reduce((s, v) => s + (parseFloat(v) || 0), 0)

  const handleSave = async () => {
    if (!date) { setError('Selecciona una fecha'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          actualTotal: parseFloat(actualTotal) || 0,
          objetivoValues,
          objetivoTotal,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2c4f]">Actualizar Valores Diarios</h1>
        <p className="text-gray-500 mt-1">Introduce los valores actuales de cada fondo para el seguimiento diario</p>
      </div>

      {/* Info Supabase */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold">Necesitas configurar Supabase</p>
          <p className="mt-1">
            1. Crea un proyecto en <strong>supabase.com</strong><br />
            2. Ejecuta el archivo <code className="bg-blue-100 px-1 rounded">supabase/schema.sql</code><br />
            3. Añade las variables de entorno en Vercel:<br />
            <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
            <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          </p>
        </div>
      </div>

      {/* Fecha */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del registro</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cartera Actual */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionHeader title="Cartera Actual" subtitle="Valor total de los fondos en Banco Sabadell" />
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 w-48">Valor total cartera actual</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400 text-sm">€</span>
            <input
              type="number"
              value={actualTotal}
              onChange={(e) => setActualTotal(e.target.value)}
              placeholder="91664.82"
              className="border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Cartera Objetivo */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <SectionHeader
          title="Cartera Objetivo"
          subtitle="Valor actual de cada fondo objetivo (consultar en Morningstar o Sabadell)"
        />
        <div className="space-y-3">
          {TARGET_FUNDS.map((f) => (
            <div key={f.id} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">{f.name}</p>
                <p className="text-xs text-gray-400 font-mono">{f.isin} · {f.weight}%</p>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 text-sm">€</span>
                <input
                  type="number"
                  value={objetivoValues[f.id] ?? ''}
                  onChange={(e) => setObjetivoValues((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  placeholder={String(Math.round(91664.82 * f.weight / 100))}
                  className="border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>
            </div>
          ))}

          {objetivoTotal > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 font-semibold">
              <span className="text-sm text-gray-700">Total Cartera Objetivo</span>
              <span className="text-emerald-600">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(objetivoTotal)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Guardar */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-[#0f2c4f] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1e4a7a] transition-colors disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar registro'}
      </button>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
          Valores guardados correctamente en Supabase. Los gráficos se actualizarán automáticamente.
        </div>
      )}

      {/* Cómo obtener los valores */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h4 className="font-semibold text-gray-700 mb-3 text-sm">¿Dónde consultar los valores?</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Banco Sabadell Online:</strong> Mis Productos → Fondos de Inversión</li>
          <li>• <strong>Morningstar.es:</strong> Buscar por ISIN del fondo</li>
          <li>• <strong>Investing.com:</strong> Buscar el fondo por nombre o ISIN</li>
          <li>• <strong>Frecuencia recomendada:</strong> Actualizar 1 vez por semana (los fondos publican VL con 1-2 días de retardo)</li>
        </ul>
      </div>
    </div>
  )
}
