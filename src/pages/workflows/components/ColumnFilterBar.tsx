import * as React from "react";
import {
  Box, Button, FormControl, IconButton, Menu, MenuItem,
  Select, Stack, Typography, TextField as MuiTextField
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useListContext } from "react-admin";
import { C } from "./uiTokens";
import theme from "../../../theme";

type RowType = "text" | "select" | "date";
type Preset = "last7" | "last30" | "custom";

type FilterRow = {
  id: string;
  field: string;
  type: RowType;
  value?: string;
  datePreset?: Preset;
  from?: Date | null;
  to?: Date | null;
  collapsed?: boolean;
};

const CONTROL_SX = {
  "& .MuiInputBase-root": {
    minHeight: 28, fontSize: 12, px: 1, py: 0, bgcolor: C.surface, color: C.text, borderRadius: 0.75,
  },
  "& .MuiInputBase-input": { py: "4px !important", fontSize: 12 },
  "& .MuiInputLabel-root": { fontSize: 11, top: -4 },
  "& fieldset": { borderColor: C.border },
};

const OPTIONS = [
  { label: "Call ID", field: "call_id", type: "text" as const },
  { label: "Status", field: "call_status", type: "select" as const },
  { label: "Direction", field: "direction", type: "select" as const },
  { label: "From", field: "from_number", type: "text" as const },
  { label: "To", field: "to_number", type: "text" as const },
  { label: "Agent", field: "agent_name", type: "select" as const },
  { label: "Started", field: "start_timestamp", type: "date" as const },
  { label: "Duration (ms)", field: "duration_ms", type: "text" as const },
  { label: "Cost (cents)", field: "call_cost.combined_cost", type: "text" as const },
];

const lastNDays = (n: number) => {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - n);
  return { from, to };
};

export default function ColumnFilterBar() {
  const { data, setFilters, filterValues } = useListContext();

  const records = React.useMemo<any[]>(() => {
    if (Array.isArray(data)) return data as any[];
    if (data && typeof data === "object") return Object.values(data as any);
    return [];
  }, [data]);

  const distinctFrom = React.useCallback((key: string) => {
    const s = new Set<string>();
    for (const r of records) {
      const v = r?.[key];
      if (v != null && v !== "") s.add(String(v));
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const statusValues = React.useMemo(() => distinctFrom("call_status"), [distinctFrom]);
  const dirValues = React.useMemo(() => distinctFrom("direction"), [distinctFrom]);
  const agentValues = React.useMemo(() => distinctFrom("agent_name"), [distinctFrom]);
  const valuesForField = (f: string) =>
    f === "call_status" ? statusValues : f === "direction" ? dirValues : f === "agent_name" ? agentValues : [];

  const [rows, setRows] = React.useState<FilterRow[]>([]);
  const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(menuEl);

  const usedFields = new Set(rows.map((r) => r.field));
  const availableToAdd = OPTIONS.filter((f) => !usedFields.has(f.field));

  const addRow = (opt: (typeof OPTIONS)[number]) =>
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        field: opt.field,
        type: opt.type,
        value: "",
        datePreset: opt.type === "date" ? "last7" : undefined,
        ...(opt.type === "date" ? lastNDays(7) : {}),
        collapsed: false,
      },
    ]);

  const removeRow = (id: string) => setRows((p) => p.filter((r) => r.id !== id));
  const updateRow = (id: string, patch: Partial<FilterRow>) =>
    setRows((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const hasValue = (r: FilterRow) => (r.type !== "date" ? !!(r.value && r.value.trim()) : !!(r.from || r.to));
  const labelFor = (f: string) => OPTIONS.find((o) => o.field === f)?.label ?? f;

  const buildFilterObject = React.useCallback((rowsIn: FilterRow[]) => {
    const out: Record<string, any> = {};
    for (const r of rowsIn) {
      if (r.type === "text") {
        const v = (r.value ?? "").trim();
        if (!v) continue;
        if (r.field === "duration_ms") {
          const needle = v.replace(/[^\d.]/g, "");
          if (needle) out.duration_contains = needle;
          continue;
        }
        if (r.field === "call_cost.combined_cost") {
          const q = (r.value ?? "").trim();
          const needle = q.replace(/[^\d.]/g, "");
          if (needle) out.cost_contains = needle;
          continue;
        }
        out[r.field] = v;
      } else if (r.type === "select") {
        if (r.value) out[r.field] = r.value;
      } else if (r.type === "date") {
        const f = r.from ?? null;
        const t = r.to ?? null;
        if (f || t) {
          out[r.field] = {
            ...(f ? { gte: (f as Date).getTime() } : {}),
            ...(t ? { lte: (t as Date).getTime() } : {}),
          };
        }
      }
    }
    return out;
  }, []);

  const timerRef = React.useRef<number | undefined>(undefined);
  React.useEffect(() => {
    const payload = buildFilterObject(rows);
    const same = JSON.stringify(payload) === JSON.stringify(filterValues ?? {});
    const push = () => !same && setFilters(payload, undefined, false);

    const hasText = rows.some(r => r.type === "text");
    const delay = hasText ? 250 : 150;

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(push, delay) as unknown as number;
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [rows, buildFilterObject, setFilters, filterValues]);

  const handlePreset = (row: FilterRow, preset: Preset) => {
    if (preset === "last7") updateRow(row.id, { datePreset: preset, ...lastNDays(7), collapsed: true });
    else if (preset === "last30") updateRow(row.id, { datePreset: preset, ...lastNDays(30), collapsed: true });
    else updateRow(row.id, { datePreset: "custom" });
  };

  const clearAll = () => {
    setRows([]);
    setFilters({}, {});
  };

  return (
    <Box
      sx={{
        px: 1, py: 0.5, borderRadius: 0.75, bgcolor: C.surfaceHi, border: `1px solid ${C.border}`,
        color: C.text, display: "flex", flexDirection: "column", minWidth: 320, maxWidth: 900,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 28 }}>
        <FilterListIcon sx={{ fontSize: theme.typography.body2, color: C.textDim }} />
        <Typography variant="caption" sx={{ fontSize: theme.typography.body2, color: C.text }}>Filters</Typography>
        <Box sx={{ flex: 1 }} />
        <Button
          size="small"
          startIcon={<AddIcon sx={{ fontSize: theme.typography.body2 }} />}
          onClick={(e) => setMenuEl(e.currentTarget)}
          sx={{ color: C.text, textTransform: "none", minHeight: 28, px: 1.25, py: 0 }}
          disabled={availableToAdd.length === 0}
        >
          <Typography variant="caption" sx={{ fontSize: theme.typography.body2 }}>Add filter</Typography>
        </Button>
        <Menu
          anchorEl={menuEl}
          open={openMenu}
          onClose={() => setMenuEl(null)}
          slotProps={{ paper: { sx: { bgcolor: C.surface, color: C.text } } as any }}
          MenuListProps={{ dense: true }}
        >
          {availableToAdd.length === 0 && <MenuItem disabled sx={{ fontSize: theme.typography.body2 }}>All fields added</MenuItem>}
          {availableToAdd.map((opt) => (
            <MenuItem key={opt.field} onClick={() => { addRow(opt); setMenuEl(null); }} dense>
              {opt.label}
            </MenuItem>
          ))}
        </Menu>
        <Button size="small" onClick={clearAll}
          sx={{ color: C.textFaint, textTransform: "none", minHeight: 28, px: 1.25, py: 0 }}>
          <Typography variant="caption" sx={{ fontSize: theme.typography.body2 }}>Clear all</Typography>
        </Button>
      </Stack>

      <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap">
        {rows.map((row) =>
          row.collapsed && hasValue(row) ? (
            <CollapsedPill
              key={row.id}
              row={row}
              labelFor={labelFor}
              hasValue={hasValue}
              onExpand={() => updateRow(row.id, { collapsed: false })}
              onRemove={() => removeRow(row.id)}
            />
          ) : (
            <EditorRow
              key={row.id}
              row={row}
              valuesForField={valuesForField}
              labelFor={labelFor}
              onChange={(patch) => updateRow(row.id, patch)}
              onRemove={() => removeRow(row.id)}
              onCollapse={() => updateRow(row.id, { collapsed: hasValue(row) })}
              onPreset={(p) => handlePreset(row, p)}
            />
          )
        )}
      </Stack>
    </Box>
  );
}

function CollapsedPill({
  row, labelFor, onExpand, onRemove,
}: {
  row: FilterRow;
  labelFor: (f: string) => string;
  hasValue: (r: FilterRow) => boolean;
  onExpand: () => void;
  onRemove: () => void;
}) {
  const valueSummary = (r: FilterRow) => {
    if (r.type !== "date") return r.value || "—";
    if (r.datePreset === "last7") return "Last 7 days";
    if (r.datePreset === "last30") return "Last 30 days";
    const a = r.from ? new Date(r.from).toLocaleString() : "";
    const b = r.to ? new Date(r.to).toLocaleString() : "";
    if (a && b) return `${a} → ${b}`;
    if (a) return `from ${a}`;
    if (b) return `to ${b}`;
    return "—";
  };

  return (
    <Box
      onClick={onExpand}
      sx={{
        display: "inline-flex", alignItems: "center", px: 1, py: 0.25,
        borderRadius: 999, border: `1px solid ${C.border}`, bgcolor: C.surface, cursor: "pointer",
        minHeight: 26, "&:hover": { borderColor: C.accent },
      }}
      title="Click to edit"
    >
      <Box sx={{ gap: 0.5, display: "flex", alignItems: "center", mr: 0.5 }}>
        <Typography variant="caption" sx={{ color: C.textFaint, fontSize: 11 }}>
          {labelFor(row.field)}:
        </Typography>
        <Typography sx={{
          fontSize: theme.typography.body2, color: C.text, maxWidth: 70, overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {valueSummary(row)}
        </Typography>
      </Box>

      <Box sx={{ gap: 0.1, display: "flex", alignItems: "center" }}>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onExpand(); }}
          sx={{ color: "success.main", ml: 0.25, width: 22, height: 22 }}>
          <EditIcon sx={{ fontSize: theme.typography.body2 }} />
        </IconButton>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRemove(); }}
          sx={{ color: "error.main", width: 22, height: 22 }}>
          <DeleteIcon sx={{ fontSize: theme.typography.body2 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

function EditorRow({
  row, valuesForField, labelFor, onChange, onRemove, onCollapse, onPreset,
}: {
  row: FilterRow;
  valuesForField: (f: string) => string[];
  labelFor: (f: string) => string;
  onChange: (patch: Partial<FilterRow>) => void;
  onRemove: () => void;
  onCollapse: () => void;
  onPreset: (p: Preset) => void;
}) {
  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 0.5, px: 0.5, py: 0.25,
      borderRadius: 0.5, bgcolor: C.surface, border: `1px solid ${C.border}`, width: "fit-content",
    }}>
      <Typography sx={{ fontSize: theme.typography.body2, color: C.textFaint }}>
        {labelFor(row.field)}
      </Typography>

      {row.type === "text" && (
        <MuiTextField
          size="small"
          placeholder="Type to filter…"
          value={row.value ?? ""}
          onChange={(e) => onChange({ value: e.target.value })}
          sx={{
            width: 140, ...CONTROL_SX,
            "& .MuiInputBase-root": { fontSize: theme.typography.body2, px: 0.5, py: 0, minHeight: 28, bgcolor: C.surface, color: C.text, borderRadius: 0.75 },
            "& .MuiInputBase-input": { fontSize: theme.typography.body2, pl: 0.5, pr: 0.5, py: "4px" },
            "& fieldset": { borderColor: C.border },
          }}
        />
      )}

      {row.type === "select" && (
        <FormControl size="small" sx={{ minWidth: 140, ...CONTROL_SX }}>
          <Select
            value={row.value ?? ""}
            onChange={(e) => onChange({ value: e.target.value as string, collapsed: !!e.target.value })}
            displayEmpty
            MenuProps={{ PaperProps: { sx: { bgcolor: C.surface, color: C.text } }, MenuListProps: { dense: true } }}
          >
            <MenuItem value="" sx={{ fontSize: theme.typography.body2 }}><em>All</em></MenuItem>
            {valuesForField(row.field).map((v) => (
              <MenuItem key={v} value={v} dense sx={{ fontSize: theme.typography.body2 }}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {row.type === "date" && (
        <>
          <FormControl size="small" sx={{ minWidth: 120, ...CONTROL_SX }}>
            <Select
              value={row.datePreset ?? "last7"}
              onChange={(e) => onPreset(e.target.value as Preset)}
              MenuProps={{ PaperProps: { sx: { bgcolor: C.surface, color: C.text } }, MenuListProps: { dense: true } }}
            >
              <MenuItem value="last7" dense sx={{ fontSize: theme.typography.body2 }}>Last 7 days</MenuItem>
              <MenuItem value="last30" dense sx={{ fontSize: theme.typography.body2 }}>Last 30 days</MenuItem>
              <MenuItem value="custom" dense sx={{ fontSize: theme.typography.body2 }}>Custom</MenuItem>
            </Select>
          </FormControl>

          <DateTimePicker
            label="From"
            value={row.from ?? null}
            onChange={(v) => onChange({ from: v as any, datePreset: "custom" })}
            slotProps={{ textField: { size: "small", sx: { ...CONTROL_SX, minWidth: 200, "& .MuiInputBase-input": { py: "6px" } } } }}
          />
          <DateTimePicker
            label="To"
            value={row.to ?? null}
            onChange={(v) => onChange({ to: v as any, datePreset: "custom" })}
            slotProps={{ textField: { size: "small", sx: { ...CONTROL_SX, minWidth: 200, "& .MuiInputBase-input": { py: "6px" } } } }}
          />
        </>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.1 }}>
        <IconButton size="small" onClick={onCollapse}
          sx={{ color: "success.main", width: 28, height: 28, "&:hover": { bgcolor: C.hover } }} title="Collapse">
          <CheckIcon sx={{ fontSize: theme.typography.body2 }} />
        </IconButton>
        <IconButton size="small" onClick={onRemove}
          sx={{ color: "error.main", width: 28, height: 28, "&:hover": { bgcolor: C.hover } }} title="Remove">
          <DeleteIcon sx={{ fontSize: theme.typography.body2 }} />
        </IconButton>
      </Box>
    </Box>
  );
}