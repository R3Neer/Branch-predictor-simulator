import type { BranchSequence } from "../../domain/simulation/BranchSequence";

export interface ExpectedTemplateStatistics {
  readonly hits?: number;
  readonly misses?: number;
  readonly hitRate?: number;
  readonly missRate?: number;
  readonly memoryBits?: number;
  readonly notes?: string;
}

export interface OfficialTemplateVariant {
  readonly id: string;
  readonly title: string;
  readonly predictorConfig: unknown;
  readonly expectedStatistics?: ExpectedTemplateStatistics;
}

export interface OfficialTemplate {
  readonly id: string;
  readonly exerciseNumber: number;
  readonly title: string;
  readonly statement: string;
  readonly source: "ref_docs/Problemas.pdf";
  readonly branchSequence: BranchSequence;
  readonly variants: readonly OfficialTemplateVariant[];
}
