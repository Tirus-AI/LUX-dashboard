import * as React from "react";
import { Box } from "@mui/material";

export default function ChartShell({ children }: { children: React.ReactNode }) {

  return (
    <Box
      sx={{
        position: "relative",
        m: 0,
        p: { xs: 1, sm: 2 },
        borderRadius: "20px",
        border: "none",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
}