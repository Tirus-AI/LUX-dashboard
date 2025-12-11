import * as React from "react";
import { Box } from "@mui/material";
import type { ChartConfig, ChartType } from "../types/chart";
import { renderChart } from "./ChartTypes";
import ChartShell from "./ChartShell";

type ChartTypeNoPie = Exclude<ChartType, "pie">;

const ORDER: readonly ChartTypeNoPie[] = ["donut", "wave_bar", "line"] as const;

const CARD_H_XS = 240;
const CARD_H_MD = 300;

function spanMd(type: ChartTypeNoPie): 6 | 12 {
  switch (type) {
    case "wave_bar":
    case "line":
      return 12;
    case "donut":
    default:
      return 6;
  }
}

type MultiChartRendererProps = {
  config: ChartConfig;
  onClose: (chartType: ChartTypeNoPie) => void;
};
export default function MultiChartRenderer({ config, onClose }: MultiChartRendererProps) {
  const types = React.useMemo<ChartTypeNoPie[]>(() => {
    const filtered = (config.possible_charts ?? []).filter(
      (t): t is ChartTypeNoPie => t !== "pie"
    );

    const set = new Set<ChartTypeNoPie>(filtered);

    const ordered = ORDER.filter((t) => set.has(t));
    const leftovers = filtered.filter((t) => !ORDER.includes(t));

    return [...ordered, ...leftovers];
  }, [config.possible_charts]);

  return (
    <Box
      sx={{
        display: "grid",
        gap: { xs: 1.5, md: 2 },
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(12, minmax(0, 1fr))",
        },
        alignItems: "stretch",
      }}
    >
      {types.map((type) => {
        const mdCols = spanMd(type);
        return (
          <Box
            key={type}
            sx={{
              gridColumn: {
                xs: "1 / -1",
                sm: mdCols >= 12 ? "1 / -1" : "span 1",
                md: `span ${mdCols}`,
              },
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <ChartShell>
              <Box sx={{ flex: 1, height: { xs: CARD_H_XS, md: CARD_H_MD } }}>
                {renderChart(type, config, { onClose: () => onClose(type) })}
              </Box>
            </ChartShell>
          </Box>
        );
      })}
    </Box>
  );
}