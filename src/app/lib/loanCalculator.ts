import { type EMIEntry } from "../types/budget";

// Helper: Calculate months passed since loan start
function getMonthsPassed(startMonth: number, startYear: number): number {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentYear = today.getFullYear();
  const passed = (currentYear - startYear) * 12 + (currentMonth - startMonth);
  return Math.max(0, passed);
}

export function getRemainingPrincipal(
  originalAmount: number,
  interestRate: number,
  tenureMonths: number,
  startMonth: number,
  startYear: number
): number {
  const monthsPassed = getMonthsPassed(startMonth, startYear);
  const monthsPaid = Math.min(monthsPassed, tenureMonths);

  if (interestRate === 0) {
    return Math.round(Math.max(0, originalAmount * (1 - monthsPaid / tenureMonths)));
  }

  const r = interestRate / 12 / 100;
  const n = tenureMonths;
  const p = monthsPaid;
  
  const factorN = Math.pow(1 + r, n);
  const factorP = Math.pow(1 + r, p);
  
  const remaining = originalAmount * ((factorN - factorP) / (factorN - 1));
  return Math.round(Math.max(0, remaining));
}

export function getTotalInterestRemaining(
  originalAmount: number,
  interestRate: number,
  tenureMonths: number,
  startMonth: number,
  startYear: number
): number {
  const monthsPassed = getMonthsPassed(startMonth, startYear);
  const monthsPaid = Math.min(monthsPassed, tenureMonths);
  const monthsRemaining = tenureMonths - monthsPaid;
  
  if (monthsRemaining <= 0) return 0;

  const remainingPrincipal = getRemainingPrincipal(originalAmount, interestRate, tenureMonths, startMonth, startYear);
  
  let monthlyEMI = 0;
  if (interestRate === 0) {
    monthlyEMI = originalAmount / tenureMonths;
  } else {
    const principal = originalAmount;
    const annualRate = interestRate;
    const tenure = tenureMonths;
    const monthlyRate = annualRate / 12 / 100;
    monthlyEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  }

  const totalFuturePayments = monthlyEMI * monthsRemaining;
  const interestRemaining = totalFuturePayments - remainingPrincipal;
  return Math.round(Math.max(0, interestRemaining));
}

export function getMonthsRemaining(
  tenureMonths: number,
  startMonth: number,
  startYear: number
): number {
  const monthsPassed = getMonthsPassed(startMonth, startYear);
  return Math.max(0, tenureMonths - monthsPassed);
}

export function getPayoffDate(
  tenureMonths: number,
  startMonth: number,
  startYear: number
): string {
  const d = new Date(startYear, startMonth - 1 + tenureMonths, 1);
  return d.toLocaleString("default", { month: "long", year: "numeric" });
}

export function getExtraPaymentImpact(
  originalAmount: number,
  interestRate: number,
  tenureMonths: number,
  startMonth: number,
  startYear: number,
  extraMonthlyPayment: number
): { monthsSaved: number; interestSaved: number; newPayoffDate: string } {
  const remainingPrincipal = getRemainingPrincipal(originalAmount, interestRate, tenureMonths, startMonth, startYear);
  const currentMonthsRemaining = getMonthsRemaining(tenureMonths, startMonth, startYear);
  
  if (currentMonthsRemaining <= 0 || remainingPrincipal <= 0) {
    return { monthsSaved: 0, interestSaved: 0, newPayoffDate: getPayoffDate(tenureMonths, startMonth, startYear) };
  }

  let normalEMI = 0;
  if (interestRate === 0) {
    normalEMI = originalAmount / tenureMonths;
  } else {
    const principal = originalAmount;
    const annualRate = interestRate;
    const tenure = tenureMonths;
    const monthlyRate = annualRate / 12 / 100;
    normalEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  }

  const monthlyRate = interestRate / 12 / 100;
  
  // Simulate Normal
  let nBalance = remainingPrincipal;
  let normalInterest = 0;
  let normalMonths = 0;
  while (nBalance > 0 && normalMonths < 1200) { // cap at 100 years
    const int = nBalance * monthlyRate;
    normalInterest += int;
    const principalPayment = normalEMI - int;
    if (principalPayment <= 0) {
      // Infinite loan...
      break;
    }
    nBalance -= principalPayment;
    normalMonths++;
  }

  // Simulate Extra
  let eBalance = remainingPrincipal;
  let extraInterest = 0;
  let extraMonths = 0;
  const acceleratedEMI = normalEMI + extraMonthlyPayment;
  while (eBalance > 0 && extraMonths < 1200) {
    const int = eBalance * monthlyRate;
    extraInterest += int;
    const principalPayment = acceleratedEMI - int;
    if (principalPayment <= 0) {
      break;
    }
    eBalance -= principalPayment;
    extraMonths++;
  }

  const monthsSaved = Math.max(0, normalMonths - extraMonths);
  const interestSaved = Math.round(Math.max(0, normalInterest - extraInterest));
  
  const today = new Date();
  const d = new Date(today.getFullYear(), today.getMonth() + extraMonths, 1);
  const newPayoffDate = d.toLocaleString("default", { month: "long", year: "numeric" });

  return { monthsSaved, interestSaved, newPayoffDate };
}

export function getDebtAvalancheOrder(emis: EMIEntry[]): EMIEntry[] {
  return emis
    .filter((e) => e.hasLoanDetails && e.loanDetails)
    .sort((a, b) => b.loanDetails!.interestRate - a.loanDetails!.interestRate);
}

export function calculateTotalDebtBurden(
  emis: EMIEntry[],
  salary: number,
  breakdown?: Record<string, number>
): {
  totalMonthlyEMI: number;
  debtToIncomeRatio: number;
  severity: "safe" | "caution" | "danger" | "critical";
  severityLabel: string;
  severityColor: string;
  severityBg: string;
  totalRemainingPrincipal: number;
  totalInterestRemaining: number;
  earliestFreedomDate: string;
  latestFreedomDate: string;
  monthlySurplus?: number;
} {
  const totalMonthlyEMI = emis.reduce((sum, e) => sum + (e.monthlyEMI || 0), 0);
  const debtToIncomeRatio = salary > 0 ? Math.round((totalMonthlyEMI / salary) * 100) : 0;
  
  let monthlySurplus = undefined;
  if (breakdown) {
    const essentialExpenses = (breakdown["Food & Groceries"] || 0) + (breakdown["Utilities"] || 0) + (breakdown["Transportation"] || 0);
    monthlySurplus = Math.max(0, salary - totalMonthlyEMI - essentialExpenses);
  }

  let severity: "safe" | "caution" | "danger" | "critical" = "safe";
  let severityLabel = "Healthy";
  let severityColor = "text-[#0F6E56]";
  let severityBg = "bg-[#E1F5EE]";

  if (debtToIncomeRatio >= 50) {
    severity = "critical";
    severityLabel = "Debt Trap";
    severityColor = "text-[#7B0000]";
    severityBg = "bg-[#FCEBEB]";
  } else if (debtToIncomeRatio >= 40) {
    severity = "danger";
    severityLabel = "Debt Stress";
    severityColor = "text-[#A32D2D]";
    severityBg = "bg-[#FCEBEB]";
  } else if (debtToIncomeRatio >= 30) {
    severity = "caution";
    severityLabel = "Manageable";
    severityColor = "text-[#854F0B]";
    severityBg = "bg-[#FAEEDA]";
  }

  let totalRemainingPrincipal = 0;
  let totalInterestRemaining = 0;
  
  let minMonths = Infinity;
  let maxMonths = 0;
  
  emis.forEach(e => {
    if (e.hasLoanDetails && e.loanDetails) {
      const { originalAmount, interestRate, tenureMonths, startMonth, startYear } = e.loanDetails;
      totalRemainingPrincipal += getRemainingPrincipal(originalAmount, interestRate, tenureMonths, startMonth, startYear);
      totalInterestRemaining += getTotalInterestRemaining(originalAmount, interestRate, tenureMonths, startMonth, startYear);
      const rem = getMonthsRemaining(tenureMonths, startMonth, startYear);
      if (rem < minMonths) minMonths = rem;
      if (rem > maxMonths) maxMonths = rem;
    }
  });

  const today = new Date();
  let earliestFreedomDate = "N/A";
  let latestFreedomDate = "N/A";

  if (minMonths !== Infinity) {
    const eDate = new Date(today.getFullYear(), today.getMonth() + minMonths, 1);
    earliestFreedomDate = eDate.toLocaleString("default", { month: "long", year: "numeric" });
  }
  if (maxMonths !== 0) {
    const lDate = new Date(today.getFullYear(), today.getMonth() + maxMonths, 1);
    latestFreedomDate = lDate.toLocaleString("default", { month: "long", year: "numeric" });
  }

  return {
    totalMonthlyEMI,
    debtToIncomeRatio,
    severity,
    severityLabel,
    severityColor,
    severityBg,
    totalRemainingPrincipal,
    totalInterestRemaining,
    earliestFreedomDate,
    latestFreedomDate,
    monthlySurplus
  };
}