export type SchemeCategory = "housing" | "savings" | "insurance" | "education" | "women" | "farmers" | "business" | "pension"

export interface EligibilityCriteria {
  maxAnnualIncome?: number
  minFamilyMembers?: number
  requiresChildren?: boolean
  requiresGirlChild?: boolean
  maritalStatus?: "single" | "married" | "any"
  housingStatus?: "rent" | "own" | "any"
  minAge?: number
  maxAge?: number
  states?: string[]
}

export interface GovernmentScheme {
  id: string
  name: string
  fullName: string
  category: SchemeCategory
  categoryLabel: string
  categoryColor: string
  categoryBg: string
  description: string
  keyBenefit: string
  maxBenefitAmount?: number
  benefitLabel: string
  eligibility: EligibilityCriteria
  howToApply: string
  documentsNeeded: string[]
  officialLink: string
  isNational: boolean
  stateSpecific?: string[]
}