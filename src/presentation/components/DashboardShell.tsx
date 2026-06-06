import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  AppBar,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";

const sampleRows = [
  { step: 1, branch: "B1", index: "2", before: "01", prediction: "NT", actual: "T" },
  { step: 2, branch: "B2", index: "1", before: "10", prediction: "T", actual: "T" },
  { step: 3, branch: "B1", index: "2", before: "10", prediction: "T", actual: "NT" }
];

export function DashboardShell() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar sx={{ gap: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography component="h1" variant="h1" sx={{ flexGrow: 1 }}>
            Branch Predictor Simulator
          </Typography>
          <Tabs value="exam" aria-label="Modo de trabajo">
            <Tab value="exam" label="Examen" />
            <Tab value="solution" label="Solucion" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 320px" },
          gap: 2,
          p: 2
        }}
      >
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2
            }}
          >
            <EditorPanel title="C didactico" value={"for (int i = 0; i < 10; i++) {\n  a += i;\n}"} />
            <EditorPanel
              title="RISC-V"
              value={"0x38 bge r4, r0, else # B1\n0x44 bne r7, r8, loop # B2"}
            />
          </Box>

          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <Stack direction="row" spacing={1} sx={{ p: 1.5, alignItems: "center" }}>
              <Button startIcon={<PlayArrowIcon />} variant="contained">
                Paso
              </Button>
              <Button startIcon={<SkipNextIcon />} variant="outlined">
                Todo
              </Button>
              <Button startIcon={<RestartAltIcon />} variant="outlined" color="inherit">
                Reiniciar
              </Button>
            </Stack>
            <Divider />
            <Box sx={{ overflowX: "auto" }}>
              <Box
                component="table"
                sx={{
                  width: "100%",
                  borderCollapse: "collapse",
                  "& th, & td": {
                    p: 1.25,
                    borderBottom: 1,
                    borderColor: "divider",
                    textAlign: "left",
                    whiteSpace: "nowrap"
                  },
                  "& th": { bgcolor: "#eef3f3", fontWeight: 500 }
                }}
              >
                <thead>
                  <tr>
                    <th>Iteracion</th>
                    <th>Salto</th>
                    <th>Indice</th>
                    <th>Estado antes</th>
                    <th>Prediccion</th>
                    <th>Real</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleRows.map((row) => (
                    <tr key={row.step}>
                      <td>{row.step}</td>
                      <td>{row.branch}</td>
                      <td>{row.index}</td>
                      <td>{row.before}</td>
                      <td>{row.prediction}</td>
                      <td>{row.actual}</td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          </Paper>
        </Stack>

        <Paper
          variant="outlined"
          sx={{ p: 2, alignSelf: "start", position: { lg: "sticky" }, top: { lg: 16 } }}
        >
          <Stack spacing={2}>
            <Typography component="h2" variant="h2">
              Configuracion
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="predictor-type-label">Predictor</InputLabel>
              <Select labelId="predictor-type-label" label="Predictor" value="one-level">
                <MenuItem value="one-level">Un nivel</MenuItem>
                <MenuItem value="two-level">(n,m)</MenuItem>
                <MenuItem value="gshare">gshare</MenuItem>
                <MenuItem value="gselect">gselect</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Bits por contador" size="small" value="2" />
            <TextField label="Entradas" size="small" value="4" />
            <TextField label="Estado inicial" size="small" value="01" />
            <Divider />
            <Typography component="h2" variant="h2">
              Estadisticas
            </Typography>
            <TextField label="Aciertos" size="small" />
            <TextField label="Fallos" size="small" />
            <Button variant="contained">Calcular</Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

function EditorPanel({ title, value }: { readonly title: string; readonly value: string }) {
  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 1, bgcolor: "#eef3f3", borderBottom: 1, borderColor: "divider" }}>
        <Typography component="h2" variant="h2">
          {title}
        </Typography>
      </Box>
      <TextField
        multiline
        fullWidth
        minRows={8}
        value={value}
        InputProps={{
          readOnly: true,
          sx: {
            fontFamily: '"Roboto Mono", Consolas, monospace',
            fontSize: "0.875rem",
            alignItems: "flex-start"
          }
        }}
      />
    </Paper>
  );
}
