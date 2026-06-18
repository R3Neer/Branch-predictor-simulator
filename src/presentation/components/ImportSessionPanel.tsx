import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";

export interface ImportSessionPanelProps {
  readonly sessionYamlInput: string;
  readonly sessionImportError?: string;
  readonly onSessionYamlInputChange: (value: string) => void;
  readonly onImport: () => void;
}

export function ImportSessionPanel({
  sessionYamlInput,
  sessionImportError,
  onSessionYamlInputChange,
  onImport
}: ImportSessionPanelProps) {
  return (
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
          onChange={(event) => onSessionYamlInputChange(event.target.value)}
          InputProps={{
            sx: { fontFamily: '"Roboto Mono", Consolas, monospace', fontSize: "0.8125rem" }
          }}
        />
        {sessionImportError ? <Alert severity="warning">{sessionImportError}</Alert> : undefined}
        <Button variant="outlined" onClick={onImport} disabled={sessionYamlInput.trim() === ""}>
          Import
        </Button>
      </Stack>
    </Paper>
  );
}
