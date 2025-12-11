import * as React from "react";
import { Box, IconButton } from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import type { ChartConfig } from "../../types/chart";

const DEMO = [
  { x: "A-8382-K8", y: 1 },
  { x: "B-8186-M1", y: 0.8 },
  { x: "B-9573-L4", y: 0.5 },
  { x: "B-7906-K2", y: 0.2 }
];

type Props = {
  config: ChartConfig;
  height?: number | string;
  onClose?: () => void;
  showClose?: boolean;
};

export default function NeonLineChart({
  config,
  height = "100%",
  onClose,
  showClose = true,
}: Props) {
  const xKey = config?.x ?? "x";
  const yKey = Array.isArray(config?.y) ? config.y[0] : config?.y ?? "y";

  const rows = React.useMemo(() => {
    const src = Array.isArray(config?.data) ? config.data : DEMO;
    return src.map((r: any) => ({
      x: r?.[xKey] ?? r?.x,
      y: r?.[yKey] ?? r?.y
    }));
  }, [config, xKey, yKey]);

  const ext = React.useMemo(() => {
    const xs = rows.map(d => d.x);
    const ys = rows.map(d => d.y);
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const pad = Math.max(2, Math.round((yMax - yMin) * 0.08));
    return { xMin, xMax, yMin: yMin - pad, yMax: yMax + pad };
  }, [rows]);

  const [xRange, setXRange] = React.useState<[number, number]>([ext.xMin, ext.xMax]);
  const [yRange, setYRange] = React.useState<[number, number]>([ext.yMin, ext.yMax]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      ev.stopPropagation();

      const factor = ev.deltaY < 0 ? 0.85 : 1.15;
      const zoomBoth = ev.ctrlKey || ev.metaKey;
      const zoomYOnly = !zoomBoth && ev.shiftKey;
      const zoomXOnly = !zoomBoth && !zoomYOnly;

      const zoom = (
        cur: [number, number],
        full: [number, number],
        set: React.Dispatch<React.SetStateAction<[number, number]>>
      ) => {
        const [a, b] = cur;
        const [fa, fb] = full;
        const span = b - a;
        const fullSpan = fb - fa;
        const newSpan = Math.max(span * factor, Math.max(fullSpan * 0.05, 1e-6), fullSpan);
        const center = (a + b) / 2;
        const na = Math.max(center - newSpan / 2, fa);
        set([na, na + newSpan]);
      };

      if (zoomBoth || zoomXOnly) zoom(xRange, [ext.xMin, ext.xMax], setXRange);
      if (zoomBoth || zoomYOnly) zoom(yRange, [ext.yMin, ext.yMax], setYRange);
    };

    el.addEventListener("wheel", onWheel, { passive: false, capture: true });

    return () => {
      el.removeEventListener("wheel", onWheel as any);
    };
  }, [xRange, yRange, ext]);

  const margin = React.useMemo(() => ({
    top: 12,
    right: 16,
    bottom: 0,
    left: 4
  }), []);

  const [isChartVisible, setIsChartVisible] = React.useState(true);

  const handleClose = () => {
    setIsChartVisible(false);
    if (onClose) onClose();
  };

  return (
    <>
      {isChartVisible && (
        <Box
          ref={containerRef}
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          sx={{
            position: "relative",
            width: "100%",
            height,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 4,
            p: 2,
            color: "#fff",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
            overscrollBehavior: "contain"
          }}
        >
          {/* {showClose && (
            <IconButton
              aria-label="Close"
              onClick={handleClose}
              disabled={!onClose}
              size="small"
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 28,
                height: 28,
                zIndex: 50,
                color: "#fff",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.18)",
                "&:hover": { background: "rgba(255,255,255,0.12)" },
              }}
            >
              <CloseRounded fontSize="small" />
            </IconButton>
          )} */}

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={margin}>
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="neon-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#B388FF" />
                  <stop offset="100%" stopColor="#8C9EFF" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(230,230,255,0.12)" strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                tick={{ fill: "rgba(240,238,255,0.85)", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "rgba(230,230,255,0.28)" }}
              />
              <YAxis
                width={38}
                domain={[ext.yMin, ext.yMax]}
                tick={{ fill: "rgba(240,238,255,0.85)", fontSize: 12 }}
                tickMargin={4}
                tickLine={false}
                axisLine={{ stroke: "rgba(230,230,255,0.28)" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(255,255,255,0.8)", border: "none", color: "#000" }}
                formatter={(value: number) => [value, String(yKey)]}
                labelFormatter={(label: any) => `${xKey}: ${label}`}
              />

              <Line
                type="monotone"
                dataKey="y"
                stroke="url(#neon-gradient)"
                strokeWidth={3}
                dot={{ r: 4, stroke: "#fff", strokeWidth: 1 }}
                filter="url(#glow)"
                isAnimationActive
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </>
  );
}
