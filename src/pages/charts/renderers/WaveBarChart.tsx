import * as React from "react";
import { Box } from "@mui/material";
import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceDot,
  CartesianGrid,
  Tooltip,
  Label,
  LabelList,
} from "recharts";
import type { ChartConfig } from "../../types/chart";

type Point = { x: any; y: number };
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const TOP_OVERLAY_H = 56;

const DEFAULT_PEAK_INDEXES: number[] = [];

function CustomDot(props: any) {
  const { cx, cy } = props;
  if (cx == null || cy == null) return null;
  return (
    <g filter="url(#glow)">
      <circle cx={cx} cy={cy} r={3.5} fill="#FFFFFF" opacity={0.95} />
      <circle cx={cx} cy={cy} r={8} fill="rgba(200,140,255,0.35)" />
    </g>
  );
}

function normalizeX(raw: any, i: number) {
  if (raw == null) return i + 1;
  if (raw instanceof Date) return raw;
  if (typeof raw === "number") return raw;

  const s = String(raw).trim();
  const n = Number(s);
  if (s !== "" && Number.isFinite(n) && /^-?\d+(\.\d+)?$/.test(s)) return n;
  return s;
}

type Props = {
  config: ChartConfig;
  height?: number | string;
  onClose?: () => void;
};

export default function NeonWaveBars({ config, height = "100%" }: Props) {
  const xKey = config?.x ?? "x";
  const yKey = Array.isArray(config?.y) ? config.y[0] : (config?.y ?? "y");

  const [, setIsChartVisible] = React.useState(true);

  React.useEffect(() => {
    setIsChartVisible(true);
  }, [config]);

  const data = React.useMemo<Point[]>(() => {
    const src = Array.isArray(config?.data) ? config.data : [];
    const rows = src.map((r: any, i: number) => {
      const x = normalizeX(r?.[xKey] ?? r?.x, i);
      const yRaw = r?.[yKey] ?? r?.y;
      const y = Number(yRaw);
      return { x, y: Number.isFinite(y) ? y : 0 };
    });

    rows.sort((a, b) => a.y - b.y);
    return rows;
  }, [config, xKey, yKey]);

  const hasData = data.length > 0;

  const stats = React.useMemo(() => {
    if (!hasData) return { maxVal: 0, maxIdx: 0, minVal: 0, minIdx: 0, avg: 0 };
    const ys = data.map((d) => d.y);
    const maxNum = Math.max(...ys);
    const minNum = Math.min(...ys);
    const maxVal = maxNum.toFixed(1);
    const minVal = minNum.toFixed(1);
    const maxIdx = ys.indexOf(maxNum);
    const minIdx = ys.indexOf(minNum);
    const avg = Math.round(ys.reduce((a, b) => a + b, 0) / Math.max(1, ys.length));
    return { maxVal, maxIdx, minVal, minIdx, avg };
  }, [data, hasData]);

  const [range, setRange] = React.useState<[number, number]>([0, Math.max(0, data.length - 1)]);
  React.useEffect(() => setRange([0, Math.max(0, data.length - 1)]), [data.length]);

  const displayed = React.useMemo(() => data.slice(range[0], range[1] + 1), [data, range]);

  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const hoverIdxRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    hoverIdxRef.current = hoverIdx;
  }, [hoverIdx]);

  const isXNumeric = React.useMemo(() => typeof displayed?.[0]?.x === "number", [displayed]);

  const xTicks = React.useMemo(() => {
    if (!isXNumeric) return undefined;
    const n = displayed.length;
    const target = 8;
    const step = Math.max(1, Math.round(n / target));
    const t: number[] = [];
    for (let i = 0; i < n; i += step) {
      const v = displayed[i]?.x;
      if (typeof v === "number") t.push(v);
    }
    const last = displayed[n - 1]?.x;
    if (typeof last === "number" && last !== t[t.length - 1]) t.push(last);
    return t;
  }, [displayed, isXNumeric]);

  const barSize = React.useMemo(() => {
    const n = Math.max(1, displayed.length);
    return clamp(Math.round(380 / n), 3, 12);
  }, [displayed.length]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !hasData) return;

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      const dir = ev.deltaY < 0 ? -1 : 1;
      const minSpan = Math.min(12, data.length);
      const maxSpan = data.length;
      const currentSpan = range[1] - range[0] + 1;
      const newSpan =
        dir < 0 ? Math.max(minSpan, Math.round(currentSpan * 0.85)) : Math.min(maxSpan, Math.round(currentSpan * 1.15));
      const center = hoverIdxRef.current ?? Math.floor((range[0] + range[1]) / 2);
      const start = clamp(center - Math.floor(newSpan / 2), 0, data.length - newSpan);
      setRange([start, start + newSpan - 1]);
    };

    const blockTouch = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    el.addEventListener("touchmove", blockTouch, { passive: false, capture: true });

    const svg = el.querySelector("svg");
    if (svg) svg.addEventListener("wheel", onWheel, { passive: false, capture: true });

    return () => {
      el.removeEventListener("wheel", onWheel as any, { capture: true } as any);
      el.removeEventListener("touchmove", blockTouch as any, { capture: true } as any);
      if (svg) svg.removeEventListener("wheel", onWheel as any, { capture: true } as any);
    };
  }, [data.length, range, hasData]);
  const yDomain = React.useMemo<[number, number]>(() => {
    const lo = Number(stats.minVal);
    const hi = Number(stats.maxVal);
    if (hi <= lo) return [lo - 1, hi + 1];
    const pad = Math.max(1, Math.round((hi - lo) * 0.1));
    return [Math.floor(lo - pad), Math.ceil(hi + pad)];
  }, [stats.minVal, stats.maxVal]);
  const WaveTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const first =
      payload.find((p: any) => p?.dataKey === "y") ?? payload[0];

    const val = first?.value;

    return (
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 8,
          padding: "8px 10px",
          color: "#000",
          boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4 }}>
          {`${xKey}: ${label}`}
        </div>
        <div style={{ fontWeight: 600 }}>
          {`${yKey}: ${fmtNum(val, 1)}`}
        </div>
      </div>
    );
  };
  const margin = React.useMemo(
    () => ({
      top: TOP_OVERLAY_H,
      right: 16,
      bottom: 4,
      left: 2,
    }),
    []
  );
  const fmtNum = (v: any, digits = 1) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(digits) : "";
  };

  const BarValueLabel = (props: any) => {
    const { x, y, value } = props;
    if (x == null || y == null) return null;
    return (
      <text
        x={x}
        y={y - 6}
        textAnchor="middle"
        fill="rgba(255,255,255,0.95)"
        fontSize={12}
        fontWeight={800}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={1}
        paintOrder="stroke"
      >
        {fmtNum(value, 1)}
      </text>
    );
  };
  const InfoBadge = ({
    label,
    value,
    sub,
    colorFrom,
    colorTo,
  }: {
    label: string;
    value: number | string;
    sub?: string;
    colorFrom: string;
    colorTo: string;
  }) => (
    <Box
      sx={{
        px: 1.25,
        py: 0.9,
        borderRadius: 999,
        display: "grid",
        gridTemplateRows: "auto auto",
        gap: 0.25,
        minWidth: 80,
        background: `linear-gradient(180deg, ${colorFrom} 0%, ${colorTo} 100%)`,
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
    >
      <Box sx={{ fontSize: 11, fontWeight: 700, opacity: 0.9 }}>{label}</Box>
      <Box sx={{ fontSize: 13, fontWeight: 800, lineHeight: 1 }}>{value}{sub && <Box component="span" sx={{ ml: 0.75, opacity: 0.75, fontSize: 11 }}>{sub}</Box>}</Box>
    </Box>
  );

  return (
    <Box
      ref={containerRef}
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      sx={{
        position: "relative",
        width: "100%",
        height,
        minHeight: 220,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 3,
        p: 2,
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "none",
        overflow: "hidden",
        overscrollBehavior: "contain",
        touchAction: "none",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          gap: 1.5,
          zIndex: 2,
        }}
      >
        <InfoBadge label="avg" value={stats.avg} colorFrom="rgba(167,139,250,0.35)" colorTo="rgba(167,139,250,0.15)" />
        <InfoBadge label="max" value={stats.maxVal} colorFrom="rgba(240,171,252,0.35)" colorTo="rgba(240,171,252,0.15)" />
        <InfoBadge label="min" value={stats.minVal} colorFrom="rgba(147,197,253,0.35)" colorTo="rgba(147,197,253,0.15)" />
      </Box>

      {/* close button */}
      {/* <IconButton
        aria-label="Close"
        onClick={handleClose}
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
        <CloseRounded fontSize="small" />
      </IconButton> */}

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={displayed}
          margin={margin}
          barCategoryGap="20%"
          barGap={2}
          onMouseMove={(e: any) => {
            const i = e?.activeTooltipIndex;
            if (i != null && i >= 0) setHoverIdx(range[0] + i);
          }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D58CFF" />
              <stop offset="100%" stopColor="#5B3CFB" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid vertical={false} stroke="rgba(230,230,255,0.12)" strokeDasharray="3 3" />

          <XAxis
            dataKey="x"
            type={isXNumeric ? "number" : "category"}
            ticks={xTicks}
            tick={{ fill: "rgba(240,238,255,0.85)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(230,230,255,0.28)" }}
          />

          <YAxis
            width={46}
            type="number"
            domain={yDomain}
            tick={{ fill: "rgba(240,238,255,0.78)", fontSize: 11 }}
            tickFormatter={(v: number) => v.toFixed(0)}
            tickMargin={4}
            tickLine={false}
            axisLine={{ stroke: "rgba(230,230,255,0.20)" }}
            tickCount={6}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              color: "#000",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
            content={<WaveTooltip />}
            formatter={(value) => [
              Number(value ?? 0),
              String(yKey),
            ]}     
           labelFormatter={(label: any) => `${xKey}: ${label}`}
          />

          <Bar
            dataKey="y"
            fill="url(#barGrad)"
            barSize={barSize}
            radius={[6, 6, 0, 0]}
            maxBarSize={14}
          >
            <LabelList dataKey="y" content={<BarValueLabel />} />
          </Bar>
          <Area
            type="monotone"
            dataKey="y"
            stroke="url(#lineGrad)"
            strokeWidth={3}
            fill="transparent"
            dot={false}
            activeDot={<CustomDot />}
            filter="url(#glow)"
          />

          {DEFAULT_PEAK_INDEXES.map((i) => clamp(i, 0, data.length - 1))
            .filter((i) => i >= range[0] && i <= range[1])
            .map((i) => (
              <ReferenceDot key={i} x={data[i].x} y={data[i].y} r={0.1} fill="transparent">
                <Label
                  value={data[i].y.toFixed(1)}
                  position="top"
                  fill="rgba(255,255,255,0.9)"
                  fontSize={12}
                  offset={10}
                />
              </ReferenceDot>
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}