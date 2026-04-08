import { BudgetData, BudgetRecommendation, FormData, BudgetBreakdown } from '../types/budget';

export function calculateBudgetScore(data: BudgetData): BudgetRecommendation {
  const totalExpenses = data.expenses.necessities + data.expenses.wants + data.expenses.savings + data.expenses.debt;
  const ratio = totalExpenses / data.income;

  let score = 100 - (ratio * 50);
  let message = "Your budget is looking healthy!";
  let advice = ["Keep tracking your expenses."];

  if (ratio > 1) {
    score = 20;
    message = "Warning: Your expenses exceed your income.";
    advice.push("Consider cutting back on wants.");
  } else if (data.expenses.savings < data.income * 0.2) {
    advice.push("Try to increase your savings to at least 20% of your income.");
  }

  return { score: Math.round(score), message, advice };
}

export function calculateBudget(data: FormData): BudgetBreakdown {
  const { salary, house, emi, vehicle, members, insurance, kids } = data;
  let weights: { [key: string]: number } = {};

  if (house === 'rent') {
    weights['Rent'] = 30;
  } else if (house === 'own') {
    if (emi === 'yes') {
      weights['EMI'] = 25;
    } else if (emi === 'no') {
      weights['Maintenance'] = 8;
    }
  }

  weights['Utilities'] = 5;
  weights['Transportation'] = vehicle === 'public' ? 8 : 5;
  weights['Food & Groceries'] = 10 + (members - 1) * 2;
  weights['Internet & Subscriptions'] = 2;

  if (insurance === 'yes') {
    weights['Insurance'] = 6;
  }

  weights['Emergency Fund'] = 12;
  weights['Miscellaneous'] = 5;

  if (kids > 0) {
    weights['Child Expenses'] = kids * 3;
  }

  weights['Savings & Investment'] = 15;

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  const breakdown: BudgetBreakdown = {};
  for (const category in weights) {
    breakdown[category] = Math.round((weights[category] / totalWeight) * salary);
  }

  return breakdown;
}
