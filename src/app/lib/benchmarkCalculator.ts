import {
  CITY_DATA,
  getSalaryBand,
  normalizeCityKey,
  getDeviationStatus,
  type DeviationStatus,
} from "./cityData";
import { type BudgetBreakdown } from "../types/budget";

export interface BenchmarkRow {
  category: string;
  userAmount: number;
  cityAvg: number;
  deviation: number; // percentage above/below avg (positive = above)
  status: DeviationStatus;
  label: string; // human-readable label e.g. "32% above average"
}

export interface BenchmarkResult {
  cityFound: boolean;
  cityName: string;
  cityNotes: string;
  costIndex: number;
  cheaperAreas: string[];
  recommendedSavingsRate: number;
  userSavingsRate: number;
  rows: BenchmarkRow[];
  biggestDeviation: BenchmarkRow | null; // for the AI prompt
  salaryBandLabel: string; // ADD THIS
}

const BENCHMARKED_CATEGORIES: Array<{
  key: string;
  label: string;
  budgetKeys: string[]; // multiple keys to check, uses first non-zero found
}> = [
  {
    key: "rent",
    label: "Rent / Housing",
    budgetKeys: ["Rent", "EMI", "Maintenance"], // priority order
  },
  {
    key: "food",
    label: "Food & Groceries",
    budgetKeys: ["Food & Groceries"],
  },
  {
    key: "transport",
    label: "Transportation",
    budgetKeys: ["Transportation"],
  },
  {
    key: "utilities",
    label: "Utilities",
    budgetKeys: ["Utilities"],
  },
];

export function calculateBenchmark(
  city: string,
  salary: number,
  breakdown: BudgetBreakdown
): BenchmarkResult {
  const cityKey = normalizeCityKey(city);
  const band = getSalaryBand(salary);
  // DEV CHECK: log band to verify correct band is selected
  if (process.env.NODE_ENV === "development") {
    console.log(`[Benchmark] Salary: ₹${salary.toLocaleString()} → Band: ${band}`);
  }

  const salaryBandLabels: Record<string, string> = {
    below_30k: "below ₹30K/month",
    "30k_60k": "₹30K–₹60K/month",
    "60k_1L": "₹60K–₹1L/month",
    above_1L: "above ₹1L/month",
  };

  if (!cityKey || !CITY_DATA[cityKey]) {
    return {
      cityFound: false,
      cityName: city,
      cityNotes: "",
      costIndex: 100,
      cheaperAreas: [],
      recommendedSavingsRate: 20,
      userSavingsRate: Math.round(
        ((breakdown["Savings & Investment"] || 0) / salary) * 100
      ),
      rows: [],
      biggestDeviation: null,
      salaryBandLabel: salaryBandLabels[band], // ADD THIS
    };
  }

  const data = CITY_DATA[cityKey];
  const bandData = data.salaryBands[band];
  const rows: BenchmarkRow[] = [];

  for (const cat of BENCHMARKED_CATEGORIES) {
    // Use first non-zero value from the list of possible budget keys
    const userAmount = cat.budgetKeys.reduce((found, key) => {
      if (found > 0) return found;
      return breakdown[key] || 0;
    }, 0);

    // Determine which housing key was actually used (for display label)
    const activeKey = cat.budgetKeys.find((k) => (breakdown[k] || 0) > 0) || cat.budgetKeys[0];

    // Build a contextual label for housing row
    const categoryLabel =
      cat.key === "rent" && activeKey !== "Rent"
        ? activeKey === "EMI"
          ? "EMI / Housing Loan"
          : "Home Maintenance"
        : cat.label;

    const avgData = bandData[cat.key as keyof typeof bandData] as {
      min: number; max: number; avg: number;
    };
    const cityAvg = avgData.avg;
    const deviation = Math.round(((userAmount - cityAvg) / cityAvg) * 100);
    const status = getDeviationStatus(userAmount, cityAvg);

    let label = "";
    if (deviation > 0) label = `${deviation}% above city average`;
    else if (deviation < 0) label = `${Math.abs(deviation)}% below city average`;
    else label = "At city average";

    rows.push({
      category: categoryLabel,
      userAmount,
      cityAvg,
      deviation,
      status,
      label,
    });
  }

  // Find biggest deviation for AI prompt
  const biggestDeviation = rows.reduce((max, row) =>
    Math.abs(row.deviation) > Math.abs(max.deviation) ? row : max
  , rows[0]);

  const userSavingsRate = Math.round(
    ((breakdown["Savings & Investment"] || 0) / salary) * 100
  );

  return {
    cityFound: true,
    cityName: data.city,
    cityNotes: data.notes,
    costIndex: data.costIndex,
    cheaperAreas: data.cheaperAreas,
    recommendedSavingsRate: bandData.savingsRate,
    userSavingsRate,
    rows,
    biggestDeviation,
    salaryBandLabel: salaryBandLabels[band], // ADD THIS
  };
}
