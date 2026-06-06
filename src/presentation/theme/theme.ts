import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f6f78"
    },
    secondary: {
      main: "#7a4e13"
    },
    background: {
      default: "#f7f8f8",
      paper: "#ffffff"
    },
    success: {
      main: "#2f7d32"
    },
    error: {
      main: "#b3261e"
    }
  },
  shape: {
    borderRadius: 6
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "1.5rem",
      fontWeight: 500,
      letterSpacing: 0
    },
    h2: {
      fontSize: "1rem",
      fontWeight: 500,
      letterSpacing: 0
    },
    button: {
      letterSpacing: 0,
      textTransform: "none"
    }
  }
});
