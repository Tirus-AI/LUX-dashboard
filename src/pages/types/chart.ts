export type ChartType =
  | "line"
  | "donut"
  | "pie"         
  | "wave_bar";

export type ChartConfig = {
  x: string;
  y: string | string[];
  data: any[];
  possible_charts: ChartType[];
};
