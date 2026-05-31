export const STAGES = [
  { id: 'new', label: 'New', color: 'bg-slate-500' },
  { id: 'qualified', label: 'Qualified', color: 'bg-blue-500' },
  { id: 'proposal', label: 'Proposition', color: 'bg-amber-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-purple-500' },
  { id: 'won', label: 'Won', color: 'bg-emerald-600' },
  { id: 'lost', label: 'Lost', color: 'bg-rose-600' },
] as const

export type StageId = (typeof STAGES)[number]['id']

export const INCOTERMS = ['FOB', 'CIF', 'CFR', 'EXW', 'DAP', 'DDP', 'FAS', 'FCA'] as const
export const CURRENCIES = ['USD', 'EUR', 'IDR', 'CNY', 'JPY', 'SGD'] as const
export const LEAD_TYPES = ['buyer', 'supplier', 'agent', 'distributor'] as const
export const LEAD_SOURCES = ['Website', 'Referral', 'Trade Show', 'Cold Outreach', 'LinkedIn', 'Alibaba', 'Other'] as const
export const ACTIVITY_TYPES = ['call', 'email', 'meeting', 'shipment', 'document', 'task'] as const

export function fmtMoney(value: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
  } catch {
    return `${currency} ${value.toLocaleString()}`
  }
}
