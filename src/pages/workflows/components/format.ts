export const fmtDate = (v?: number | string | null) => {
  if (v == null) return "";
  const d = new Date(typeof v === "string" ? Number(v) : v);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
};

export const msToSec = (ms?: number | null) => (ms ? Math.round(ms / 1000) : 0);