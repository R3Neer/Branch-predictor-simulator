import { PredictorFactory } from "../domain/predictors/PredictorFactory";
import type { BranchSequence } from "../domain/simulation/BranchSequence";
import { SequenceExpander } from "../domain/simulation/SequenceExpander";
import { SimulationEngine } from "../domain/simulation/SimulationEngine";
import type { TraceStep } from "../domain/simulation/TraceStep";
import { StatsCalculator, type StatisticsSet } from "../domain/stats/StatsCalculator";

export interface TraceStatsResult {
  readonly trace: readonly TraceStep[];
  readonly statistics: StatisticsSet;
}

export class TraceStatsRunner {
  constructor(
    private readonly predictorFactory = new PredictorFactory(),
    private readonly sequenceExpander = new SequenceExpander(),
    private readonly statsCalculator = new StatsCalculator()
  ) {}

  run(
    branchSequence: BranchSequence,
    predictorConfig: unknown,
    limit = this.expandedLength(branchSequence)
  ): TraceStatsResult {
    const predictor = this.predictorFactory.create(predictorConfig);
    if (!predictor) {
      return {
        trace: [],
        statistics: this.statsCalculator.calculate([])
      };
    }

    const limitedSequence = {
      executions: this.sequenceExpander.expand(branchSequence).slice(0, limit),
      loops: []
    };
    const engine = new SimulationEngine();
    const trace = engine.runToCompletion(
      engine.initialise(limitedSequence, predictor as never, predictorConfig as never),
      predictor as never
    ).trace;

    return {
      trace,
      statistics: this.calculateFromTrace(trace, predictorConfig)
    };
  }

  calculateFromTrace(trace: readonly TraceStep[], predictorConfig: unknown): StatisticsSet {
    const predictor = this.predictorFactory.create(predictorConfig);
    const memoryUsage =
      predictor && "memoryUsage" in predictor
        ? (predictor.memoryUsage as (config: unknown) => { bits: number; entries: number })(
            predictorConfig
          )
        : undefined;

    return this.statsCalculator.calculate(trace, memoryUsage);
  }

  expandedLength(branchSequence: BranchSequence): number {
    return this.sequenceExpander.expand(branchSequence).length;
  }
}
