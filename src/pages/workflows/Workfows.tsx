import {
  AdminContext, ResourceContextProvider, List, DatagridConfigurable,
  TextField, FunctionField, BulkDeleteButton
} from "react-admin";
import { Box, Chip, GlobalStyles } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import callsDataProvider from "./callsDataProvider";
import { i18nProvider } from "../../i18nProvider";
import { C } from "../workflows/components/uiTokens";
import { fmtDate, msToSec } from "../workflows/components/format";

import CallExpandPanel from "../workflows/components/CallExpandPanel";
import ListPagination from "../workflows/components/ListPagination";
import ListActions from "../workflows/components/ListActions";
import theme from "../../theme";

const BulkActions = () => (
  <BulkDeleteButton
    label="Delete selected"
    confirmTitle="Delete selected calls?"
    confirmContent="This action cannot be undone."
    mutationMode="pessimistic"
    color="error"
    sx={{
      color: (t) => `${t.palette.error.main} !important`,
      "& .MuiSvgIcon-root": { color: (t) => `${t.palette.error.main} !important` },
      "&:hover": { backgroundColor: (t) => t.palette.error.main + "1A" },
    }}
  />
);

export default function Workflows() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AdminContext dataProvider={callsDataProvider} i18nProvider={i18nProvider}>
        <ResourceContextProvider value="calls">
          <GlobalStyles
            styles={{
              "body .MuiMenu-paper": {
                backgroundColor: `${C.surface} !important`,
                color: `${C.text} !important`,
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
              },
              "body .MuiMenu-paper .MuiMenu-list": {
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: "transparent !important",
              },
              "body .MuiMenu-paper .MuiMenuItem-root": {
                color: `${C.text} !important`,
                backgroundColor: "transparent !important",
              },
              "body .MuiMenu-paper .MuiMenuItem-root:hover": {
                backgroundColor: `${C.hover} !important`,
              },
              "body .MuiMenu-paper .MuiMenuItem-root.Mui-selected": {
                backgroundColor: `${C.selected} !important`,
                color: `${C.text} !important`,
              },
              "body .MuiMenu-paper .MuiMenuItem-root.Mui-selected:hover": {
                backgroundColor: `${C.hover} !important`,
              },
              "body .MuiTableSortLabel-root.Mui-active": {
                color: "rgba(255,255,255,0.65) !important",
              },
            "body .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon": {
              color: "rgba(255,255,255,0.65) !important",
              opacity: 1,
            },
            "body .MuiTableSortLabel-icon": {
              color: "rgba(255,255,255,0.65) !important",
            },
            }}
          />
          <Box sx={{ maxWidth: 1400, mx: "auto", pb: 3, px: 3, width: "100%" }}>
            <List
              resource="calls"
              actions={<ListActions />}
              pagination={<ListPagination />}
              disableSyncWithLocation
              sx={{
                bgcolor: C.bg,
                color: C.text,
                "& .MuiPaper-root": { bgcolor: "transparent", color: C.text },

                // pagination bar background
                "& .MuiTablePagination-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: C.text,
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  fontSize: theme.typography.body2,
                  color: C.text,
                },

                // 🔹 CLOSED select (Rows per page)
                "& .MuiTablePagination-select": {
                  fontSize: theme.typography.body2,
                  color: `${C.text} !important`,
                  backgroundColor: `${C.surface} !important`,
                  borderRadius: 1,
                  border: `1px solid ${C.border}`,
                },

                // 🔹 arrow icon
                "& .MuiTablePagination-selectIcon": {
                  color: `${C.text} !important`,
                },

                "& .MuiPaginationItem-root": { fontSize: theme.typography.body2, color: C.textDim },
                "& .MuiPaginationItem-root.Mui-selected": {
                  color: C.text,
                  backgroundColor: C.selected,
                },
                "& .RaBulkActionsToolbar-toolbar": {
                  maxWidth: 580,
                  width: "fit-content",
                  flex: "0 0 auto",
                  justifyContent: "flex-start",
                  bgcolor: "#2D1B4E",
                  gap: 3,
                },
              }}
            >
              <DatagridConfigurable
                rowClick="expand"
                expand={<CallExpandPanel />}
                bulkActionButtons={false}
                sx={{
                  "& .MuiTable-root": { backgroundColor: "transparent", borderCollapse: "separate", borderSpacing: 0 },
                  "& .RaDatagrid-headerCell, & .MuiTableHead-root .MuiTableCell-root": {
                    fontSize: theme.typography.body2, position: "static !important", backgroundColor: "rgba(255, 255, 255, 0.03)", color: C.text, py: 1.2, fontWeight: 500, textAlign: "center", borderBottom: `1px solid ${C.borderHi}`,
                  },
                  "& .MuiTableSortLabel-root:hover": {
                    color: "rgba(255,255,255,0.65) !important",   // soft grey
                  },

                  "& .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon": {
                    color: "rgba(255,255,255,0.65) !important",
                    opacity: 1,
                  },
                  "& .MuiTableHead-root .MuiTableRow-root > th:nth-of-type(n+2)": {
                    width: 100,
                    maxWidth: 100,
                  },
                  "& .MuiTableBody-root .MuiTableRow-root > td:nth-of-type(n+2)": {
                    width: 100,
                    maxWidth: 100,
                  },
                  "& .MuiTableBody-root td:nth-of-type(n+2) .RaField-text, \
 & .MuiTableBody-root td:nth-of-type(n+2) .MuiTypography-root": {
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    lineHeight: 1.3,
                    maxHeight: "calc(1.3em * 2)",
                  },

                  "& .MuiTableBody-root, \
       .MuiTableBody-root .MuiTableRow-root, \
       .MuiTableBody-root .MuiTableCell-root": {
                    backgroundColor: "#0A0F1C !important",
                  },
                  "& .MuiTable-root .MuiTableRow-root > *:first-of-type": {
                    borderLeft: `0.3px solid ${C.border}`, textAlign: "center"
                  },
                  "& .MuiTable-root .MuiTableRow-root > *:last-of-type": {
                    borderRight: `0.3px solid ${C.border}`,
                  },
                  "& .MuiTableBody-root .MuiTableCell-root": { color: C.text, borderBottom: `1px solid ${C.border}` },
                  "& .MuiTableBody-root .MuiTableCell-root .RaField-text, & .MuiTableBody-root .MuiTableCell-root .MuiTypography-root": { fontSize: theme.typography.body2, color: C.text },
                  "& .MuiTableBody-root tr:hover td": { backgroundColor: C.hover },
                  "& .MuiTableRow-root.Mui-selected td": { backgroundColor: `${C.selected} !important` },
                  "& .RaDatagrid-expandPanelCell": { p: 0, backgroundColor: "#0A0F1C !important", },
                  "& .RaDatagrid-expandPanel td": { p: 0, backgroundColor: "#0A0F1C !important", },
                  "& .RaDatagrid-expandPanelCell > *": { width: "100%", backgroundColor: "#0A0F1C !important", display: "block" },
                  "& .MuiSelect-select": { color: C.text, backgroundColor: C.surface, borderRadius: 1 },
                  "& .MuiMenuItem-root": { fontSize: theme.typography.body2, color: C.text, backgroundColor: C.surface, "&.Mui-selected": { backgroundColor: C.selected }, "&:hover": { backgroundColor: C.hover } },
                  "& .RaDatagrid-cell:first-of-type .RaField-text": { color: C.accent, fontWeight: 500, fontFamily: "monospace" },
                  "& .MuiSvgIcon-root, & .MuiCheckbox-root, & .MuiIconButton-root": { color: C.textDim },
                  "& .RaDatagrid-expandPanel": {
                    backgroundColor: "#0A0F1C !important",   // match page background
                    color: C.text,
                    borderTop: `1px solid ${C.border}`,
                    borderBottom: `1px solid ${C.border}`,
                  },
                  "& .MuiTable-root .MuiTableRow-root > *:nth-of-type(2)": {
                    textAlign: "center",
                  },
                  "& .MuiTableContainer-root": {
                    backgroundColor: "transparent", borderRadius: "24px",
                    overflow: "hidden",
                  },
                  "& .RaDatagrid-content": { backgroundColor: "transparent" },
                  "& .RaDatagrid-tableWrapper": { backgroundColor: "transparent" },


                  "& .MuiTableBody-root td:nth-of-type(n+3) .RaField-text, \
   .MuiTableBody-root td:nth-of-type(n+3) .MuiTypography-root": {
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    lineHeight: 1.3,
                    maxHeight: "calc(1.3em * 2)",
                    textAlign: "center"
                  },
                }}
              >
                <TextField source="call_id" label="Call ID" />
                <FunctionField
                  label="Status"
                  sortBy="call_status"
                  render={(r: any) => (
                    <Chip size="small" label={r.call_status ?? "-"} sx={{ bgcolor: C.surfaceHi, color: C.text, border: `1px solid ${C.border}` }} />
                  )}
                />
                <FunctionField
                  label="Direction"
                  sortBy="direction"
                  render={(r: any) => (
                    <Chip
                      size="small"
                      label={r.direction ?? "-"}
                      sx={{ bgcolor: C.surfaceHi, color: C.text, border: `1px solid ${C.border}` }}
                    />
                  )}
                />
                <FunctionField source="from_number" label="From" render={(r: any) => (r.from_number ?? "").replace(/\s+/g, "")} />
                <FunctionField source="to_number" label="To" render={(r: any) => (r.to_number ?? "").replace(/\s+/g, "")} />
                <FunctionField label="Started" sortBy="start_timestamp" render={(r: any) => fmtDate(r.start_timestamp)} />
                <FunctionField label="Duration" sortBy="duration_ms" render={(r: any) => `${msToSec(r.duration_ms)}s`} />
                <TextField source="agent_name" label="Agent" cellClassName="col-agent" />
                <FunctionField
                  label="Cost"
                  sortBy="call_cost.combined_cost"
                  render={(r: any) => (r.call_cost ? `$${((r.call_cost.combined_cost ?? 0)).toFixed(2)}` : "-")}
                />
              </DatagridConfigurable>
            </List>
          </Box>
        </ResourceContextProvider>
      </AdminContext>
    </LocalizationProvider>
  );
}