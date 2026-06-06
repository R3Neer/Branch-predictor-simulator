import type {
  BranchPredictor,
  MemoryMeasurable,
  PredictionResult,
  PredictorState,
  UpdateResult
} from "./BranchPredictor";
import { SaturatingCounter } from "./SaturatingCounter";
import type { BranchExecution } from "../simulation/BranchSequence";
import type { Outcome } from "../shared/Outcome";
import type { Indexer } from "../indexing/Indexer";
import { LsbIndexer, type LsbIndexConfig } from "../indexing/LsbIndexer";
import { ManualIndexer, type ManualIndexConfig } from "../indexing/ManualIndexer";
import { assertPositiveInteger } from "../shared/BitString";

export type OneLevelIndexPolicy =
  | ({ readonly type: "lsb" } & LsbIndexConfig)
  | ({ readonly type: "manual" } & ManualIndexConfig);

export interface OneLevelConfig {
  readonly type: "one-level";
  readonly counterBits: number;
  readonly entries: number;
  readonly initialCounterValue: number;
  readonly indexPolicy: OneLevelIndexPolicy;
}

export interface OneLevelState extends PredictorState {
  readonly type: "one-level";
  readonly indexPolicy: OneLevelIndexPolicy;
  readonly counters: readonly SaturatingCounter[];
  readonly entryBranchIds: Readonly<Record<number, readonly string[]>>;
}

export class OneLevelPredictor
  implements BranchPredictor<OneLevelConfig, OneLevelState>, MemoryMeasurable<OneLevelConfig>
{
  initialise(config: OneLevelConfig): OneLevelState {
    this.validateConfig(config);

    return {
      type: "one-level",
      indexPolicy: config.indexPolicy,
      entryBranchIds: {},
      counters: Array.from(
        { length: config.entries },
        () => new SaturatingCounter(config.counterBits, config.initialCounterValue)
      )
    };
  }

  predict(execution: BranchExecution, state: OneLevelState): PredictionResult<OneLevelState> {
    const { index, calculation } = this.resolveIndex(execution, state);
    const counter = state.counters[index];

    return {
      prediction: counter.predict(),
      stateBefore: state,
      trace: {
        selectedEntry: String(index),
        counterBefore: counter.toBits(),
        indexCalculation: calculation,
        compactExplanation: `Entry ${index} contains ${counter.toBits()}, so it predicts ${counter.predict()}.`
      }
    };
  }

  update(
    execution: BranchExecution,
    actualOutcome: Outcome,
    state: OneLevelState
  ): UpdateResult<OneLevelState> {
    const { index } = this.resolveIndex(execution, state);
    const before = state.counters[index];
    const after = before.update(actualOutcome);
    const entryBranchIds = this.recordBranchAccess(state, index, execution.branchId);
    const counters = state.counters.map((counter, counterIndex) =>
      counterIndex === index ? after : counter
    );

    return {
      stateAfter: {
        type: "one-level",
        indexPolicy: state.indexPolicy,
        entryBranchIds,
        counters
      },
      trace: {
        counterAfter: after.toBits(),
        saturationApplied: before.value === after.value,
        aliasingEvent: this.createAliasingEvent(index, entryBranchIds[index])
      }
    };
  }

  memoryUsage(config: OneLevelConfig) {
    this.validateConfig(config);

    return {
      bits: config.entries * config.counterBits,
      entries: config.entries
    };
  }

  private resolveIndex(execution: BranchExecution, state: OneLevelState) {
    if (state.counters.length === 0) {
      throw new Error("one-level predictor needs at least one counter");
    }

    const indexer = this.createIndexer(state.indexPolicy);
    const result = indexer.resolveIndex(execution, state.indexPolicy);
    if (result.index >= state.counters.length) {
      throw new RangeError(`index ${result.index} exceeds counter table size ${state.counters.length}`);
    }

    return result;
  }

  private createIndexer(policy: OneLevelIndexPolicy): Indexer<OneLevelIndexPolicy> {
    if (policy.type === "manual") {
      return new ManualIndexer() as Indexer<OneLevelIndexPolicy>;
    }

    return new LsbIndexer() as Indexer<OneLevelIndexPolicy>;
  }

  private validateConfig(config: OneLevelConfig): void {
    assertPositiveInteger(config.counterBits, "counterBits");
    assertPositiveInteger(config.entries, "entries");
    if (config.entries !== config.indexPolicy.entries) {
      throw new Error("config.entries must match config.indexPolicy.entries");
    }

    new SaturatingCounter(config.counterBits, config.initialCounterValue);
  }

  private recordBranchAccess(
    state: OneLevelState,
    index: number,
    branchId: string
  ): Readonly<Record<number, readonly string[]>> {
    const previousBranchIds = state.entryBranchIds[index] ?? [];
    const nextBranchIds = previousBranchIds.includes(branchId)
      ? previousBranchIds
      : [...previousBranchIds, branchId];

    return {
      ...state.entryBranchIds,
      [index]: nextBranchIds
    };
  }

  private createAliasingEvent(index: number, branchIds: readonly string[] | undefined) {
    if (!branchIds || branchIds.length < 2) {
      return undefined;
    }

    return {
      entry: String(index),
      branchIds,
      description: `Entry ${index} is shared by ${branchIds.join(", ")}.`
    };
  }
}
