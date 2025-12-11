import * as React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  drawerOpen: boolean;
  onToggleColorMode?: () => void;
};

const Header: React.FC<Props> = ({ drawerOpen, onToggleColorMode }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={(theme) => ({
        height: 64,
        justifyContent: "center",
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: `calc(100% - ${drawerOpen ? 240 : 72}px)`,
        ml: `${drawerOpen ? 240 : 72}px`,
      })}
    >
      <Toolbar sx={{ gap: 2, minHeight: 64 }}>
        {/* Search */}
        <Box
          sx={(theme) => ({
            position: "relative",
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.text.primary, 0.06),
            "&:hover": { backgroundColor: alpha(theme.palette.text.primary, 0.1) },
            ml: 3,
            mr: 2,
            width: "100%",
            maxWidth: 420,
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
          })}
        >
          <Box sx={{ px: 1.5, pointerEvents: "none", display: "flex", alignItems: "center" }}>
            <SearchIcon fontSize="small" />
          </Box>
          <InputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            sx={(theme) => ({
              width: "100%",
              pr: 1,
              "& .MuiInputBase-input": { p: theme.spacing(1.2, 1, 1.2, 0) },
            })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) console.log("Search:", value);
              }
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Dark/Light toggle */}
        <Tooltip title="Toggle theme">
          <IconButton
            size="small"
            onClick={onToggleColorMode}
            sx={{ border: "none", "&:focus,&:focus-visible": { outline: "none" } }}
          >
            <DarkModeIcon />
          </IconButton>
        </Tooltip>

        {/* Profile */}
        <Tooltip title="Account settings">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            sx={{ ml: 1, border: "none", "&:focus,&:focus-visible": { outline: "none" } }}
            aria-controls={userMenuOpen ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={userMenuOpen ? "true" : undefined}
          >
            <Avatar src="/broken-image.jpg" />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={userMenuOpen}
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
          PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 180 } }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => console.log("Profile")}>Profile</MenuItem>
          <MenuItem onClick={() => console.log("Profile Settings")}>Profile Settings</MenuItem>
          <Divider />
          <MenuItem onClick={() => console.log("Logout")}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;