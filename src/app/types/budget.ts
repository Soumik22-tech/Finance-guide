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
}
