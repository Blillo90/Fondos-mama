export interface Fund {
  id: string
  name: string
  isin: string | null
  category: string | null
  cagr: number | null
  sharpe: number | null
  ter: number | null
  rent_2025: number | null
  notes: string | null
}

export interface Portfolio {
  id: string
  name: string
  label: string
  description: string | null
  initial_value: number
  ter_annual: number
  expected_net_return: number
}

export interface PortfolioFund {
  id: string
  portfolio_id: string
  fund_id: string
  target_weight: number
  initial_amount: number
  fund?: Fund
}

export interface PortfolioSnapshot {
  id: string
  portfolio_id: string
  date: string
  total_value: number
  daily_change: number | null
  daily_change_pct: number | null
}

export interface FundValue {
  id: string
  fund_id: string
  portfolio_id: string
  date: string
  value: number
}

export interface Transfer {
  id: string
  month_num: number
  phase: string
  from_fund_id: string
  to_fund_id: string
  planned_amount: number
  actual_amount: number | null
  status: 'pending' | 'executed' | 'skipped'
  executed_at: string | null
  notes: string | null
  from_fund?: Fund
  to_fund?: Fund
}

export interface ProjectionPoint {
  date: string
  label: string
  actual: number
  objetivo: number
  ventaja: number
}

export interface ScenarioResult {
  name: string
  market: string
  sinMigrar: number
  migrando: number
  diferencia: number
}
