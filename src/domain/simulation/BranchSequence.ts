import type { Outcome } from "../shared/Outcome";

export type BranchId = `B${number}` | string;

export interface BranchExecution {
  readonly order: number;
  readonly branchId: BranchId;
  readonly actual: Outcome;
  readonly address?: number;
  readonly manualIndex?: number;
  readonly comment?: string;
}

export interface LoopRange {
  readonly startOrder: number;
  readonly endOrder: number;
  readonly repetitions: number;
}

export interface BranchSequence {
  readonly executions: readonly BranchExecution[];
  readonly loops: readonly LoopRange[];
}
