import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getPortfolioSnapshots(portfolioId: string, limit = 90) {
  const { data, error } = await supabase
    .from('portfolio_snapshots')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('date', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getLatestSnapshot(portfolioId: string) {
  const { data, error } = await supabase
    .from('portfolio_snapshots')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('date', { ascending: false })
    .limit(1)
    .single()
  if (error) return null
  return data
}

export async function getPortfolioFunds(portfolioId: string) {
  const { data, error } = await supabase
    .from('portfolio_funds')
    .select(`*, fund:funds(*)`)
    .eq('portfolio_id', portfolioId)
    .order('initial_amount', { ascending: false })
  if (error) throw error
  return data
}

export async function getTransfers() {
  const { data, error } = await supabase
    .from('transfers')
    .select(`*, from_fund:funds!transfers_from_fund_id_fkey(*), to_fund:funds!transfers_to_fund_id_fkey(*)`)
    .order('month_num', { ascending: true })
  if (error) throw error
  return data
}

export async function updateTransferStatus(
  transferId: string,
  status: 'pending' | 'executed' | 'skipped',
  executedAt?: string,
  actualAmount?: number
) {
  const { error } = await supabase
    .from('transfers')
    .update({ status, executed_at: executedAt, actual_amount: actualAmount })
    .eq('id', transferId)
  if (error) throw error
}

export async function savePortfolioSnapshot(
  portfolioId: string,
  date: string,
  totalValue: number,
  prevValue?: number
) {
  const dailyChange = prevValue ? totalValue - prevValue : 0
  const dailyChangePct = prevValue && prevValue > 0 ? (dailyChange / prevValue) * 100 : 0

  const { error } = await supabase
    .from('portfolio_snapshots')
    .upsert({
      portfolio_id: portfolioId,
      date,
      total_value: totalValue,
      daily_change: dailyChange,
      daily_change_pct: dailyChangePct,
    })
  if (error) throw error
}

export async function saveFundValues(
  values: { fund_id: string; portfolio_id: string; date: string; value: number }[]
) {
  const { error } = await supabase.from('fund_values').upsert(values)
  if (error) throw error
}

export async function getFundValues(portfolioId: string, date: string) {
  const { data, error } = await supabase
    .from('fund_values')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .eq('date', date)
  if (error) throw error
  return data
}
