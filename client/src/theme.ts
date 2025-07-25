import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00e676",
      light: "#66ffa6",
      dark: "#00b248",
    },
    secondary: {
      main: "#ff6ec7",
      light: "#ffb3e6",
      dark: "#c93a96",
    },
    background: {
      default: "#0a0e27",
      paper: "#1a1e3a",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b8bcc8",
    },
    success: {
      main: "#00e676",
      light: "#66ffa6",
      dark: "#00b248",
    },
    info: {
      main: "#03dac6",
      light: "#4fd5c7",
      dark: "#018786",
    },
    warning: {
      main: "#ffc107",
      light: "#ffecb3",
      dark: "#ff8f00",
    },
    error: {
      main: "#ff5722",
      light: "#ff8a65",
      dark: "#d84315",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
