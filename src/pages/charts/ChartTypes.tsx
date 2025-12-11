import type { ChartConfig } from "../types/chart";
import LineChartRenderer from "./renderers/LineChartRenderer";
import DonutRenderer from "./renderers/DonutRenderer";
import WaveBarChart from "./renderers/WaveBarChart";

function ensureConfig(config: ChartConfig): ChartConfig {
  if (Array.isArray(config?.data) && config.data.length > 0) return config;

  return config;
}

type RenderOpts = { onClose?: () => void };

export function renderChart(type: string, config: ChartConfig, opts: RenderOpts = {}) {
  const cfg = ensureConfig(config);
  const onClose = opts.onClose ?? (() => { });
  const handleClose = () => {
    onClose();
  };

  switch (type) {
    case "line":
      return <LineChartRenderer config={cfg} onClose={handleClose} />;
    case "donut":
      return <DonutRenderer config={cfg} onClose={handleClose} />;
    case "wave_bar":
      return <WaveBarChart config={cfg} onClose={handleClose} />;
    default:
      return <div>Chart type {type} not implemented</div>;
  }
}

export default { renderChart };