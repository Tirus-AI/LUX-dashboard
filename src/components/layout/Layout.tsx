import * as React from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

type Props = {
  onToggleColorMode?: () => void;
};

const Layout: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", backgroundColor: "#0A0F1C" }}>
      <CssBaseline />

      <Sidebar open={open} onToggle={() => setOpen((p) => !p)} />

      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        })}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;