import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Stack, Typography } from "@mui/material";
import type { CalculationView, SessionMode } from "../../application";
import { CalculateIcon } from "./ActionIcons";

export interface CalculationPanelProps {
  readonly mode: SessionMode;
  readonly traceCount: number;
  readonly calculationViews?: readonly CalculationView[];
  readonly onRevealCalculations: () => void;
}

export function CalculationPanel({
  mode,
  traceCount,
  calculationViews,
  onRevealCalculations
}: CalculationPanelProps) {
  if (mode !== "solution") {
    return null;
  }

  return (
    <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
      <AccordionSummary aria-controls="calculations-panel" id="calculations-header">
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", width: "100%" }}>
          <Typography component="h2" variant="h2" sx={{ flexGrow: 1 }}>
            Calculations
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails id="calculations-panel">
        <Stack spacing={1.5}>
          <Button
            startIcon={<CalculateIcon />}
            variant="outlined"
            onClick={onRevealCalculations}
            disabled={traceCount === 0}
          >
            Show calculations
          </Button>
          {calculationViews?.map((view, index) => (
            <Box key={`${view.summary}-${index}`} sx={{ borderTop: 1, borderColor: "divider", pt: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Step {index + 1}: {view.summary}
              </Typography>
              {view.sections.map((section) => (
                <Box key={`${index}-${section.title}`} sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {section.title}
                  </Typography>
                  {section.rows.map((row) => (
                    <Typography key={`${row.label}-${row.operation}`} variant="body2" color="text.secondary">
                      {formatCalculationRow(row)}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Box>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function formatCalculationRow(row: CalculationView["sections"][number]["rows"][number]) {
  return [row.label, row.valueBefore, row.operation, row.valueAfter].filter(Boolean).join(" -> ");
}
