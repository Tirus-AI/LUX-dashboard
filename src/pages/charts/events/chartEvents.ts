// Global chart events (no deps)
import type { ChartType } from "../types/chart";

export const CHART_REMOVE_EVENT = "tirus-analytics:remove-chart";

export type ChartRemoveDetail = {
  itemId: string;        // the “card” or “widget” id this renderer belongs to
  type?: ChartType;      // optional if you remove only a sub-chart (e.g., "donut")
};

export function emitChartRemove(detail: ChartRemoveDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ChartRemoveDetail>(CHART_REMOVE_EVENT, { detail }));
}