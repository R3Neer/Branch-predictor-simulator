import { assertPositiveInteger } from "../shared/BitString";
import type { BranchExecution } from "../simulation/BranchSequence";
import type { Indexer, IndexResult } from "./Indexer";

export interface ManualIndexConfig {
  readonly entries: number;
}

export class ManualIndexer implements Indexer<ManualIndexConfig> {
  resolveIndex(execution: BranchExecution, config: ManualIndexConfig): IndexResult {
    assertPositiveInteger(config.entries, "entries");

    if (execution.manualIndex === undefined) {
      throw new Error(`branch ${execution.branchId} needs a manual index`);
    }

    if (!Number.isInteger(execution.manualIndex) || execution.manualIndex < 0) {
      throw new RangeError("manualIndex must be a non-negative integer");
    }
    if (execution.manualIndex >= config.entries) {
      throw new RangeError(`manualIndex ${execution.manualIndex} exceeds table size ${config.entries}`);
    }

    return {
      index: execution.manualIndex,
      calculation: {
        policy: "manual",
        operation: "manual index",
        resultIndex: String(execution.manualIndex)
      }
    };
  }
}
