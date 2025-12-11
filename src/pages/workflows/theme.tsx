import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation'; // 👈 this line fixes TS

const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7',
      light: '#9a67ea',
      dark: '#320b86',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8bc34a',
      light: '#bedb71',
      dark: '#5a9216',
      contrastText: '#000000',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    status: {
      active: '#4caf50',
      pending: '#ff9800',
      deleted: '#f44336',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
        },
        columnHeaders: {
          backgroundColor: '#e0e0e0',
          borderBottom: '1px solid #bdbdbd',
          fontWeight: 600,
        },
        row: {
          '&:hover': {
            backgroundColor: 'rgba(103, 58, 183, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(103, 58, 183, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(103, 58, 183, 0.08)',
            },
          },
        },
        cell: {
          borderBottom: '1px solid #eeeeee',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderBottom: '1px solid #eeeeee',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    status: {
      active: string;
      pending: string;
      deleted: string;
    };
  }
  interface PaletteOptions {
    status?: {
      active?: string;
      pending?: string;
      deleted?: string;
    };
  }
}

export default theme;