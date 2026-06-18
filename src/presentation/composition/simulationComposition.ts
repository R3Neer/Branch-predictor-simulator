import { SimulationSessionService } from "../../application";
import { CsvTableExporter, MarkdownTableExporter } from "../../infrastructure/export/TableExporters";
import { SessionYamlMapper } from "../../infrastructure/persistence/SessionYamlMapper";
import { predictorConfigSchema } from "../../infrastructure/predictors/PredictorConfigSchema";
import { officialTemplates } from "../../infrastructure/templates/officialTemplates";

export function createSimulationSessionService(): SimulationSessionService {
  return new SimulationSessionService({
    sessionYamlMapper: new SessionYamlMapper(),
    tableExporters: {
      csv: new CsvTableExporter(),
      markdown: new MarkdownTableExporter()
    }
  });
}

export function getOfficialTemplates() {
  return officialTemplates;
}

export function formatPredictorConfig(config: unknown): string {
  return `${JSON.stringify(config, null, 2)}\n`;
}

export function parsePredictorConfig(source: string): unknown {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    throw new Error("Predictor configuration must be valid JSON.");
  }

  const result = predictorConfigSchema.safeParse(parsed);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const path = firstIssue.path.length > 0 ? `${firstIssue.path.join(".")}: ` : "";
    throw new Error(`${path}${firstIssue.message}`);
  }

  return result.data;
}
