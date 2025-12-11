import * as React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  IconButton,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link as RouterLink } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";

const TOKENS = {
  sidebarBg: "transparent",
  sidebarBorder: "rgba(255,255,255,0.06)",
  sidebarText: "#FFFFFF",
  sidebarMuted: "rgba(236,240,255,0.55)",
  sidebarIcon: "#3E2871",
  sidebarHoverBg: "rgba(255,255,255,0.06)",
  sidebarActiveBg: "rgba(255,255,255,0.12)",
  sidebarActiveText: "#FFFFFF",
  divider: "rgba(255,255,255,0.08)",
};

type NavItem = { text: string; icon: React.ReactNode; path: string };

type Props = {
  open: boolean;
  onToggle: () => void;
  items?: NavItem[];
};

const topItems: NavItem[] = [
  { text: "Home", icon: <HomeOutlinedIcon />, path: "/" },
  { text: "Workflows", icon: <AccountTreeOutlinedIcon />, path: "/claims" },
  { text: "Analytics", icon: <LeaderboardOutlinedIcon />, path: "/analytics" },
];

const bottomItems: NavItem[] = [
  { text: "My Profile", icon: <AccountCircleOutlinedIcon />, path: "/profile" },
  { text: "Log Out", icon: <LogoutOutlinedIcon />, path: "/logout" },
];

const drawerOpen = 240;
const drawerClosed = 72;
const SIDEBAR_ANIM_MS = 500;

const Sidebar: React.FC<Props> = ({ open, onToggle, items = topItems }) => {
  const theme = useTheme();

  const renderItem = ({ text, icon, path }: NavItem) => {
    const button = (
      <ListItemButton
        component={RouterLink}
        to={path}
        disableRipple
        disableTouchRipple
        sx={{
          ...theme.typography.body1,
          height: 29,
          justifyContent: open ? "initial" : "center",
          px: open ? 3 : 0,
          py: 0,
          color: TOKENS.sidebarText,
          "&:hover": { backgroundColor: "transparent" },
          "&.Mui-focusVisible": { backgroundColor: "transparent" },
          "& .MuiTouchRipple-root": { display: "none" },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 1.5 : 0,
            justifyContent: "center",
            width: open ? "auto" : "100%",
            color: TOKENS.sidebarIcon,
            "& svg": { width: 24, height: 24, fontSize: 24 },
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            opacity: open ? 1 : 0,
            display: open ? "block" : "none",
            whiteSpace: "nowrap",
            "& .MuiListItemText-primary": { color: TOKENS.sidebarText },
          }}
        />
      </ListItemButton>
    );

    return (
      <ListItem key={text} disablePadding sx={{ display: "block" }}>
        {open ? button : <Tooltip title={text} placement="right">{button}</Tooltip>}
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
    sx: (theme) => ({
      position: "fixed",
      whiteSpace: "nowrap",
      width: open ? drawerOpen : drawerClosed,
      overflowX: "hidden",
      backgroundColor: TOKENS.sidebarBg,
      color: TOKENS.sidebarText,
      borderRight: `1px solid ${TOKENS.sidebarBorder}`,
      willChange: "width",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.easeInOut,
        duration: SIDEBAR_ANIM_MS,
      }),
    }),
  }}
  sx={(theme) => ({
    width: open ? drawerOpen : drawerClosed,
    flexShrink: 0,
    willChange: "width",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeInOut,
      duration: SIDEBAR_ANIM_MS,
    }),
    "& .MuiDrawer-paper": {
      width: open ? drawerOpen : drawerClosed,
      willChange: "width",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.easeInOut,
        duration: SIDEBAR_ANIM_MS,
      }),
    },
  })}
    >
      {/* Body container to pin bottom section */}
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-end" : "center",
            mt: 2,
            px: 2,
          }}
        >
          {open && (
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", textAlign: "center", px: 1 }}>
              <img
                src="/assets/Autolux.png"
                alt="Admin Dashboard Logo"
                style={{ width: "90%", height: "auto", objectFit: "contain", display: "block" }}
              />
            </Box>
          )}
          <IconButton
          onClick={onToggle}
          aria-label="Toggle sidebar"
          sx={{
            color: TOKENS.sidebarIcon,
            border: "none",
            "&:hover": { backgroundColor: TOKENS.sidebarHoverBg },
            "&:focus,&:focus-visible": { outline: "none" },
          }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        </Box>

        {/* Top nav */}
        <List
          sx={{
            pt: 4,
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {items.map(renderItem)}
        </List>

        {/* Bottom section */}
        <Box sx={{ mt: "auto" }}>
          <List
            sx={{
              py: 3,
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {bottomItems.map(renderItem)}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
