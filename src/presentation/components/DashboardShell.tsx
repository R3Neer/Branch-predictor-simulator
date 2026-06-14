import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DownloadIcon from "@mui/icons-material/Download";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import {
  Alert,
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
import { useSimulationStore } from "../stores/simulationStore";

export function DashboardShell() {
  const {
    templates,
    selectedTemplateId,
    selectedVariantId,
    activeTitle,
    activeStatement,
    activeVariantTitle,
    mode,
    cSource,
    riscVSource,
    sourceSyncState,
    manualSequenceSource,
    manualSequenceError,
    totalSteps,
    sessionYamlInput,
    sessionImportError,
    statAnswerInputs,
    tableAnswerSource,
    tableAnswerError,
    correctionReport,
    translationDiagnostics,
    currentStep,
    tableView,
    exportedTable,
    exportedSessionYaml,
    statistics,
    selectTemplate,
    selectVariant,
    updateCSource,
    updateRiscVSource,
    updateManualSequenceSource,
    updateSessionYamlInput,
    updateStatAnswer,
    updateTableAnswerSource,
    importSessionYaml,
    setMode,
    step,
    runAll,
    reset,
    calculateStats,
    checkAnswers,
    exportTable,
    exportSessionYaml
  } = useSimulationStore();
  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) ?? templates[0];
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar sx={{ gap: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography component="h1" variant="h1" sx={{ flexGrow: 1 }}>
            Branch Predictor Simulator
          </Typography>
          <Tabs
            value={mode}
            aria-label="Work mode"
            onChange={(_event, value: "exam" | "solution") => setMode(value)}
          >
            <Tab value="exam" label="Exam" />
            <Tab value="solution" label="Solution" />
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
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" },
              gap: 2
            }}
          >
            <EditorPanel
              title="Didactic C"
              value={cSource}
              readOnly={sourceSyncState === "desynced"}
              onChange={updateCSource}
            />
            <EditorPanel title="RISC-V" value={riscVSource} onChange={updateRiscVSource} />
            <EditorPanel
              title="Manual sequence"
              value={manualSequenceSource}
              onChange={updateManualSequenceSource}
            />
          </Box>
          {manualSequenceError ? <Alert severity="warning">{manualSequenceError}</Alert> : undefined}
          {translationDiagnostics.length > 0 ? (
            <Stack spacing={1}>
              {translationDiagnostics.map((diagnostic) => (
                <Alert key={`${diagnostic.severity}-${diagnostic.message}`} severity={diagnostic.severity}>
                  {diagnostic.message}
                </Alert>
              ))}
            </Stack>
          ) : undefined}

          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <Stack direction="row" spacing={1} sx={{ p: 1.5, alignItems: "center" }}>
              <Button startIcon={<PlayArrowIcon />} variant="contained" onClick={step}>
                Step
              </Button>
              <Button startIcon={<SkipNextIcon />} variant="outlined" onClick={runAll}>
                Run all
              </Button>
              <Button startIcon={<RestartAltIcon />} variant="outlined" color="inherit" onClick={reset}>
                Reset
              </Button>
              <Button startIcon={<DownloadIcon />} variant="outlined" onClick={() => exportTable("csv")}>
                CSV
              </Button>
              <Button startIcon={<DownloadIcon />} variant="outlined" onClick={() => exportTable("markdown")}>
                Markdown
              </Button>
              <Button startIcon={<DownloadIcon />} variant="outlined" onClick={exportSessionYaml}>
                YAML
              </Button>
              <Typography sx={{ ml: "auto" }} variant="body2">
                Step {currentStep} / {totalSteps}
              </Typography>
            </Stack>
            <Divider />
            <Box sx={{ overflowX: "auto" }}>
              <Box
                component="table"
                aria-label="Simulation table"
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
                    {tableView.columns.map((column) => (
                      <th key={column.id}>{column.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableView.rows.length === 0 ? (
                    <tr>
                      <td colSpan={tableView.columns.length}>No executed steps</td>
                    </tr>
                  ) : (
                    tableView.rows.map((row) => (
                      <tr key={row.id}>
                        {tableView.columns.map((column) => (
                          <td key={column.id}>{row.cells[column.id]?.value}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </Box>
            </Box>
          </Paper>
          {exportedTable ? (
            <TextField
              label="Export"
              multiline
              minRows={4}
              value={exportedTable}
              InputProps={{
                readOnly: true,
                sx: { fontFamily: '"Roboto Mono", Consolas, monospace', fontSize: "0.8125rem" }
              }}
            />
          ) : undefined}
          {exportedSessionYaml ? (
            <TextField
              label="YAML session"
              multiline
              minRows={6}
              value={exportedSessionYaml}
              InputProps={{
                readOnly: true,
                sx: { fontFamily: '"Roboto Mono", Consolas, monospace', fontSize: "0.8125rem" }
              }}
            />
          ) : undefined}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography component="h2" variant="h2">
                Import session
              </Typography>
              <TextField
                label="Session YAML input"
                multiline
                minRows={5}
                value={sessionYamlInput}
                onChange={(event) => updateSessionYamlInput(event.target.value)}
                InputProps={{
                  sx: { fontFamily: '"Roboto Mono", Consolas, monospace', fontSize: "0.8125rem" }
                }}
              />
              {sessionImportError ? <Alert severity="warning">{sessionImportError}</Alert> : undefined}
              <Button variant="outlined" onClick={importSessionYaml}>
                Import
              </Button>
            </Stack>
          </Paper>
        </Stack>

        <Paper
          variant="outlined"
          sx={{ p: 2, alignSelf: "start", position: { lg: "sticky" }, top: { lg: 16 } }}
        >
          <Stack spacing={2}>
            <Typography component="h2" variant="h2">
              Configuration
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="template-label">Template</InputLabel>
              <Select
                labelId="template-label"
                label="Template"
                value={selectedTemplateId}
                onChange={(event) => selectTemplate(event.target.value)}
              >
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Session" size="small" value={activeTitle} InputProps={{ readOnly: true }} />
            <FormControl fullWidth size="small">
              <InputLabel id="variant-label">Variant</InputLabel>
              <Select
                labelId="variant-label"
                label="Variant"
                value={selectedVariantId}
                onChange={(event) => selectVariant(event.target.value)}
              >
                {selectedTemplate.variants.map((variant) => (
                  <MenuItem key={variant.id} value={variant.id}>
                    {variant.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Active variant" size="small" value={activeVariantTitle} InputProps={{ readOnly: true }} />
            <TextField
              label="Statement"
              size="small"
              value={activeStatement}
              multiline
              minRows={3}
              InputProps={{ readOnly: true }}
            />
            <Divider />
            <Typography component="h2" variant="h2">
              Statistics
            </Typography>
            <TextField
              label="Table answers"
              size="small"
              multiline
              minRows={3}
              value={tableAnswerSource}
              onChange={(event) => updateTableAnswerSource(event.target.value)}
              InputProps={{
                sx: { fontFamily: '"Roboto Mono", Consolas, monospace', fontSize: "0.8125rem" }
              }}
            />
            <TextField
              label="Hits answer"
              size="small"
              value={statAnswerInputs.hits}
              onChange={(event) => updateStatAnswer("hits", event.target.value)}
            />
            <TextField
              label="Misses answer"
              size="small"
              value={statAnswerInputs.misses}
              onChange={(event) => updateStatAnswer("misses", event.target.value)}
            />
            <TextField
              label="Hit rate answer"
              size="small"
              value={statAnswerInputs.hitRate}
              onChange={(event) => updateStatAnswer("hitRate", event.target.value)}
            />
            <Button startIcon={<FactCheckIcon />} variant="outlined" onClick={checkAnswers}>
              Check
            </Button>
            {tableAnswerError ? <Alert severity="warning">{tableAnswerError}</Alert> : undefined}
            {correctionReport ? (
              <Alert
                severity={
                  correctionReport.summary.total > 0 &&
                  correctionReport.summary.correct === correctionReport.summary.total
                    ? "success"
                    : "info"
                }
              >
                {correctionReport.summary.correct} / {correctionReport.summary.total} correct answers
              </Alert>
            ) : undefined}
            <TextField label="Hits" size="small" value={statistics?.hits ?? ""} InputProps={{ readOnly: true }} />
            <TextField label="Misses" size="small" value={statistics?.misses ?? ""} InputProps={{ readOnly: true }} />
            <TextField
              label="Hit rate"
              size="small"
              value={statistics ? `${(statistics.hitRate.value * 100).toFixed(2)}%` : ""}
              InputProps={{ readOnly: true }}
            />
            <Button variant="contained" onClick={calculateStats}>
              Calculate
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

function EditorPanel({
  title,
  value,
  readOnly = false,
  onChange
}: {
  readonly title: string;
  readonly value: string;
  readonly readOnly?: boolean;
  readonly onChange?: (value: string) => void;
}) {
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
        onChange={(event) => onChange?.(event.target.value)}
        inputProps={{ "aria-label": title }}
        InputProps={{
          readOnly,
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
