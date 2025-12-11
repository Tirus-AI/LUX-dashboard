import { TopToolbar, ExportButton } from "react-admin";
import ColumnFilterBar from "./ColumnFilterBar";

export default function ListActions() {
  return (
    <TopToolbar
      sx={{ bgcolor: "transparent", justifyContent: "center", gap: 2, display: "flex", alignItems: "center", flexWrap: "wrap" }}
    >
      <ColumnFilterBar />
      <ExportButton label="Export" />
    </TopToolbar>
  );
}