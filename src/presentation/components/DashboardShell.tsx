import { Alert, AppBar, Box, Stack, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { CalculationPanel } from "./CalculationPanel";
import { ConfigurationPanel } from "./ConfigurationPanel";
import { ImportSessionPanel } from "./ImportSessionPanel";
import { SimulationTablePanel } from "./SimulationTablePanel";
import { SourceEditorsPanel } from "./SourceEditorsPanel";
import { useSimulationStore } from "../stores/simulationStore";

export function DashboardShell() {
  const {
    templates,
    selectedTemplateId,
    selectedVariantId,
    activeTitle,
    activeStatement,
    activeVariantTitle,
    predictorConfigSource,
    predictorConfigError,
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
    calculationViews,
    selectTemplate,
    selectVariant,
    updateCSource,
    updateRiscVSource,
    updateManualSequenceSource,
    updatePredictorConfigSource,
    updateSessionYamlInput,
    updateStatAnswer,
    updateTableAnswerSource,
    importSessionYaml,
    setMode,
    step,
    stepBack,
    runAll,
    reset,
    calculateStats,
    revealCalculations,
    checkAnswers,
    exportTable,
    exportSessionYaml
  } = useSimulationStore();
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            borderBottom: 1,
            borderColor: "divider",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 0.5, sm: 2 },
            py: { xs: 0.75, sm: 0 }
          }}
        >
          <Typography component="h1" variant="h1" sx={{ flexGrow: 1 }}>
            Branch Predictor Simulator
          </Typography>
          <Tabs
            value={mode}
            aria-label="Work mode"
            onChange={(_event, value: "exam" | "solution") => setMode(value)}
            sx={{
              minHeight: 48,
              width: { xs: "100%", sm: "auto" },
              "& .MuiTab-root": {
                flex: { xs: 1, sm: "0 0 auto" },
                minWidth: { xs: 0, sm: 90 }
              },
              "& .MuiTabs-flexContainer": {
                width: "100%"
              }
            }}
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
          <SourceEditorsPanel
            cSource={cSource}
            riscVSource={riscVSource}
            sourceSyncState={sourceSyncState}
            manualSequenceSource={manualSequenceSource}
            onCSourceChange={updateCSource}
            onRiscVSourceChange={updateRiscVSource}
            onManualSequenceChange={updateManualSequenceSource}
          />
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

          <SimulationTablePanel
            currentStep={currentStep}
            totalSteps={totalSteps}
            tableView={tableView}
            exportedTable={exportedTable}
            exportedSessionYaml={exportedSessionYaml}
            onStep={step}
            onStepBack={stepBack}
            onRunAll={runAll}
            onReset={reset}
            onExportCsv={() => exportTable("csv")}
            onExportMarkdown={() => exportTable("markdown")}
            onExportSessionYaml={exportSessionYaml}
          />
          <CalculationPanel
            mode={mode}
            traceCount={currentStep}
            calculationViews={calculationViews}
            onRevealCalculations={revealCalculations}
          />
          <ImportSessionPanel
            sessionYamlInput={sessionYamlInput}
            sessionImportError={sessionImportError}
            onSessionYamlInputChange={updateSessionYamlInput}
            onImport={importSessionYaml}
          />
        </Stack>

        <ConfigurationPanel
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          selectedVariantId={selectedVariantId}
          activeTitle={activeTitle}
          activeStatement={activeStatement}
          activeVariantTitle={activeVariantTitle}
          traceCount={currentStep}
          predictorConfigSource={predictorConfigSource}
          predictorConfigError={predictorConfigError}
          statAnswerInputs={statAnswerInputs}
          tableAnswerSource={tableAnswerSource}
          tableAnswerError={tableAnswerError}
          correctionReport={correctionReport}
          statistics={statistics}
          onSelectTemplate={selectTemplate}
          onSelectVariant={selectVariant}
          onPredictorConfigSourceChange={updatePredictorConfigSource}
          onTableAnswerSourceChange={updateTableAnswerSource}
          onStatAnswerChange={updateStatAnswer}
          onCheckAnswers={checkAnswers}
          onCalculateStats={calculateStats}
        />
      </Box>
    </Box>
  );
}
