export interface BudgetData {
  income: number;
  expenses: {
    necessities: number;
    wants: number;
    savings: number;
    debt: number;
  };
  duration: 'monthly' | 'yearly';
}

export interface BudgetRecommendation {
  score: number;
  message: string;
  advice: string[];
}

export interface FormData {
  name: string;
  city: string;
  salary: number;
  status: 'single' | 'married';
  members: number;
  children: 'yes' | 'no';
  kids: number;
  house: 'rent' | 'own';
  emi: 'yes' | 'no';
  liabilityProfile?: LiabilityProfile;
  vehicle: 'public' | 'car';
  insurance: 'yes' | 'no';
}

export interface BudgetBreakdown {
  [category: string]: number;
}

export interface BudgetResult {
  name: string;
  city: string;
  salary: number;
  breakdown: BudgetBreakdown;
  liabilityProfile?: LiabilityProfile;
  // Demographic fields added for Govt Scheme Matcher
  members: number;
  children: 'yes' | 'no';
  kids: number;
  house: 'rent' | 'own';
  maritalStatus: 'single' | 'married';
}

export type LoanType = "housing" | "car" | "personal" | "education" | "creditcard" | "other";

export interface EMIEntry {
  id: string;
  type: LoanType;
  typeLabel: string;
  monthlyEMI: number;
  hasLoanDetails: boolean;
  autoCalculated?: boolean;
  loanDetails?: {
    originalAmount: number;
    interestRate: number;
    tenureMonths: number;
    startMonth: number;
    startYear: number;
  };
}

export interface LiabilityProfile {
  hasEMI: boolean;
  emis: EMIEntry[];
  totalMonthlyEMI: number;
  debtToIncomeRatio: number;
}
