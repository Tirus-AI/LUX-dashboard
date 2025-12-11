import { alpha, createTheme } from '@mui/material/styles';
import { FaRobot, } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import TirIcon from "/assets/Tir.svg";
import { IconButton } from '@mui/material';

export interface ChatbotThemeConfig {
  primary: string;
  secondary: string;
  buttonColor: string;
  buttonHoverColor: string;
  userMessageBg: string;
  botMessageBg: string;
  botAvatarBg: string;
  chatContainerBg: string;
  robotIcon?: React.ReactNode;
  sendIcon?: React.ReactNode;
}

export const C = {
  bg: "#0A0F1C",
  surface: "#13182C",
  surfaceHi: "#191F36",
  border: "rgba(160,170,200,0.16)",
  borderHi: "rgba(160,170,200,0.28)",
  text: "rgba(230,235,255,0.92)",
  textDim: "rgba(230,235,255,0.72)",
  accent: "#3f5894ff",
};

export const defaultChatbotTheme: ChatbotThemeConfig = {
  // primary: '#1976d2',
  // secondary: '#1565c0',
  // buttonColor: '#2196f3',
  // buttonHoverColor: '#1976d2',
  // userMessageBg: '#2196f3',
  // botMessageBg: '#e0e0e0',
  // botAvatarBg: '#2196f3',
  // chatContainerBg: '#ffffff',
  // // robotIcon: <FaRobot />,
  // robotIcon: <img src="/assets/Tir.svg" alt="bot" width={60} height={60} />,
  // sendIcon: <IoSend />
  primary: C.accent,
  secondary: "#6a90ff",              
  buttonColor: C.accent,
  buttonHoverColor: "#3c5ea7ff",       
  userMessageBg: C.accent,      
  botMessageBg: "#400f9bff",     
  botAvatarBg: C.accent,
  chatContainerBg: C.surface,
  robotIcon: <img src={TirIcon} alt="bot" width={60} height={60} />,
  sendIcon: <IoSend />
};

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: C.accent },
    secondary: { main: "#6a90ff" },
    background: { default: C.bg, paper: C.surface },
    text: { primary: C.text, secondary: C.textDim },
    divider: C.borderHi,
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: C.surface,
          color: C.text,
          border: `1px solid ${C.border}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: C.accent,
          color: "#0B1226",
          "&:hover": { backgroundColor: "#91b4ff" },
        },
        outlined: {
          borderColor: C.borderHi,
          color: C.text,
          "&:hover": { borderColor: C.accent, backgroundColor: alpha(C.accent, 0.08) },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: C.surfaceHi,
            color: C.text,
            "& fieldset": { borderColor: C.border },
            "&:hover fieldset": { borderColor: C.accent },
            "&.Mui-focused fieldset": { borderColor: C.accent },
          },
          "& .MuiInputBase-input": { color: C.text },
          "& .MuiInputLabel-root": { color: C.textDim },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: C.text,
          "&:hover": { backgroundColor: alpha(C.accent, 0.12) },
          outline: "none",
          border: "none",
          boxShadow: "none",
          "&:focus,&.Mui-focusVisible": { outline: "none", border: "none", boxShadow: "none" },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: C.surfaceHi, color: C.text },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: C.border } },
    },
  },
});