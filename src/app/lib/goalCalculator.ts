import { CITY_DATA, getSalaryBand, normalizeCityKey } from "./cityData";
import { InvestmentOption, TimeHorizon } from "../types/goals";

export function getTimeHorizon(months: number): TimeHorizon {
  if (months < 12) return "short";
  if (months < 36) return "medium";
  return "long";
}

export function calculateMonthlySavingsNeeded(targetAmount: number, targetMonths: number, expectedAnnualReturn: number): number {
  const monthlyRate = expectedAnnualReturn / 12 / 100;
  if (monthlyRate === 0) return Math.ceil(targetAmount / targetMonths);
  return Math.ceil(targetAmount * monthlyRate / (Math.pow(1 + monthlyRate, targetMonths) - 1));
}

export function calculateFinalAmount(monthlyInvestment: number, targetMonths: number, annualReturn: number): number {
  const monthlyRate = annualReturn / 12 / 100;
  if (monthlyRate === 0) return Math.round(monthlyInvestment * targetMonths);
  return Math.round(monthlyInvestment * (Math.pow(1 + monthlyRate, targetMonths) - 1) / monthlyRate);
}

export function getInvestmentOptions(targetAmount: number, targetMonths: number, monthlyAvailable: number, riskPreference: "safe" | "moderate" | "aggressive"): InvestmentOption[] {
  const horizon = getTimeHorizon(targetMonths);
  let baseOptions: Omit<InvestmentOption, 'finalAmountBestCase' | 'finalAmountAvgCase' | 'finalAmountWorstCase'>[] = [];

  if (riskPreference === "safe") {
    baseOptions = [
      {
        name: "Recurring Deposit (RD)",
        type: "Bank Deposit",
        riskLevel: "no_risk",
        riskLabel: "No Risk",
        riskColor: "text-[#0F6E56]",
        riskBg: "bg-[#E1F5EE]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 7.5,
        annualReturnAvgCase: 6.8,
        annualReturnWorstCase: 6.0,
        taxNote: "Interest taxed as per your income slab",
        description: "Bank recurring deposit. Principal is 100% safe. Returns are guaranteed by the bank.",
        howToStart: "Open at any bank branch or net banking. SBI, HDFC, ICICI all offer RDs from ₹500/month."
      },
      {
        name: "Public Provident Fund (PPF)",
        type: "Government Scheme",
        riskLevel: "no_risk",
        riskLabel: "No Risk",
        riskColor: "text-[#0F6E56]",
        riskBg: "bg-[#E1F5EE]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 7.1,
        annualReturnAvgCase: 7.1,
        annualReturnWorstCase: 7.1,
        taxNote: "Completely tax-free. EEE status — invest, earn, withdraw all tax free.",
        description: "Government-backed savings scheme. Returns are fixed by government each quarter. 15-year lock-in but completely tax free. Best for long-term safe goals.",
        howToStart: "Open at any post office, SBI, or major bank. Also available on India Post Payments Bank app and net banking."
      },
      {
        name: "Sovereign Gold Bond (SGB)",
        type: "Government Bond",
        riskLevel: "low_risk",
        riskLabel: "Very Low Risk",
        riskColor: "text-[#185FA5]",
        riskBg: "bg-[#E6F1FB]",
        minMonthlyAmount: 5000,
        annualReturnBestCase: 10.0,
        annualReturnAvgCase: 8.0,
        annualReturnWorstCase: 4.0,
        taxNote: "2.5% interest taxable. Capital gains tax-free on maturity after 8 years.",
        description: "Government bonds linked to gold price. You get gold returns plus 2.5% annual interest. Safer than physical gold, no making charges.",
        howToStart: "Buy during RBI issue windows on your bank's net banking or Zerodha. Minimum 1 gram of gold equivalent."
      }
    ];
  } else if (riskPreference === "aggressive") {
    baseOptions = [
      {
        name: "Nifty 50 Index Fund (SIP)",
        type: "Equity Mutual Fund",
        riskLevel: "moderate_risk",
        riskLabel: "Moderate Risk",
        riskColor: "text-[#854F0B]",
        riskBg: "bg-[#FAEEDA]",
        minMonthlyAmount: 100,
        annualReturnBestCase: 18.0,
        annualReturnAvgCase: 12.0,
        annualReturnWorstCase: 3.0,
        taxNote: "10% LTCG above ₹1 lakh/year. No tax if gains under ₹1 lakh.",
        description: "Tracks India's top 50 companies. Best risk-adjusted returns over 5+ years. Recommended by most financial experts as the safest equity option.",
        howToStart: "Start on Zerodha Coin, Groww, or directly on UTI or HDFC AMC website. SIP from ₹100/month."
      },
      {
        name: "Large Cap Equity Fund (SIP)",
        type: "Equity Mutual Fund",
        riskLevel: "moderate_risk",
        riskLabel: "Moderate Risk",
        riskColor: "text-[#854F0B]",
        riskBg: "bg-[#FAEEDA]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 16.0,
        annualReturnAvgCase: 11.0,
        annualReturnWorstCase: 1.0,
        taxNote: "10% LTCG above ₹1 lakh/year",
        description: "Invests in India's largest established companies. More stable than mid or small cap funds. Good for 5+ year goals with moderate risk tolerance.",
        howToStart: "Start SIP on Groww or Zerodha. Axis Bluechip Fund or Mirae Asset Large Cap are well-regarded options."
      },
      {
        name: "Mid Cap Equity Fund (SIP)",
        type: "Equity Mutual Fund",
        riskLevel: "high_risk",
        riskLabel: "High Risk",
        riskColor: "text-[#A32D2D]",
        riskBg: "bg-[#FCEBEB]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 22.0,
        annualReturnAvgCase: 14.0,
        annualReturnWorstCase: -5.0,
        taxNote: "10% LTCG above ₹1 lakh/year",
        description: "Higher growth potential over 7+ years. Volatile in the short term. Only invest money you will not need for at least 5 years.",
        howToStart: "Nippon India Mid Cap Fund or Kotak Emerging Equity Fund on any mutual fund app. Only add this after your index fund SIP is running."
      },
      {
        name: "Small Cap Equity Fund (SIP)",
        type: "Equity Mutual Fund",
        riskLevel: "high_risk",
        riskLabel: "Very High Risk",
        riskColor: "text-[#A32D2D]",
        riskBg: "bg-[#FCEBEB]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 28.0,
        annualReturnAvgCase: 16.0,
        annualReturnWorstCase: -15.0,
        taxNote: "10% LTCG above ₹1 lakh/year",
        description: "Highest potential returns but extreme volatility. Can drop 40-50% in a bad year. Only for 7+ year goals and investors who can handle seeing their portfolio go down significantly.",
        howToStart: "Nippon India Small Cap or SBI Small Cap Fund. Keep this to maximum 10-15% of your total monthly investment amount."
      }
    ];
  } else {
    // moderate riskPreference uses the original time horizon logic
    if (horizon === "short") {
    baseOptions = [
      {
        name: "Recurring Deposit (RD)",
        type: "Bank Deposit",
        riskLevel: "no_risk",
        riskLabel: "No Risk",
        riskColor: "text-[#0F6E56]",
        riskBg: "bg-[#E1F5EE]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 7.5,
        annualReturnAvgCase: 6.8,
        annualReturnWorstCase: 6.0,
        taxNote: "Interest taxed as per your income slab",
        description: "Bank recurring deposit. Principal is completely safe. Returns are guaranteed.",
        howToStart: "Open at any bank branch or net banking. SBI, HDFC, ICICI all offer RDs starting ₹500/month.",
      },
      {
        name: "Fixed Deposit (Lump Sum)",
        type: "Bank Deposit",
        riskLevel: "no_risk",
        riskLabel: "No Risk",
        riskColor: "text-[#0F6E56]",
        riskBg: "bg-[#E1F5EE]",
        minMonthlyAmount: 1000,
        annualReturnBestCase: 7.8,
        annualReturnAvgCase: 7.2,
        annualReturnWorstCase: 6.5,
        taxNote: "Interest taxed as per your income slab",
        description: "Put your savings monthly in a sweep FD. Completely safe, slightly better than RD.",
        howToStart: "Use your bank's sweep FD or create a new FD monthly. Works well with net banking.",
      },
      {
        name: "Liquid Mutual Fund",
        type: "Mutual Fund",
        riskLevel: "low_risk",
        riskLabel: "Very Low Risk",
        riskColor: "text-[#185FA5]",
        riskBg: "bg-[#E6F1FB]",
        minMonthlyAmount: 100,
        annualReturnBestCase: 7.5,
        annualReturnAvgCase: 6.5,
        annualReturnWorstCase: 5.5,
        taxNote: "Gains taxed as short-term capital gains at your slab rate",
        description: "Near-zero risk mutual fund that beats savings account returns. Highly liquid — withdraw anytime.",
        howToStart: "Start on Zerodha Coin, Groww, or Paytm Money. Search 'liquid fund'. No exit load after 7 days.",
      }
    ];
  } else if (horizon === "medium") {
    baseOptions = [
      {
        name: "Debt Mutual Fund (SIP)",
        type: "Mutual Fund",
        riskLevel: "low_risk",
        riskLabel: "Low Risk",
        riskColor: "text-[#185FA5]",
        riskBg: "bg-[#E6F1FB]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 9.0,
        annualReturnAvgCase: 7.5,
        annualReturnWorstCase: 5.0,
        taxNote: "Gains taxed as per your income slab if held under 3 years",
        description: "Invests in government and corporate bonds. More stable than equity. Better returns than FD for 1-3 year goals.",
        howToStart: "Start SIP on Groww or Zerodha Coin. Choose a short-duration or corporate bond fund.",
      },
      {
        name: "Recurring Deposit (RD)",
        type: "Bank Deposit",
        riskLevel: "no_risk",
        riskLabel: "No Risk",
        riskColor: "text-[#0F6E56]",
        riskBg: "bg-[#E1F5EE]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 7.5,
        annualReturnAvgCase: 6.8,
        annualReturnWorstCase: 6.0,
        taxNote: "Interest taxed as per income slab",
        description: "Safe guaranteed returns. Good as the risk-free portion of a medium-term goal.",
        howToStart: "Open at any bank. Consider mixing RD with a small SIP for better average returns.",
      },
      {
        name: "Balanced Advantage Fund (SIP)",
        type: "Mutual Fund",
        riskLevel: "moderate_risk",
        riskLabel: "Moderate Risk",
        riskColor: "text-[#854F0B]",
        riskBg: "bg-[#FAEEDA]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 14.0,
        annualReturnAvgCase: 10.0,
        annualReturnWorstCase: 2.0,
        taxNote: "Equity taxation — 10% LTCG above ₹1 lakh if held 1+ year",
        description: "Automatically shifts between equity and debt based on market conditions. Lower volatility than pure equity.",
        howToStart: "Start on any mutual fund app. Look for HDFC Balanced Advantage or ICICI Prudential Balanced Advantage Fund.",
      }
    ];
  } else {
    baseOptions = [
      {
        name: "Index Fund SIP (Nifty 50)",
        type: "Mutual Fund",
        riskLevel: "moderate_risk",
        riskLabel: "Moderate Risk",
        riskColor: "text-[#854F0B]",
        riskBg: "bg-[#FAEEDA]",
        minMonthlyAmount: 100,
        annualReturnBestCase: 18.0,
        annualReturnAvgCase: 12.0,
        annualReturnWorstCase: 3.0,
        taxNote: "10% LTCG above ₹1 lakh per year. No tax if held under ₹1 lakh gains.",
        description: "Tracks India's top 50 companies. Best risk-adjusted returns over 5+ years. Recommended by most financial experts.",
        howToStart: "Start on Zerodha, Groww, or directly on AMC website. Choose UTI Nifty 50 Index Fund or HDFC Index Fund Nifty 50 Plan. SIP starts at ₹100.",
      },
      {
        name: "Large Cap Equity Fund (SIP)",
        type: "Mutual Fund",
        riskLevel: "moderate_risk",
        riskLabel: "Moderate Risk",
        riskColor: "text-[#854F0B]",
        riskBg: "bg-[#FAEEDA]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 16.0,
        annualReturnAvgCase: 11.0,
        annualReturnWorstCase: 1.0,
        taxNote: "10% LTCG above ₹1 lakh per year",
        description: "Invests in India's largest established companies. More stable than mid/small cap. Good for 5+ year goals.",
        howToStart: "Start SIP on any mutual fund app. Axis Bluechip Fund or Mirae Asset Large Cap are well-regarded options.",
      },
      {
        name: "Mid Cap Equity Fund (SIP)",
        type: "Mutual Fund",
        riskLevel: "high_risk",
        riskLabel: "Higher Risk",
        riskColor: "text-[#A32D2D]",
        riskBg: "bg-[#FCEBEB]",
        minMonthlyAmount: 500,
        annualReturnBestCase: 22.0,
        annualReturnAvgCase: 14.0,
        annualReturnWorstCase: -5.0,
        taxNote: "10% LTCG above ₹1 lakh per year",
        description: "Higher growth potential over 7+ years. Can be volatile short term. Not suitable if you need money within 5 years.",
        howToStart: "Start on Groww or Zerodha. Consider Nippon India Mid Cap Fund or Kotak Emerging Equity Fund. Only allocate money you won't need for 5+ years.",
      }
    ];
  }

  }

  return baseOptions.map(opt => ({
    ...opt,
    finalAmountBestCase: calculateFinalAmount(monthlyAvailable, targetMonths, opt.annualReturnBestCase),
    finalAmountAvgCase: calculateFinalAmount(monthlyAvailable, targetMonths, opt.annualReturnAvgCase),
    finalAmountWorstCase: calculateFinalAmount(monthlyAvailable, targetMonths, opt.annualReturnWorstCase),
  }));
}

export function getMilestones(targetAmount: number, targetMonths: number, monthlySavings: number): Array<{ month: number, label: string, targetSaved: number, percentage: number }> {
  return [25, 50, 75, 100].map(percentage => ({
    month: Math.round(targetMonths * percentage / 100),
    label: `${percentage}%`,
    targetSaved: Math.round(targetAmount * percentage / 100),
    percentage
  }));
}

export function identifyCuttableCategories(breakdown: Record<string, number>, salary: number, city: string, gapAmount: number): Array<{ category: string, currentAmount: number, suggestedCut: number, newAmount: number, reasoning: string }> {
  const cityKey = normalizeCityKey(city);
  if (!cityKey) return [];
  const data = CITY_DATA[cityKey];
  if (!data) return [];

  const band = getSalaryBand(salary);
  const cityAverages = data.salaryBands[band];

  const categoriesToCheck = [
    { key: "Food & Groceries", getAvg: () => cityAverages.food.avg },
    { key: "Transportation", getAvg: () => cityAverages.transport.avg },
    { key: "Internet & Subscriptions", getAvg: () => Math.round(0.04 * salary) },
    { key: "Miscellaneous", getAvg: () => Math.round(0.08 * salary) }
  ];

  let potentialCuts: Array<{ category: string, currentAmount: number, suggestedCut: number, newAmount: number, reasoning: string, excess: number }> = [];

  for (const { key, getAvg } of categoriesToCheck) {
    const userAmount = breakdown[key] || 0;
    const avgAmount = getAvg();
    if (userAmount > avgAmount) {
      const excess = userAmount - avgAmount;
      const suggestedCut = Math.min(excess, gapAmount);
      potentialCuts.push({
        category: key,
        currentAmount: userAmount,
        suggestedCut,
        newAmount: userAmount - suggestedCut,
        reasoning: `Your ${key.toLowerCase()} budget is ₹${excess.toLocaleString()} above the ${data.city} average for your salary band.`,
        excess
      });
    }
  }

  return potentialCuts.sort((a, b) => b.excess - a.excess).slice(0, 3).map(({ excess, ...rest }) => rest);
}