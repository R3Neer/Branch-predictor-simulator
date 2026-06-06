import { GselectPredictor } from "../../domain/predictors/GselectPredictor";
import { GsharePredictor } from "../../domain/predictors/GsharePredictor";
import { GlobalCorrelatedPredictor } from "../../domain/predictors/GlobalCorrelatedPredictor";
import { LocalCorrelatedPredictor } from "../../domain/predictors/LocalCorrelatedPredictor";
import { OneLevelPredictor } from "../../domain/predictors/OneLevelPredictor";
import { TwoLevelPredictor } from "../../domain/predictors/TwoLevelPredictor";
import { SimulationEngine } from "../../domain/simulation/SimulationEngine";
import { StatsCalculator } from "../../domain/stats/StatsCalculator";
import type { OfficialTemplate, OfficialTemplateVariant } from "./OfficialTemplate";

export interface TemplateValidationReport {
  readonly templateId: string;
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

export class TemplateValidator {
  validate(template: OfficialTemplate): TemplateValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (template.exerciseNumber === 6) {
      errors.push("exercise 6 is excluded from v1 because it requires Tournament");
    }
    if (template.branchSequence.executions.length === 0) {
      errors.push("template must include a branch sequence");
    }
    if (template.variants.length === 0) {
      errors.push("template must include at least one predictor variant");
    }

    for (const variant of template.variants) {
      const variantWarnings = this.validateVariant(template, variant);
      warnings.push(...variantWarnings);
    }

    return {
      templateId: template.id,
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateVariant(template: OfficialTemplate, variant: OfficialTemplateVariant): string[] {
    const predictor = createPredictor(variant.predictorConfig);
    if (!predictor) {
      return [`${variant.id}: predictor config is not executable yet`];
    }

    const engine = new SimulationEngine();
    const run = engine.runToCompletion(
      engine.initialise(template.branchSequence, predictor as never, variant.predictorConfig as never),
      predictor as never
    );
    const memoryUsage =
      "memoryUsage" in predictor
        ? (predictor.memoryUsage as (config: unknown) => { bits: number; entries: number })(
            variant.predictorConfig
          )
        : undefined;
    const stats = new StatsCalculator().calculate(run.trace, memoryUsage);
    const expected = variant.expectedStatistics;
    const warnings: string[] = [];

    if (expected?.hits !== undefined && expected.hits !== stats.hits) {
      warnings.push(`${variant.id}: expected ${expected.hits} hits, engine produced ${stats.hits}`);
    }
    if (expected?.misses !== undefined && expected.misses !== stats.misses) {
      warnings.push(
        `${variant.id}: expected ${expected.misses} misses, engine produced ${stats.misses}`
      );
    }
    if (expected?.memoryBits !== undefined && expected.memoryBits !== stats.memoryBits) {
      warnings.push(
        `${variant.id}: expected ${expected.memoryBits} memory bits, engine produced ${stats.memoryBits}`
      );
    }

    return warnings;
  }
}

function createPredictor(config: unknown) {
  if (!config || typeof config !== "object" || !("type" in config)) {
    return undefined;
  }

  switch ((config as { type: string }).type) {
    case "one-level":
      return new OneLevelPredictor();
    case "two-level":
      return new TwoLevelPredictor();
    case "global-correlated":
      return new GlobalCorrelatedPredictor();
    case "gshare":
      return new GsharePredictor();
    case "gselect":
      return new GselectPredictor();
    case "local-correlated":
      return new LocalCorrelatedPredictor();
    default:
      return undefined;
  }
}
