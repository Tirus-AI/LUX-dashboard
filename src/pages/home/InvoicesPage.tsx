import {
    AdminContext,
    ResourceContextProvider,
    List,
    DatagridConfigurable,
    TextField,
    FunctionField,
} from "react-admin";
import { Box, Chip, GlobalStyles } from "@mui/material";
import { C } from "../workflows/components/uiTokens";
import invoicesDataProvider from "./invoicesDataProvider.ts";
import { i18nProvider } from "../../i18nProvider.ts";
import theme from "../../theme";

const statusChipSx = {
    fontSize: theme.typography.body2,
    px: 1.25,
    py: 2,
    height: 26,
    borderRadius: 999,
    border: `1px solid ${C.border}`,
};

export default function InvoicesPage() {
    return (
        <AdminContext dataProvider={invoicesDataProvider} i18nProvider={i18nProvider}>
            <ResourceContextProvider value="invoices">
                {/* 🌍 global styles for the rows-per-page menu */}
                <GlobalStyles
                    styles={{
                        /* the popup container */
                        ".MuiMenu-paper": {
                            backgroundColor: `${C.surface} !important`,
                            color: C.text,
                            borderRadius: 8,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
                        },

                        ".MuiMenu-paper .MuiMenu-list": {
                            fontSize: `${theme.typography.body2} !important`,
                            paddingTop: 0,
                            paddingBottom: 0,
                            backgroundColor: "transparent",
                        },

                        ".MuiMenu-paper .MuiMenuItem-root": {
                            fontSize: `${theme.typography.body2} !important`,
                            color: C.text,
                            backgroundColor: "transparent",
                            "&:hover": {
                                backgroundColor: `${C.hover} !important`,
                            },
                            "&.Mui-selected": {
                                fontSize: `${theme.typography.body2} !important`,   // ⬅️ force selected too
                                backgroundColor: `${C.selected} !important`,
                                color: C.text,
                            },
                            "&.Mui-selected:hover": {
                                fontSize: `${theme.typography.body2} !important`,
                                backgroundColor: `${C.hover} !important`,
                            },
                        },
                    }}
                />
                <Box sx={{ maxWidth: { md: 900, xl: 1300, xxl: 1400 }, mx: "auto", py: 3, px: 3, width: "100%" }}>
                    <List
                        resource="invoices"
                        disableSyncWithLocation
                        sx={{
                            bgcolor: C.bg,
                            color: C.text,
                            "& .MuiPaper-root": { bgcolor: "transparent", color: C.text },

                            // 🟣 table pagination bar
                            "& .MuiTablePagination-root": {
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                color: C.text,
                            },
                            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                                fontSize: theme.typography.body2,
                                color: C.text,
                            },

                            // 🟣 the select itself (closed)
                            "& .MuiTablePagination-select": {
                                fontSize: theme.typography.body2,
                                color: C.text,
                                backgroundColor: C.surface,
                                borderRadius: 1,
                                lineHeight: "none",
                                border: `1px solid ${C.border}`,
                            },

                            // 🟣 dropdown arrow icon
                            "& .MuiTablePagination-selectIcon": {
                                color: C.text,
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
                            rowClick="none"
                            bulkActionButtons={false} 
                            sx={{
                                "& .MuiTable-root": { backgroundColor: "transparent", borderCollapse: "separate", borderSpacing: 0 },
                                "& .RaDatagrid-headerCell, & .MuiTableHead-root .MuiTableCell-root": {
                                    fontSize: theme.typography.body1, position: "static !important", backgroundColor: "rgba(255, 255, 255, 0.03)", color: C.text, py: 1.5, fontWeight: 500, textAlign: "center", borderBottom: `1px solid ${C.borderHi}`,
                                },
                                "& .MuiTableSortLabel-root:hover": {
                                    color: "rgba(255,255,255,0.65) !important",   // soft grey
                                },

                                "& .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon": {
                                    color: "rgba(255,255,255,0.65) !important",
                                    opacity: 1,
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
                                "& .MuiTableBody-root .MuiTableCell-root": { color: C.text, borderBottom: `1px solid ${C.border}`, py: 2 },
                                "& .MuiTableBody-root .MuiTableCell-root .RaField-text, & .MuiTableBody-root .MuiTableCell-root .MuiTypography-root": { fontSize: theme.typography.body2, color: C.text },
                                "& .MuiTableBody-root tr:hover td": { backgroundColor: C.hover },
                                "& .MuiTableRow-root.Mui-selected td": { backgroundColor: `${C.selected} !important` },
                                "& .MuiSelect-select": { color: C.text, backgroundColor: C.surface, borderRadius: 1 },
                                "& .MuiMenuItem-root": { fontSize: theme.typography.body2, color: C.text, backgroundColor: C.surface, "&.Mui-selected": { backgroundColor: C.selected }, "&:hover": { backgroundColor: C.hover } },
                                "& .RaDatagrid-cell:first-of-type .RaField-text": { color: C.accent, fontWeight: 500, fontFamily: "monospace" },
                                "& .MuiSvgIcon-root, & .MuiCheckbox-root, & .MuiIconButton-root": { color: C.textDim },
                                "& .MuiTable-root .MuiTableRow-root > *:nth-of-type(2)": {
                                    textAlign: "center",      // ✅ center checkbox
                                },
                                /* make all wrappers transparent */
                                "& .MuiTableContainer-root": {
                                    backgroundColor: "transparent", borderRadius: "24px",      // ✅ rounded corners
                                    overflow: "hidden",
                                },
                                "& .RaDatagrid-content": { backgroundColor: "transparent" },
                                "& .RaDatagrid-tableWrapper": { backgroundColor: "transparent" },
                                "& .MuiTableHead-root .MuiTableRow-root > th:nth-of-type": {
                                    width: 130, maxWidth: 130,
                                },
                                "& .MuiTableBody-root .MuiTableRow-root > td:nth-of-type": {
                                    width: 130, maxWidth: 130,
                                },

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
                            <TextField source="invoice_no" label="Invoice" />
                            <TextField source="customer" label="Customer" />
                            <TextField source="supplier" label="Supplier" />
                            <TextField source="product" label="Product" />
                            <FunctionField
                                label="Status"
                                sortBy="status"
                                render={(r: any) => {
                                    const s = String(r.status);
                                    const styles =
                                        s === "approved"
                                            ? { bgcolor: "rgba(46,160,67,0.18)", color: "#7CFFAE" }
                                            : s === "rejected"
                                                ? { bgcolor: "rgba(220,53,69,0.18)", color: "#FF8E8E" }
                                                : { bgcolor: "rgba(255,168,54,0.18)", color: "#FFC37B" }; // pending
                                    return (
                                        <Chip
                                            size="small"
                                            label={s.charAt(0).toUpperCase() + s.slice(1)}
                                            sx={{ ...statusChipSx, ...styles }}
                                        />
                                    );
                                }}
                            />
                            <FunctionField
                                source="amount"
                                label="Amount"
                                render={(r: any) =>
                                    new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(Number(r.amount ?? 0))
                                }
                            />
                            <FunctionField
                                source="date"
                                label="Date"
                                render={(r: any) => new Date(r.date).toISOString().slice(0, 10)}
                            />
                        </DatagridConfigurable>
                    </List>
                </Box>
            </ResourceContextProvider>
        </AdminContext>
    );
}