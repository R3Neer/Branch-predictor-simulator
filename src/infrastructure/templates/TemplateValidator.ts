import { PredictorFactory } from "../../domain/predictors/PredictorFactory";
import { TraceStatsRunner } from "../../application/TraceStatsRunner";
import type { OfficialTemplate, OfficialTemplateVariant } from "./OfficialTemplate";
import { officialTemplateSchema } from "./OfficialTemplateSchema";

export interface TemplateValidationReport {
  readonly templateId: string;
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

export class TemplateValidator {
  constructor(
    private readonly predictorFactory = new PredictorFactory(),
    private readonly traceStatsRunner = new TraceStatsRunner()
  ) {}

  validate(template: OfficialTemplate): TemplateValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];
    const schemaResult = officialTemplateSchema.safeParse(template);

    if (!schemaResult.success) {
      errors.push(...schemaResult.error.issues.map((issue) => issue.message));
    }

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
      const variantResult = this.validateVariant(template, variant);
      errors.push(...variantResult.errors);
      warnings.push(...variantResult.warnings);
    }

    return {
      templateId: template.id,
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateVariant(
    template: OfficialTemplate,
    variant: OfficialTemplateVariant
  ): { errors: string[]; warnings: string[] } {
    const predictor = this.predictorFactory.create(variant.predictorConfig);
    if (!predictor) {
      return { errors: [`${variant.id}: predictor config is not executable yet`], warnings: [] };
    }

    const result = this.traceStatsRunner.run(template.branchSequence, variant.predictorConfig);
    const stats = result.statistics;
    const expected = variant.expectedStatistics;
    const errors: string[] = [];
    const warnings: string[] = [];

    if (expected.hits !== undefined && expected.hits !== stats.hits) {
      this.addDiscrepancy(template, `${variant.id}: expected ${expected.hits} hits, engine produced ${stats.hits}`, errors, warnings);
    }
    if (expected.misses !== undefined && expected.misses !== stats.misses) {
      this.addDiscrepancy(template, `${variant.id}: expected ${expected.misses} misses, engine produced ${stats.misses}`, errors, warnings);
    }
    if (expected.memoryBits !== undefined && expected.memoryBits !== stats.memoryBits) {
      this.addDiscrepancy(template, `${variant.id}: expected ${expected.memoryBits} memory bits, engine produced ${stats.memoryBits}`, errors, warnings);
    }
    if (expected.hitRate !== undefined && !this.sameRatio(expected.hitRate, stats.hitRate.value)) {
      this.addDiscrepancy(template, `${variant.id}: expected hit rate ${expected.hitRate}, engine produced ${stats.hitRate.value}`, errors, warnings);
    }
    if (expected.missRate !== undefined && !this.sameRatio(expected.missRate, stats.missRate.value)) {
      this.addDiscrepancy(template, `${variant.id}: expected miss rate ${expected.missRate}, engine produced ${stats.missRate.value}`, errors, warnings);
    }
    if (variant.officialSolution.stableFromStep !== undefined) {
      const stableTrace = result.trace.filter((step) => step.step >= variant.officialSolution.stableFromStep!);
      if (stableTrace.length === 0) {
        this.addDiscrepancy(template, `${variant.id}: stableFromStep ${variant.officialSolution.stableFromStep} is outside the trace`, errors, warnings);
      } else if (stableTrace.some((step) => !step.hit)) {
        this.addDiscrepancy(template, `${variant.id}: not all predictions hit from step ${variant.officialSolution.stableFromStep}`, errors, warnings);
      }
    }

    return { errors, warnings };
  }

  private sameRatio(expected: number, actual: number): boolean {
    return Math.abs(expected - actual) < 1e-9;
  }

  private addDiscrepancy(
    template: OfficialTemplate,
    message: string,
    errors: string[],
    warnings: string[]
  ): void {
    if (template.verificationStatus === "verified") {
      errors.push(message);
      return;
    }

    warnings.push(message);
  }
}
