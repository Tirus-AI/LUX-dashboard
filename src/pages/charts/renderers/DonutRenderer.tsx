import * as React from "react";
import { Box, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ChartConfig } from "../../types/chart";

type Row = { name: string; value: number; color?: string };

type Props = {
  config: ChartConfig;
  height?: number | string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  maxLabels?: number;
  startAngle?: number;
  endAngle?: number;
  baseHue?: number;
  onClose?: () => void;
};

const RAD = Math.PI / 180;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function solidPurplePalette(n: number, hue = 280) {
  const L_MIN = 36, L_MAX = 72, SAT = 88;
  if (n <= 1) return [`hsl(${hue}deg ${SAT}% 56%)`];
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const L = L_MIN + (L_MAX - L_MIN) * t;
    return `hsl(${hue}deg ${SAT}% ${L}%)`;
  });
}

const makeOuterLabel =
  (step: number) =>
    ({ cx, cy, midAngle, outerRadius, percent, index }: any) => {
      if (index == null || index % step !== 0 || percent == null) return null;
      const r = (Number(outerRadius) || 0) + 14;
      const x = cx + r * Math.cos(-midAngle * RAD);
      const y = cy + r * Math.sin(-midAngle * RAD);
      const anchor = x > cx ? "start" : "end";
      const pct = `${Math.round(percent * 100)}%`;
      return (
        <text
          x={x}
          y={y}
          fill="rgba(230, 210, 255, 0.95)"
          fontSize={14}
          fontWeight={700}
          textAnchor={anchor}
          dominantBaseline="central"
        >
          {pct}
        </text>
      );
    };

export default function NeonDonutChartDynamic({
  config,
  height = "100%",
  innerRadius = "58%",
  outerRadius = "80%",
  maxLabels = 8,
  startAngle = 90,
  endAngle = -270,
  baseHue = 280,
  onClose,
}: Props) {
  const [isChartVisible, setIsChartVisible] = React.useState(true);

  React.useEffect(() => {
    setIsChartVisible(true);
  }, [config]);

  const nameKey = config?.x ?? "name";
  const valueKey = Array.isArray(config?.y) ? config.y[0] : (config?.y ?? "value");

  const rows = React.useMemo<Row[]>(() => {
    const src = Array.isArray(config?.data) && config.data.length ? config.data : [];
    return src.map((r: any) => ({
      name: r?.[nameKey] ?? r?.name,
      value: Number(r?.[valueKey] ?? r?.value),
      color: r?.color,
    }));
  }, [config, nameKey, valueKey]);

  const n = rows.length;
  const colors = React.useMemo(() => {
    const palette = solidPurplePalette(n, baseHue);
    return rows.map((d, i) => d.color ?? palette[i]);
  }, [rows, n, baseHue]);

  const step = React.useMemo(
    () => clamp(Math.ceil(n / clamp(maxLabels, 1, 100)), 1, 100),
    [n, maxLabels]
  );

  const total = React.useMemo(
    () => rows.reduce((a, d) => a + (Number.isFinite(d.value) ? d.value : 0), 0) || 1,
    [rows]
  );

  const handleClose = () => {
    setIsChartVisible(false);
    if (onClose) onClose();
  };

  if (!isChartVisible) return null;

  return (
    <Box
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      sx={{
        position: "relative",
        width: "100%",
        height,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 3,
        p: 2,
        color: "#EDE7F6",
        border: "2px solid rgba(255,255,255,0.1)",
        overflow: "visible",
        WebkitTapHighlightColor: "transparent",
        "& *:focus": { outline: "none" },
        "& .recharts-sector": { outline: "none", cursor: "default" },
      }}
    >
      {/* <IconButton
        aria-label="Close"
        onClick={handleClose}  // Use internal handleClose
        size="small"
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 30,
          height: 30,
          color: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(255,255,255,0.18)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
          "&:hover": { background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))" },
          zIndex: 3,
        }}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton> */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 18, right: 24, bottom: 18, left: 24 }}>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              color: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
            formatter={(value: number, _name: string, p: any) => {
              const pct = ((Number(value) / total) * 100).toFixed(1) + "%";
              return [pct, p?.payload?.name ?? ""];
            }}
          />
          <Pie
            data={rows}
            cx="50%"
            cy="52%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            startAngle={startAngle}
            endAngle={endAngle}
            isAnimationActive
            animationDuration={600}
            label={makeOuterLabel(step)}
            labelLine={false}
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={1.25}
            paddingAngle={2}
          >
            {rows.map((d, i) => (
              <Cell key={d.name + i} fill={colors[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}