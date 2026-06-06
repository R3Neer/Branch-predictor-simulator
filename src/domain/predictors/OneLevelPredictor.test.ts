import { describe, expect, it } from "vitest";
import { OneLevelPredictor, type OneLevelConfig } from "./OneLevelPredictor";

const config: OneLevelConfig = {
  type: "one-level",
  counterBits: 2,
  entries: 4,
  initialCounterValue: 1,
  indexPolicy: { type: "manual", entries: 4 }
};

describe("OneLevelPredictor", () => {
  it("predicts and updates only the selected counter", () => {
    const predictor = new OneLevelPredictor();
    const initial = predictor.initialise(config);
    const execution = { order: 0, branchId: "B1", actual: "T" as const, manualIndex: 2 };

    const prediction = predictor.predict(execution, initial);
    expect(prediction.prediction).toBe("NT");
    expect(prediction.trace.counterBefore).toBe("01");
    expect(prediction.trace.selectedEntry).toBe("2");

    const updated = predictor.update(execution, "T", initial).stateAfter;
    expect(updated.counters.map((counter) => counter.toBits())).toEqual([
      "01",
      "01",
      "10",
      "01"
    ]);
  });

  it("supports 1-bit counters", () => {
    const predictor = new OneLevelPredictor();
    const initial = predictor.initialise({
      type: "one-level",
      counterBits: 1,
      entries: 1,
      initialCounterValue: 0,
      indexPolicy: { type: "manual", entries: 1 }
    });

    const execution = { order: 0, branchId: "B1", actual: "T" as const, manualIndex: 0 };
    const updated = predictor.update(execution, "T", initial).stateAfter;

    expect(predictor.predict(execution, initial).prediction).toBe("NT");
    expect(predictor.predict(execution, updated).prediction).toBe("T");
  });

  it("uses configured LSB indexing when no manual index is provided", () => {
    const predictor = new OneLevelPredictor();
    const initial = predictor.initialise({
      type: "one-level",
      counterBits: 2,
      entries: 8,
      initialCounterValue: 2,
      indexPolicy: { type: "lsb", entries: 8, addressBits: 3 }
    });

    const prediction = predictor.predict(
      { order: 0, branchId: "B3", actual: "NT", address: 0x15 },
      initial
    );

    expect(prediction.trace.selectedEntry).toBe("5");
    expect(prediction.trace.indexCalculation).toMatchObject({
      policy: "lsb",
      resultIndex: "5"
    });
  });

  it("rejects incoherent table and index policy sizes", () => {
    const predictor = new OneLevelPredictor();

    expect(() =>
      predictor.initialise({
        type: "one-level",
        counterBits: 2,
        entries: 4,
        initialCounterValue: 1,
        indexPolicy: { type: "manual", entries: 8 }
      })
    ).toThrow("config.entries must match");
  });

  it("does not mutate the previous state when updating", () => {
    const predictor = new OneLevelPredictor();
    const initial = predictor.initialise(config);
    const execution = { order: 0, branchId: "B1", actual: "T" as const, manualIndex: 2 };

    const updated = predictor.update(execution, "T", initial).stateAfter;

    expect(initial.counters[2].toBits()).toBe("01");
    expect(updated.counters[2].toBits()).toBe("10");
  });

  it("reports aliasing when two branches share an entry", () => {
    const predictor = new OneLevelPredictor();
    const initial = predictor.initialise(config);
    const afterB1 = predictor.update(
      { order: 0, branchId: "B1", actual: "T", manualIndex: 2 },
      "T",
      initial
    ).stateAfter;
    const updateB2 = predictor.update(
      { order: 1, branchId: "B2", actual: "NT", manualIndex: 2 },
      "NT",
      afterB1
    );

    expect(updateB2.trace.aliasingEvent).toMatchObject({
      entry: "2",
      branchIds: ["B1", "B2"]
    });
  });

  it("reports memory usage from entries and counter bits", () => {
    const predictor = new OneLevelPredictor();

    expect(predictor.memoryUsage(config)).toEqual({ bits: 8, entries: 4 });
  });
});
