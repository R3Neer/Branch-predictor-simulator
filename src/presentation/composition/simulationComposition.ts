import { SimulationSessionService } from "../../application";
import { CsvTableExporter, MarkdownTableExporter } from "../../infrastructure/export/TableExporters";
import { SessionYamlMapper } from "../../infrastructure/persistence/SessionYamlMapper";
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
