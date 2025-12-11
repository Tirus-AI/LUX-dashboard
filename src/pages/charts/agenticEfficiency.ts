import type { ChartConfig } from "../types/chart";

export type AgenticInputs = {
  totalClaims: number;
  aiSpend: number;
  aiTimeMin: number;
  hourlyWage: number;
};

export function buildGroupedBarConfig({
  totalClaims,
  aiSpend,
  aiTimeMin,
  hourlyWage,
}: AgenticInputs): ChartConfig {
  const employeeCost = (aiTimeMin / 60) * hourlyWage;
  const efficiencyPct =
    employeeCost > 0 ? ((employeeCost - aiSpend) / employeeCost) * 100 : 0;

  return {
    x: "label",
    y: ["claims", "ai_spend", "ai_time_min", "employee_cost", "efficiency_pct"],
    data: [
      {
        label: "Summary",
        claims: totalClaims,
        ai_spend: Number(aiSpend.toFixed(2)),
        ai_time_min: aiTimeMin,
        employee_cost: Number(employeeCost.toFixed(2)),
        efficiency_pct: Number(efficiencyPct.toFixed(2)),
      },
    ],
    possible_charts: ["pie"],
  };
}

export function buildPieConfig({
  totalClaims,
  aiSpend,
  aiTimeMin,
  hourlyWage,
}: AgenticInputs): ChartConfig {
  const employeeCost = (aiTimeMin / 60) * hourlyWage;
  const efficiencyPct =
    employeeCost > 0 ? ((employeeCost - aiSpend) / employeeCost) * 100 : 0;

  return {
    x: "name",
    y: "value",
    data: [
      { name: "Total Claims", value: totalClaims },
      { name: "AI Spend ($)", value: Number(aiSpend.toFixed(2)) },
      { name: "AI Time (min)", value: aiTimeMin },
      { name: "Employee Cost ($)", value: Number(employeeCost.toFixed(2)) },
      { name: "Efficiency (%)", value: Number(efficiencyPct.toFixed(2)) },
    ],
    possible_charts: ["pie", "donut"],
  };
}