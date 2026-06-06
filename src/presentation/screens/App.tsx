import { CssBaseline, ThemeProvider } from "@mui/material";
import { DashboardShell } from "../components/DashboardShell";
import { theme } from "../theme/theme";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardShell />
    </ThemeProvider>
  );
}
