import { Box, Paper, TextField, Typography } from "@mui/material";

export interface EditorPanelProps {
  readonly title: string;
  readonly value: string;
  readonly readOnly?: boolean;
  readonly onChange?: (value: string) => void;
}

export function EditorPanel({ title, value, readOnly = false, onChange }: EditorPanelProps) {
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
