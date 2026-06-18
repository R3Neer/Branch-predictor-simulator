import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import type { DynamicTableView } from "../../application";

export interface SimulationTablePanelProps {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly tableView: DynamicTableView;
  readonly exportedTable?: string;
  readonly exportedSessionYaml?: string;
  readonly onStep: () => void;
  readonly onRunAll: () => void;
  readonly onReset: () => void;
  readonly onExportCsv: () => void;
  readonly onExportMarkdown: () => void;
  readonly onExportSessionYaml: () => void;
}

export function SimulationTablePanel({
  currentStep,
  totalSteps,
  tableView,
  exportedTable,
  exportedSessionYaml,
  onStep,
  onRunAll,
  onReset,
  onExportCsv,
  onExportMarkdown,
  onExportSessionYaml
}: SimulationTablePanelProps) {
  return (
    <>
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Stack direction="row" spacing={1} sx={{ p: 1.5, alignItems: "center" }}>
          <Button startIcon={<PlayArrowIcon />} variant="contained" onClick={onStep}>
            Step
          </Button>
          <Button startIcon={<SkipNextIcon />} variant="outlined" onClick={onRunAll}>
            Run all
          </Button>
          <Button startIcon={<RestartAltIcon />} variant="outlined" color="inherit" onClick={onReset}>
            Reset
          </Button>
          <Button startIcon={<DownloadIcon />} variant="outlined" onClick={onExportCsv}>
            CSV
          </Button>
          <Button startIcon={<DownloadIcon />} variant="outlined" onClick={onExportMarkdown}>
            Markdown
          </Button>
          <Button startIcon={<DownloadIcon />} variant="outlined" onClick={onExportSessionYaml}>
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
    </>
  );
}
