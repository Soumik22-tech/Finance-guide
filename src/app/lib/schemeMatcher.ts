import { GOVERNMENT_SCHEMES } from "./schemeData"
import { type GovernmentScheme } from "../types/schemes"
import { type FormData } from "@/app/types/budget"

export interface SchemeMatch {
  scheme: GovernmentScheme
  matchScore: number
  matchReasons: string[]
  priorityTag?: string
}

export function matchSchemes(
  salary: number,
  city: string,
  members: number,
  children: string,
  kids: number,
  house: string,
  maritalStatus: string
): SchemeMatch[] {
  const annualIncome = salary * 12
  const matches: SchemeMatch[] = []

  for (const scheme of GOVERNMENT_SCHEMES) {
    const e = scheme.eligibility
    const reasons: string[] = []
    let score = 0

    if (e.maxAnnualIncome && annualIncome > e.maxAnnualIncome) continue
    if (e.requiresGirlChild && (children !== "yes" || kids === 0)) continue
    if (e.requiresChildren && children !== "yes") continue
    if (e.maritalStatus && e.maritalStatus !== "any" && e.maritalStatus !== maritalStatus) continue
    if (e.housingStatus && e.housingStatus !== "any" && e.housingStatus !== house) continue

    score += 10
    reasons.push("You meet the basic eligibility criteria")

    if (annualIncome < 300000) { score += 30; reasons.push("Designed for your income level") }
    else if (annualIncome < 600000) { score += 20; reasons.push("Your income qualifies for this scheme") }
    else { score += 10; reasons.push("Open to all income levels") }

    if (scheme.category === "insurance" && salary < 50000) { score += 20; reasons.push("Critical protection for your income level") }
    if (scheme.category === "housing" && house === "rent") { score += 25; reasons.push("You currently rent — this scheme helps you own a home") }
    if (scheme.id === "ssy" && children === "yes" && kids > 0) { score += 40; reasons.push("You have children who can benefit from this") }
    if (scheme.id === "apy" && salary < 40000) { score += 20; reasons.push("Pension security is especially important at your income level") }
    if (scheme.category === "savings" && salary < 35000) { score += 15; reasons.push("High guaranteed returns suitable for your savings capacity") }

    let priorityTag: string | undefined
    if (score >= 70) priorityTag = "Highly Recommended"
    else if (score >= 50) priorityTag = "Recommended"

    matches.push({ scheme, matchScore: score, matchReasons: reasons, priorityTag })
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore)
}