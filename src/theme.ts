import { createTheme } from '@mui/material/styles';

type ResponsiveSizes = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl?: string;
};

const typographyResponsive = (sizes: ResponsiveSizes) => ({
  fontSize: sizes.xs,
  '@media (min-width:600px)': { fontSize: sizes.sm },
  '@media (min-width:900px)': { fontSize: sizes.md },
  '@media (min-width:1200px)': { fontSize: sizes.lg },
  '@media (min-width:1536px)': { fontSize: sizes.xl },
  '@media (min-width:2560px)': { fontSize: sizes.xxl },
});

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
  interface TypographyVariants { mobileMenu: React.CSSProperties, custom: React.CSSProperties, button: React.CSSProperties }
  interface TypographyVariantsOptions { mobileMenu?: React.CSSProperties, custom?: React.CSSProperties, button?: React.CSSProperties }
  interface TypographyPropsVariantOverrides { mobileMenu: true, custom: true, button: true }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 2560,
    },
  },
  typography: {
    h1: typographyResponsive({
      xs: '32px', sm: '36px', md: '42px', lg: '48px', xl: '56px', xxl: '68px',
    }),
    h2: typographyResponsive({
      xs: '24px', sm: '30px', md: '35px', lg: '40px', xl: '48px', xxl: '58px',
    }),
    h3: typographyResponsive({
      xs: '24px', sm: '28px', md: '32px', lg: '36px', xl: '40px', xxl: '50px',
    }),
    h4: typographyResponsive({
      xs: '20px', sm: '24px', md: '28px', lg: '32px', xl: '36px', xxl: '44px',
    }),
    h5: typographyResponsive({
      xs: '20px', sm: '22.8px', md: '25.4px', lg: '28px', xl: '31px', xxl: '36px',
    }),
    subtitle1: typographyResponsive({
      xs: '16px', sm: '18px', md: '20px', lg: '20px', xl: '24px', xxl: '28px',
    }),
    body1: typographyResponsive({
      xs: '14px', sm: '15.4px', md: '16.7px', lg: '18px', xl: '20px', xxl: '22px',
    }),
    body2: typographyResponsive({
      xs: '14px', sm: '14.5px', md: '15px', lg: '16px', xl: '18px', xxl: '20px',
    }),
    mobileMenu: { fontSize: '16px' },
    button: typographyResponsive({
      xs: '14px',
      sm: '15px',
      md: '16px',
      lg: '16px',
      xl: '16px',
      xxl: '16px',
    }),
    custom: typographyResponsive({
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '19px',
      xxl: '20px',
    }),
  },
});

export default theme;