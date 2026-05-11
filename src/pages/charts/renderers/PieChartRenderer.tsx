import * as React from "react";
import { Box, Typography } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

type Props = {
  agenticTimeMin: number | string;
  agenticCost: number | string;
  humanPayRate?: number | string;

  height?: number | string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  startAngle?: number;
  endAngle?: number;
  baseHue?: number;
  precision?: number;
  onClose?: () => void;
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const num = (v: unknown, def = 0) => (Number.isFinite(Number(v)) ? Number(v) : def);
const fmt$ = (n: number) =>
  (isFinite(n) ? n : 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

function solidPurplePair(hue = 280) {
  return [
    `hsl(${hue}deg 88% 46%)`,
    `hsl(${hue}deg 88% 68%)`,
  ] as const;
}

function CenterEfficiency({
  value,
  precision = 0,
  percentSize = 64,
  subtitleSize = 16,
}: {
  value: number;
  precision?: number;
  percentSize?: number;
  subtitleSize?: number;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <Typography fontWeight={600} fontSize={percentSize} lineHeight={1} color="#fff">
        {Number(value).toFixed(precision)}%
      </Typography>
      <Typography fontSize={subtitleSize} sx={{ opacity: 0.9 }}>
        Efficiency Gain
      </Typography>
    </Box>
  );
}

export default function NeonDonutCostEfficiency({
  agenticTimeMin,
  agenticCost,
  humanPayRate = 22,
  height = 360,
  innerRadius = "60%",
  outerRadius = "82%",
  startAngle = 90,
  endAngle = -270,
  baseHue = 280,
  precision = 0,
}: Props) {
  const [closed] = React.useState(false);
  if (closed) return null;

  const tMin = num(agenticTimeMin);
  const aCost = num(agenticCost);
  const pay = num(humanPayRate, 22);

  const humanHours = clamp(tMin, 0, Number.MAX_SAFE_INTEGER) / 60;
  const projectedEmployeeCost = clamp(humanHours * clamp(pay, 0, 1e9), 0, 1e12);
  const humanCostSafe = projectedEmployeeCost > 0 ? projectedEmployeeCost : 1;
  const agenticCostPct = (aCost * 100) / humanCostSafe;
  const efficiencyGain = clamp(100 - agenticCostPct, -999, 999);

  const data = [
    { name: "Agentic Cost", value: Math.max(0, aCost) },
    { name: "Projected Employee Cost", value: Math.max(0, projectedEmployeeCost) },
  ];

  const [colAgentic, colHuman] = solidPurplePair(baseHue);
  const colors = [colAgentic, colHuman];

  return (
    <Box
      sx={{
        position: "relative",
        width: "50%",
        height,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 3,
        p: 2.5,
        color: "#EDE7F6",
        border: "2px solid rgba(255,255,255,0.10)",
        outline: "none",
        '&:focus': {
          outline: 'none',
        },
        '& *': {
          outline: 'none !important',
        },
      }}
    >

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: 16,
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <Typography fontWeight={500} fontSize={32} color="#fff">
          COST EFFICIENCY
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          right: { xs: 24, sm: 32, md: 24, lg: 88, xl: 134 },
          top: { xs: 24, sm: 32, md: 44, lg: 44, xl: 44 },
          textAlign: "right",
        }}
      >
        <Typography fontWeight={500} fontSize={28} color="#fff">
          {fmt$(aCost)}
        </Typography>
        <Typography fontSize={14} sx={{ opacity: 0.85 }}>
          Agentic Cost
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: { xs: 24, sm: 32, md: 34, lg: 24, xl: 54 },
          bottom: { xs: 24, sm: 32, md: 24, lg: 44, xl: 40 },
          textAlign: "left",
        }}
      >
        <Typography fontWeight={500} fontSize={28} color="#fff">
          {fmt$(projectedEmployeeCost)}
        </Typography>
        <Typography fontSize={14} sx={{ opacity: 0.85 }}>
          Projected Employee Cost
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 32, right: 32, bottom: 32, left: 32 }}>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              color: "#111",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
            formatter={(value, name) => {
              const numericValue = Number(value ?? 0);
              const total = data.reduce((a, d) => a + d.value, 0) || 1;
              const pct = ((numericValue / total) * 100).toFixed(1) + "%";
              return [fmt$(numericValue) + " • " + pct, name];
            }}
          />

          <Pie
            data={data}
            cx="50%"
            cy="52%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            startAngle={startAngle}
            endAngle={endAngle}
            isAnimationActive
            animationDuration={650}
            labelLine={false}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1.25}
            paddingAngle={2}
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={colors[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <CenterEfficiency value={efficiencyGain} precision={precision} />
    </Box>
  );
}