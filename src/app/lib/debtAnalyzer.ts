export type DebtSeverity = "safe" | "caution" | "danger" | "critical";

export interface DebtAnalysis {
  hasDebt: boolean;
  emiAmount: number;
  emiRatio: number;
  severity: DebtSeverity;
  severityLabel: string;
  severityColor: string;
  severityBg: string;
  monthsToFreedom: number;
  monthlySurplus: number;
  safeSavings: number;
  message: string;
  subMessage: string;
}

export function analyzeDebt(salary: number, breakdown: Record<string, number>): DebtAnalysis {
  const emiAmount = breakdown["EMI"] || 0;

  if (emiAmount <= 0) {
    return {
      hasDebt: false,
      emiAmount: 0,
      emiRatio: 0,
      severity: "safe",
      severityLabel: "Healthy",
      severityColor: "text-[#0F6E56]",
      severityBg: "bg-[#E1F5EE]",
      monthsToFreedom: 0,
      monthlySurplus: 0,
      safeSavings: 0,
      message: "Your EMI load is healthy",
      subMessage: "You are within safe limits. Keep maintaining this balance."
    };
  }

  const emiRatio = Math.round((emiAmount / salary) * 100);
  let severity: DebtSeverity = "safe";
  let severityLabel = "Healthy";
  let severityColor = "text-[#0F6E56]";
  let severityBg = "bg-[#E1F5EE]";
  let message = "Your EMI load is healthy";
  let subMessage = "You are within safe limits. Keep maintaining this balance.";

  if (emiRatio >= 50) {
    severity = "critical";
    severityLabel = "Debt Trap";
    severityColor = "text-[#7B0000]";
    severityBg = "bg-[#FCEBEB]";
    message = "You are in a debt trap";
    subMessage = `Spending ${emiRatio}% on EMIs is critical. This is the leading cause of financial collapse for Indian families.`;
  } else if (emiRatio >= 40) {
    severity = "danger";
    severityLabel = "Debt Stress";
    severityColor = "text-[#A32D2D]";
    severityBg = "bg-[#FCEBEB]";
    message = "You are in debt stress";
    subMessage = `Spending ${emiRatio}% on EMIs is risky. Above 40% affects your ability to save and handle emergencies.`;
  } else if (emiRatio >= 30) {
    severity = "caution";
    severityLabel = "Manageable";
    severityColor = "text-[#854F0B]";
    severityBg = "bg-[#FAEEDA]";
    message = "Your EMI is getting heavy";
    subMessage = `You are spending ${emiRatio}% on EMIs. Safe limit is 30%. Monitor closely.`;
  } else {
    severity = "safe";
    severityLabel = "Healthy";
    severityColor = "text-[#0F6E56]";
    severityBg = "bg-[#E1F5EE]";
    message = "Your EMI load is healthy";
    subMessage = "You are within safe limits. Keep maintaining this balance.";
  }

  const monthlySurplus = salary - emiAmount - (breakdown["Food & Groceries"] || 0) - (breakdown["Utilities"] || 0) - (breakdown["Transportation"] || 0);
  const safeSavings = Math.round(salary * 0.1);
  
  let monthsToFreedom = 0;
  if (monthlySurplus - safeSavings > 0) {
    monthsToFreedom = Math.ceil((emiAmount * 12) / (monthlySurplus - safeSavings));
  }
  
  if (monthsToFreedom > 120) {
    monthsToFreedom = 120;
  }

  return {
    hasDebt: true,
    emiAmount,
    emiRatio,
    severity,
    severityLabel,
    severityColor,
    severityBg,
    monthsToFreedom,
    monthlySurplus,
    safeSavings,
    message,
    subMessage
  };
}