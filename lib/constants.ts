// Datos clave del plan de migración (extraídos de los PDFs)
export const CLIENT_NAME = 'Maria Nieves Herrero Delgado'
export const INITIAL_DATE = '2026-04-01'
export const INITIAL_VALUE = 91664.82
export const MIGRATION_START = '2026-05-01'
export const MIGRATION_END = '2026-10-31'

export const PORTFOLIO_ACTUAL = {
  id: 'actual',
  ter: 1.45,
  grossReturn: 3.24,
  netReturn: 1.79,
  totalFunds: 49,
  annualCost: 1333,
}

export const PORTFOLIO_OBJETIVO = {
  id: 'objetivo',
  ter: 0.55,
  grossReturn: 6.98,
  netReturn: 6.43,
  totalFunds: 12,
  annualCost: 504,
  annualSavings: 828,
}

// Proyecciones de los documentos
export const PROJECTIONS = {
  sixMonths: { sinMigrar: 92481, migrando: 93533, ventaja: 1052 },
  oneYear:   { sinMigrar: 93309, migrando: 96493, ventaja: 3184 },
  eighteenMonths: { sinMigrar: 94139, migrando: 99553, ventaja: 5414 },
  twoYears:  { sinMigrar: 94979, migrando: 102698, ventaja: 7718 },
}

// Escenarios de mercado a 2 años
export const SCENARIOS = [
  { name: 'Muy pesimista', market: '-15%', sinMigrar: 89450, migrando: 93885, diferencia: 4436 },
  { name: 'Pesimista',     market: '-5%',  sinMigrar: 93116, migrando: 99557, diferencia: 6441 },
  { name: 'Base',          market: '±0%',  sinMigrar: 94979, migrando: 102698, diferencia: 7718 },
  { name: 'Optimista',     market: '+15%', sinMigrar: 100450, migrando: 110901, diferencia: 10451 },
  { name: 'Muy optimista', market: '+25%', sinMigrar: 104117, migrando: 116573, diferencia: 12457 },
]

// Distribución cartera actual
export const ACTUAL_ALLOCATION = [
  { name: 'Mixto Sabadell', value: 73, color: '#1e3a5f' },
  { name: 'Renta Fija', value: 20, color: '#2d6a9f' },
  { name: 'RV EEUU', value: 2.6, color: '#3498db' },
  { name: 'RV Europa', value: 1.5, color: '#5dade2' },
  { name: 'Emergentes', value: 1.5, color: '#85c1e9' },
  { name: 'Otros', value: 1.4, color: '#aed6f1' },
]

// Distribución cartera objetivo
export const OBJETIVO_ALLOCATION = [
  { name: 'Renta Fija', value: 32, color: '#1a6b4a' },
  { name: 'RV EEUU', value: 24, color: '#27ae60' },
  { name: 'RV Europa', value: 14, color: '#2ecc71' },
  { name: 'Emergentes', value: 9, color: '#52be80' },
  { name: 'Metales', value: 6, color: '#7dcea0' },
  { name: 'Alternativo', value: 10, color: '#a9dfbf' },
  { name: 'Mixto (residual)', value: 5, color: '#d5f5e3' },
]

// Generar datos de proyección mensual
export function generateProjectionData() {
  const data = []
  const startDate = new Date('2026-04-01')
  const annualRateActual = PORTFOLIO_ACTUAL.netReturn / 100
  const annualRateObjetivo = PORTFOLIO_OBJETIVO.netReturn / 100
  const transitionRate = (annualRateActual + annualRateObjetivo) / 2

  for (let month = 0; month <= 24; month++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + month)
    const label = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })

    const yearFraction = month / 12
    const actual = INITIAL_VALUE * Math.pow(1 + annualRateActual, yearFraction)

    let objetivo: number
    if (month <= 6) {
      // Durante migración: tasa intermedia
      objetivo = INITIAL_VALUE * Math.pow(1 + transitionRate, yearFraction)
    } else {
      // Tras migración: 6 meses transición + resto al ritmo objetivo
      const transitionValue = INITIAL_VALUE * Math.pow(1 + transitionRate, 6 / 12)
      const remainingMonths = month - 6
      objetivo = transitionValue * Math.pow(1 + annualRateObjetivo, remainingMonths / 12)
    }

    data.push({
      date: date.toISOString().split('T')[0],
      label,
      actual: Math.round(actual),
      objetivo: Math.round(objetivo),
      ventaja: Math.round(objetivo - actual),
    })
  }
  return data
}

// Información por fases de migración
export const MIGRATION_PHASES = [
  {
    phase: 'A',
    months: '1-2',
    label: 'Consolidación Renta Fija',
    description: 'Traspasos hacia NB Short Duration Bond y Schroder Euro Credit',
    amount: 17625,
    transfers: 18,
    color: '#3498db',
  },
  {
    phase: 'B',
    months: '3-4',
    label: 'Entrada en Equity y Alternativos',
    description: 'Completar posiciones en RV EEUU, Europa, Emergentes y Alternativos',
    amount: 4357,
    transfers: 18,
    color: '#27ae60',
  },
  {
    phase: 'C',
    months: '5-6',
    label: 'Vaciado Fondos Mixtos Grandes',
    description: 'Rendimiento, Consolida 94 y Sabadell Prudente → fondos objetivo',
    amount: 62150,
    transfers: 13,
    color: '#e74c3c',
  },
]

export const MONTH_LABELS: Record<number, { label: string; date: string }> = {
  1: { label: 'Mayo 2026', date: '2026-05-01' },
  2: { label: 'Junio 2026', date: '2026-06-01' },
  3: { label: 'Julio 2026', date: '2026-07-01' },
  4: { label: 'Agosto 2026', date: '2026-08-01' },
  5: { label: 'Septiembre 2026', date: '2026-09-01' },
  6: { label: 'Octubre 2026', date: '2026-10-01' },
}

export const CATEGORY_COLORS: Record<string, string> = {
  'RF Corto Plazo': '#3498db',
  'RF Crédito EUR': '#2980b9',
  'RF Emergente': '#1abc9c',
  'RF Emergente USD': '#16a085',
  'RV EEUU': '#e74c3c',
  'RV EEUU Value': '#c0392b',
  'RV Europa': '#27ae60',
  'Metales Preciosos': '#f39c12',
  'Alternativo': '#9b59b6',
  'Infraestructura': '#34495e',
  'Mixto Conservador': '#95a5a6',
  'Mixto': '#bdc3c7',
}

export function formatEUR(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPct(value: number, decimals = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}
