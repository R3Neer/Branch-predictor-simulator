import { describe, expect, it } from "vitest";
import type { BranchSequence } from "../domain/simulation/BranchSequence";
import { TraceStatsRunner } from "./TraceStatsRunner";

describe("TraceStatsRunner", () => {
  it("runs one-level predictor traces and statistics through the shared path", () => {
    const sequence: BranchSequence = {
      executions: [
        { order: 0, branchId: "B1", actual: "T", manualIndex: 0 },
        { order: 1, branchId: "B1", actual: "NT", manualIndex: 0 }
      ],
      loops: []
    };

    const result = new TraceStatsRunner().run(sequence, {
      type: "one-level",
      counterBits: 1,
      entries: 1,
      initialCounterValue: 0,
      indexPolicy: { type: "manual", entries: 1 }
    });

    expect(result.trace).toHaveLength(2);
    expect(result.statistics).toMatchObject({ hits: 0, misses: 2, memoryBits: 1 });
  });

  it("calculates gshare memory usage from an existing trace", () => {
    const sequence: BranchSequence = {
      executions: [
        { order: 0, branchId: "B1", actual: "T", address: 0x54 },
        { order: 1, branchId: "B1", actual: "T", address: 0x54 }
      ],
      loops: []
    };
    const config = {
      type: "gshare",
      ghrBits: 8,
      ghrBitsUsed: 8,
      pcBits: 8,
      phtEntries: 256,
      counterBits: 2,
      initialGhrValue: 0,
      initialCounterValue: 0
    };
    const runner = new TraceStatsRunner();
    const result = runner.run(sequence, config);

    expect(runner.calculateFromTrace(result.trace, config).memoryBits).toBe(520);
  });
});
