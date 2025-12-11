import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridSortDirection } from "@mui/x-data-grid";
import { useListContext } from "react-admin";
import { Chip } from "@mui/material";
import { fmtDate, msToSec } from "./format";

export default function CallsGrid() {
  const { data = [], isLoading, page, setPage, perPage, setPerPage, sort, setSort, total } =
    useListContext<any>();

  const rows = React.useMemo(() => {
    const arr = Array.isArray(data) ? data : Object.values(data || {});
    return arr.map((r: any) => ({
      ...r,
      id: r.id ?? r.call_id ?? crypto.randomUUID(),
      from_number: (r.from_number ?? "").replace(/\s+/g, ""),
      to_number: (r.to_number ?? "").replace(/\s+/g, ""),
      cost: r?.call_cost?.combined_cost ?? null,
    }));
  }, [data]);

  const columns = React.useMemo<GridColDef[]>(() => [
    { field: "call_id", headerName: "Call ID", flex: 1, minWidth: 220, resizable: true },
    {
      field: "call_status", headerName: "Status", minWidth: 120, resizable: true, sortable: true,
      renderCell: ({ value }) => <Chip size="small" label={value ?? "-"} />
    },
    {
      field: "direction", headerName: "Direction", minWidth: 120, resizable: true, sortable: true,
      renderCell: ({ value }) => (
        <Chip size="small" label={value ?? "-"} color="primary" variant="outlined" />
      )
    },
    { field: "from_number", headerName: "From", minWidth: 160, flex: .6, resizable: true, sortable: true },
    { field: "to_number", headerName: "To", minWidth: 160, flex: .6, resizable: true, sortable: true },
    {
      field: "start_timestamp", headerName: "Started", minWidth: 200, flex: .8, resizable: true, sortable: true,
      valueGetter: (p: { row: any }) => fmtDate((p.row as any)?.start_timestamp)
    },
    {
      field: "duration_ms", headerName: "Duration", minWidth: 110, resizable: true, sortable: true,
      valueGetter: (p: { row: any }) => `${msToSec((p.row as any)?.duration_ms ?? 0)}s`
    },
    { field: "agent_name", headerName: "Agent", minWidth: 200, flex: .8, resizable: true, sortable: true },
    {
      field: "cost", headerName: "Cost", minWidth: 100, resizable: true, sortable: true,
      valueGetter: (p: { row: any }) => {
        const dollars = (p.row as any)?.cost;
        return dollars != null ? `$${Number(dollars).toFixed(2)}` : "-";
      }
    },
  ], []);

  const valid = new Set(columns.map(c => c.field));
  const sortModel = sort?.field && valid.has(sort.field)
    ? [{ field: sort.field, sort: (sort.order?.toLowerCase() as GridSortDirection) ?? "asc" }]
    : [];

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        disableColumnSelector
        disableRowSelectionOnClick
        pagination paginationMode="server"
        rowCount={total ?? 0}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={{ page: Math.max(0, (page ?? 1) - 1), pageSize: perPage ?? 25 }}
        onPaginationModelChange={(m) => {
          if (m.pageSize !== perPage) setPerPage(m.pageSize);
          if (m.page + 1 !== page) setPage(m.page + 1);
        }}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(m) => {
          const s = m?.[0];
          if (!s || !valid.has(s.field)) return setSort(undefined as any);
          setSort({ field: s.field, order: (s.sort?.toUpperCase() as "ASC" | "DESC") ?? "ASC" });
        }}
        sx={{
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "#191F36" },
          "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle": { color: "rgba(230,235,255,0.92)" },
          "& .MuiDataGrid-columnSeparator": { color: "rgba(160,170,200,0.28)" }, // the resizer handle
        }}
      />
    </div>
  );
}
