export type RiskLevel = "no_risk" | "low_risk" | "moderate_risk" | "high_risk"

export type TimeHorizon = "short" | "medium" | "long"
// short = under 12 months, medium = 12-36 months, long = above 36 months

export interface InvestmentOption {
  name: string
  type: string
  riskLevel: RiskLevel
  riskLabel: string
  riskColor: string
  riskBg: string
  minMonthlyAmount: number
  annualReturnBestCase: number
  annualReturnAvgCase: number
  annualReturnWorstCase: number
  finalAmountBestCase: number
  finalAmountAvgCase: number
  finalAmountWorstCase: number
  taxNote: string
  description: string
  howToStart: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  targetMonths: number
  riskPreference: string
  monthlySavingsNeeded: number
  currentSavingsAllocation: number
  gap: number
  createdAt: number
  city: string
  salary: number
}