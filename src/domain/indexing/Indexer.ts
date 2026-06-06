import type { BranchExecution } from "../simulation/BranchSequence";
import type { IndexCalculation } from "../predictors/BranchPredictor";

export interface IndexResult {
  readonly index: number;
  readonly calculation: IndexCalculation;
}

export interface Indexer<TConfig> {
  resolveIndex(execution: BranchExecution, config: TConfig): IndexResult;
}
