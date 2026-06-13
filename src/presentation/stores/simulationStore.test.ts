import { beforeEach, describe, expect, it } from "vitest";
import { useSimulationStore } from "./simulationStore";

describe("simulationStore", () => {
  beforeEach(() => {
    useSimulationStore.getState().selectTemplate("exercise-1-one-level-2bit");
    useSimulationStore.getState().reset();
    useSimulationStore.setState({
      sessionYamlInput: "",
      sessionImportError: undefined
    });
  });

  it("switches active predictor configuration when selecting a template variant", () => {
    const store = useSimulationStore.getState();

    store.selectTemplate("exercise-2-two-level");
    useSimulationStore.getState().step();
    expect(useSimulationStore.getState().currentStep).toBe(1);

    useSimulationStore.getState().selectVariant("two-level-1-2");

    expect(useSimulationStore.getState()).toMatchObject({
      selectedVariantId: "two-level-1-2",
      activeVariantTitle: "Predictor multinivel (1,2)",
      currentStep: 0,
      trace: []
    });
    expect(useSimulationStore.getState().activePredictorConfig).toMatchObject({
      type: "two-level",
      counterBits: 2,
      countersPerEntry: 2
    });
  });

  it("preserves imported loop ranges when running a YAML session", () => {
    useSimulationStore.getState().updateSessionYamlInput(`version: 1
title: Loop session
language: es
mode: exam
predictorConfig:
  type: one-level
  counterBits: 1
  entries: 1
  initialCounterValue: 0
  indexPolicy:
    type: manual
    entries: 1
source:
  riscVSource: "0x00 bne x1, x2, loop # B1"
  syncState: desynced
branchSequence:
  executions:
    - order: 0
      branchId: B1
      actual: T
      manualIndex: 0
    - order: 1
      branchId: B1
      actual: NT
      manualIndex: 0
  loops:
    - startOrder: 0
      endOrder: 1
      repetitions: 3
`);

    useSimulationStore.getState().importSessionYaml();
    useSimulationStore.getState().runAll();

    expect(useSimulationStore.getState().sessionImportError).toBeUndefined();
    expect(useSimulationStore.getState().currentStep).toBe(6);
    expect(useSimulationStore.getState().trace).toHaveLength(6);
  });
});
