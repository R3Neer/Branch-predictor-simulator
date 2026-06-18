import { Box } from "@mui/material";
import type { SourceSyncState } from "../../application";
import { EditorPanel } from "./EditorPanel";

export interface SourceEditorsPanelProps {
  readonly cSource: string;
  readonly riscVSource: string;
  readonly sourceSyncState: SourceSyncState;
  readonly manualSequenceSource: string;
  readonly onCSourceChange: (value: string) => void;
  readonly onRiscVSourceChange: (value: string) => void;
  readonly onManualSequenceChange: (value: string) => void;
}

export function SourceEditorsPanel({
  cSource,
  riscVSource,
  sourceSyncState,
  manualSequenceSource,
  onCSourceChange,
  onRiscVSourceChange,
  onManualSequenceChange
}: SourceEditorsPanelProps) {
  return (
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
        onChange={onCSourceChange}
      />
      <EditorPanel title="RISC-V" value={riscVSource} onChange={onRiscVSourceChange} />
      <EditorPanel title="Manual sequence" value={manualSequenceSource} onChange={onManualSequenceChange} />
    </Box>
  );
}
